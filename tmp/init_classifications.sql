SET NAMES utf8mb4;

USE java_jiazheng;

-- 确保分类表有数据
INSERT INTO b_classification (id, title, create_time) VALUES 
(1, '育儿嫂', NOW()),
(2, '月嫂服务', NOW()),
(3, '保洁服务', NOW()),
(4, '护工陪护', NOW())
ON DUPLICATE KEY UPDATE 
    title = VALUES(title),
    create_time = VALUES(create_time);

-- 检查分类表
SELECT * FROM b_classification;
