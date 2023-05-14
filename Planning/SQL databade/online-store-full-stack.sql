/*!40101 SET NAMES utf8 */;
/*!40014 SET FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET SQL_NOTES=0 */;
DROP TABLE IF EXISTS categories;
CREATE TABLE `categories` (
  `category_id` int NOT NULL AUTO_INCREMENT,
  `category_name` varchar(50) NOT NULL,
  PRIMARY KEY (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS colors;
CREATE TABLE `colors` (
  `color_id` int NOT NULL AUTO_INCREMENT,
  `color_name` varchar(512) DEFAULT NULL,
  `color_hex` varchar(512) DEFAULT NULL,
  `group_color` varchar(512) DEFAULT NULL,
  PRIMARY KEY (`color_id`),
  KEY `group_color` (`group_color`),
  CONSTRAINT `colors_ibfk_1` FOREIGN KEY (`group_color`) REFERENCES `group_colors` (`group_color`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS customers;
CREATE TABLE `customers` (
  `customer_id` int NOT NULL AUTO_INCREMENT,
  `customer_first_name` varchar(215) DEFAULT NULL,
  `customer_last_name` varchar(215) DEFAULT NULL,
  `email` varchar(215) DEFAULT NULL,
  `phone` varchar(215) DEFAULT NULL,
  `password` varchar(260) DEFAULT NULL,
  PRIMARY KEY (`customer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS genders;
CREATE TABLE `genders` (
  `gender_id` int NOT NULL AUTO_INCREMENT,
  `gender` varchar(50) NOT NULL,
  PRIMARY KEY (`gender_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS group_colors;
CREATE TABLE `group_colors` (
  `group_color` varchar(512) NOT NULL,
  `hex_code` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`group_color`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS product_categories;
CREATE TABLE `product_categories` (
  `product_id` int DEFAULT NULL,
  `category_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS product_colors;
CREATE TABLE `product_colors` (
  `product_id` int DEFAULT NULL,
  `color_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS product_genders;
CREATE TABLE `product_genders` (
  `product_id` int DEFAULT NULL,
  `gender_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS product_sizes;
CREATE TABLE `product_sizes` (
  `product_id` int DEFAULT NULL,
  `size_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS products;
CREATE TABLE `products` (
  `product_id` int NOT NULL AUTO_INCREMENT,
  `product_name` varchar(215) DEFAULT NULL,
  `product_discription` varchar(300) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  PRIMARY KEY (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS sizes;
CREATE TABLE `sizes` (
  `size_id` int NOT NULL AUTO_INCREMENT,
  `size` int DEFAULT NULL,
  PRIMARY KEY (`size_id`),
  UNIQUE KEY `size` (`size`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO categories(category_id,category_name) VALUES(1,'Sneakers'),(2,'Heels'),(3,'Boots'),(4,'Formal'),(5,'Sandles'),(6,'Crocs'),(7,'Trainers');

INSERT INTO colors(color_id,color_name,color_hex,group_color) VALUES(1,'Black','#000000','Black'),(2,'White','#ffffff','White'),(3,'Grey','#808080','Grey'),(4,'Red','#ff0000','Red'),(5,'Blue','#0000ff','Blue'),(6,'Green','#008000','Green'),(7,'Orange','#ffa500','Orange'),(8,'Pink','#FFC0CB','Pink'),(9,'Silver','#C0C0C0','Silver'),(10,'Purple','#800080','Purple'),(11,'Yellow','#FFFF00','Yellow'),(12,'Brown','#A52A2A','Brown'),(14,'Line Green','#B7E241','Green'),(15,'Pumpkin','#EA9149','Orange'),(16,'Deep Lavender','#826AD9','Purple'),(17,'Fern Green','#73BF78','Green'),(18,'Sand','#D9AD77','Orange'),(19,'Salmon','#EC5D5D','Red');


INSERT INTO genders(gender_id,gender) VALUES(1,'Male'),(2,'Female');

INSERT INTO group_colors(group_color,hex_code) VALUES('Black','#000000'),('Blue','#0000FF'),('Brown','#A52A2A'),('Green','#008000'),('Grey','#808080'),('Orange','#FFA500'),('Pink','#FFC0CB'),('Purple','#800080'),('Red','#FF0000'),('Silver','#C0C0C0'),('White','#FFFFFF'),('Yellow','#FFFF00');

INSERT INTO product_categories(product_id,category_id) VALUES(1,1),(1,7),(2,1);

INSERT INTO product_colors(product_id,color_id) VALUES(1,8),(1,14),(1,15),(1,16),(2,8),(2,17),(2,18),(2,19);

INSERT INTO product_genders(product_id,gender_id) VALUES(1,1),(1,2),(2,1),(2,2);

INSERT INTO product_sizes(product_id,size_id) VALUES(1,4),(1,5),(1,6),(1,7),(2,4),(2,5),(2,7),(2,9);

INSERT INTO products(product_id,product_name,product_discription,price,quantity) VALUES(1,'Nike SuperRep','Nike SuperRep is a breathable, supportive training shoe with two layers of foam for cushioning and stability, plus a burpee break for mobility.',1300.00,21),(2,'Vans Old Skool','The Vans Old Skool is a classic low-top skate shoe with a canvas and suede upper, iconic side stripe, padded collar, reinforced toe cap, and signature waffle outsole.',700.00,42);
INSERT INTO sizes(size_id,size) VALUES(1,1),(2,2),(3,3),(4,4),(5,5),(6,6),(7,7),(8,8),(9,9),(10,10);