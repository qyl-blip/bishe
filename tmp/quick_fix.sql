SET NAMES utf8mb4;

USE java_jiazheng;

-- ========================================
-- 快速修复脚本
-- ========================================

-- 1. 确保分类表有数据
INSERT INTO b_classification (id, title, create_time) VALUES 
(1, '育儿嫂', NOW()),
(2, '月嫂服务', NOW()),
(3, '保洁服务', NOW()),
(4, '护工陪护', NOW())
ON DUPLICATE KEY UPDATE title = VALUES(title);

-- 2. 检查Thing表是否有数据
SELECT '检查Thing表数据量' as info;
SELECT COUNT(*) as total_count FROM b_thing;

-- 3. 如果有数据，检查status字段
SELECT '检查status分布' as info;
SELECT status, COUNT(*) as count FROM b_thing GROUP BY status;

-- 4. 将所有数据的status设置为'0'（审核通过）
UPDATE b_thing SET status='0';

-- 5. 检查classification_id是否有NULL值
SELECT '检查classification_id是否有NULL' as info;
SELECT COUNT(*) as null_count FROM b_thing WHERE classification_id IS NULL;

-- 6. 检查各城市数据量
SELECT '各城市数据量' as info;
SELECT city, COUNT(*) as count FROM b_thing GROUP BY city;

-- 7. 检查各分类数据量
SELECT '各分类数据量' as info;
SELECT c.id, c.title, COUNT(t.id) as count 
FROM b_classification c 
LEFT JOIN b_thing t ON c.id = t.classification_id 
GROUP BY c.id, c.title;

-- 8. 查看前5条数据
SELECT '前5条数据示例' as info;
SELECT id, title, city, location, classification_id, price, status, cover FROM b_thing LIMIT 5;

SELECT '修复完成！' as info;
