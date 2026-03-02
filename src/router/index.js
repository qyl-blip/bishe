import { createRouter, createWebHistory } from 'vue-router';
import root from './root';
import { ADMIN_USER_TOKEN, USER_TOKEN } from '/@/store/constants';

// 【修改点1】引入你刚才新建的本地服务页面组件
// 请确保路径和文件名与你实际创建的一致
import LocalService from '/@/views/local/LocalService.vue';

// 路由权限白名单
// 【修改点2】在数组里加上 'localService'，允许不登录就能访问
const allowList = ['adminLogin', 'login', 'register', 'portal', 'search', 'detail', '403', '404', 'localService', 'nannyService', 'specialService'];

// 前台登录地址
const loginRoutePath = '/index/login';
// 后台登录地址
const adminLoginRoutePath = '/adminLogin';

// 【修改点3】将新路由手动添加到 root 数组中
// 注意：这里路径必须以 /index 开头，才能被下面的前台路由逻辑识别
root.push(
  {
    path: '/index/local',
    name: 'localService',
    component: () => import('/@/views/local/LocalService.vue'),
    meta: { title: '附近家政' }
  },
  {
    path: '/index/nanny',
    name: 'nannyService',
    component: () => import('/@/views/local/NannyService.vue'),
    meta: { title: '金牌月嫂' }
  },
  {
    path: '/index/special',
    name: 'specialService',
    component: () => import('/@/views/local/SpecialService.vue'),
    meta: { title: '保洁特惠' }
  }
);

const router = createRouter({
  history: createWebHistory(),
  routes: root,
});

router.beforeEach(async (to, from, next) => {
  console.log(to, from);

  /** 后台路由 **/
  if (to.path.startsWith('/admin')) {
    if (localStorage.getItem(ADMIN_USER_TOKEN)) {
      if (to.path === adminLoginRoutePath) {
        next({ path: '/' });
      } else {
        next();
      }
    } else {
      if (allowList.includes(to.name)) {
        // 在免登录名单，直接进入
        next();
      } else {
        next({ path: adminLoginRoutePath, query: { redirect: to.fullPath } });
      }
    }
    // next()
  }

  /** 前台路由 **/
  // 注意：因为我们把新页面路径设为了 /index/local，所以会进入这里判断
  if (to.path.startsWith('/index')) {
    if (localStorage.getItem(USER_TOKEN)) {
      if (to.path === loginRoutePath) {
        next({ path: '/' });
      } else {
        next();
      }
    } else {
      if (allowList.includes(to.name)) {
        // 【关键】因为刚才把 localService 加到了 allowList，所以这里会直接 next() 放行
        next();
      } else {
        next({ path: loginRoutePath, query: { redirect: to.fullPath } });
      }
    }
    // next()
  }
});

router.afterEach((_to) => {
  // 回到顶部
  document.getElementById("html")?.scrollTo(0, 0);
});

export default router;