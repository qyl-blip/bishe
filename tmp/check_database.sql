-- 检查数据库中的数据
USE java_jiazheng;

-- 检查分类表
SELECT * FROM b_classification;

-- 检查Thing表数据量
SELECT COUNT(*) as total_count FROM b_thing;

-- 检查各城市的数据量
SELECT city, COUNT(*) as count FROM b_thing GROUP BY city;

-- 检查各分类的数据量
SELECT classification_id, COUNT(*) as count FROM b_thing GROUP BY classification_id;

-- 查看前10条数据
SELECT id, title, city, location, classification_id, price, status FROM b_thing LIMIT 10;
