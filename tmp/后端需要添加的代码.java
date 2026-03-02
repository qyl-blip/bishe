// ========================================
// 文件1: AppointmentController.java
// 位置: housekeeping-cloud/housekeeping-api/src/main/java/com/gk/study/controller/AppointmentController.java
// 在现有的 AppointmentController 类中添加以下方法
// ========================================

/**
 * 获取服务提供者收到的预约列表
 * 根据用户发布的Thing来查询预约
 */
@Access(level = AccessLevel.LOGIN)
@RequestMapping(value = "/received", method = RequestMethod.GET)
public APIResponse getReceivedAppointments(HttpServletRequest request) {
    // 1. 从TOKEN获取当前用户ID
    String token = request.getHeader("TOKEN");
    if (!StringUtils.hasText(token)) {
        return new APIResponse(ResponeCode.FAIL, "用户未登录");
    }
    
    User user = userService.getUserByToken(token);
    if (user == null) {
        return new APIResponse(ResponeCode.FAIL, "用户未登录");
    }
    
    try {
        String userId = user.getId().toString();
        
        // 2. 调用service获取收到的预约
        List<Appointment> appointments = service.getReceivedAppointments(userId);
        
        logger.info("获取收到的预约列表成功 - 用户ID: {}, 预约数量: {}", userId, appointments.size());
        
        return new APIResponse(ResponeCode.SUCCESS, "获取成功", appointments);
    } catch (Exception e) {
        logger.error("获取收到的预约列表失败 - 用户ID: {}, 错误: {}", user.getId(), e.getMessage(), e);
        return new APIResponse(ResponeCode.FAIL, "获取预约列表失败");
    }
}

// ========================================
// 文件2: AppointmentService.java (接口)
// 位置: housekeeping-cloud/housekeeping-api/src/main/java/com/gk/study/service/AppointmentService.java
// 在接口中添加方法声明
// ========================================

/**
 * 获取服务提供者收到的预约列表
 * @param userId 服务提供者的用户ID
 * @return 预约列表
 */
List<Appointment> getReceivedAppointments(String userId);

// ========================================
// 文件3: AppointmentServiceImpl.java (实现类)
// 位置: housekeeping-cloud/housekeeping-api/src/main/java/com/gk/study/service/impl/AppointmentServiceImpl.java
// 在实现类中添加方法实现
// ========================================

@Autowired
ThingService thingService;

/**
 * 获取服务提供者收到的预约列表
 * @param userId 服务提供者的用户ID
 * @return 预约列表
 */
@Override
public List<Appointment> getReceivedAppointments(String userId) {
    // 1. 查询该用户发布的所有Thing
    List<Thing> userThings = thingService.getUserThing(userId);
    
    if (userThings == null || userThings.isEmpty()) {
        return new ArrayList<>();
    }
    
    // 2. 获取这些Thing的ID列表
    List<String> thingIds = userThings.stream()
        .map(t -> String.valueOf(t.getId()))
        .collect(Collectors.toList());
    
    // 3. 查询这些Thing的所有预约
    return appointmentMapper.selectAppointmentsByThingIds(thingIds);
}

// ========================================
// 文件4: AppointmentMapper.java (Mapper接口)
// 位置: housekeeping-cloud/housekeeping-api/src/main/java/com/gk/study/mapper/AppointmentMapper.java
// 在Mapper接口中添加方法声明
// ========================================

/**
 * 根据Thing ID列表查询预约（带详细信息）
 * @param thingIds Thing ID列表
 * @return 预约列表
 */
List<Appointment> selectAppointmentsByThingIds(@Param("thingIds") List<String> thingIds);

// ========================================
// 文件5: AppointmentMapper.xml
// 位置: housekeeping-cloud/housekeeping-api/src/main/resources/mapper/AppointmentMapper.xml
// 在XML文件中添加SQL查询
// ========================================

<!-- 根据Thing ID列表查询预约（带详细信息） -->
<select id="selectAppointmentsByThingIds" resultType="com.gk.study.entity.Appointment">
    SELECT 
        a.id,
        a.appointment_number as appointmentNumber,
        a.thing_id as thingId,
        a.user_id as userId,
        a.appointment_date as appointmentDate,
        a.slot_id as slotId,
        a.receiver_name as receiverName,
        a.receiver_phone as receiverPhone,
        a.receiver_address as receiverAddress,
        a.remark,
        a.status,
        a.create_time as createTime,
        t.title as thingTitle,
        t.cover,
        ts.start_time as slotTime
    FROM b_appointment a
    LEFT JOIN b_thing t ON a.thing_id = t.id
    LEFT JOIN b_time_slot ts ON a.slot_id = ts.id
    WHERE a.thing_id IN
    <foreach collection="thingIds" item="thingId" open="(" separator="," close=")">
        #{thingId}
    </foreach>
    ORDER BY a.create_time DESC
</select>

// ========================================
// 可选：增加浏览量功能
// ========================================

// 在 ThingService.java 接口中添加：
void incrementPv(String id);

// 在 ThingServiceImpl.java 实现类中添加：
@Override
public void incrementPv(String id) {
    Thing thing = getThingById(id);
    if (thing != null) {
        int currentPv = thing.getPv() != null ? Integer.parseInt(thing.getPv()) : 0;
        thing.setPv(String.valueOf(currentPv + 1));
        mapper.updateById(thing);
    }
}

// 在 ThingController.java 的 detail 方法中调用：
@RequestMapping(value = "/detail", method = RequestMethod.GET)
public APIResponse detail(String id){
    Thing thing = service.getThingById(id);
    if (thing == null) {
        return new APIResponse(ResponeCode.FAIL, "未找到数据");
    }
    
    // 增加浏览量
    try {
        service.incrementPv(id);
    } catch (Exception e) {
        logger.warn("增加浏览量失败 - ID: {}, 错误: {}", id, e.getMessage());
    }
    
    return new APIResponse(ResponeCode.SUCCESS, "获取成功", thing);
}

// ========================================
// 需要导入的包（如果还没有的话）
// ========================================
import java.util.stream.Collectors;
import java.util.ArrayList;
import org.apache.ibatis.annotations.Param;
