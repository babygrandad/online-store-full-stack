/*!40101 SET NAMES utf8 */;
/*!40014 SET FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET SQL_NOTES=0 */;
DROP TABLE IF EXISTS categories;
CREATE TABLE `categories` (
  `category_id` int NOT NULL AUTO_INCREMENT,
  `category_name` varchar(50) NOT NULL,
  PRIMARY KEY (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS colors;
CREATE TABLE `colors` (
  `color_id` int NOT NULL AUTO_INCREMENT,
  `color_name` varchar(512) DEFAULT NULL,
  `color_hex` varchar(512) DEFAULT NULL,
  `group_color` varchar(512) DEFAULT NULL,
  PRIMARY KEY (`color_id`),
  UNIQUE KEY `color_hex` (`color_hex`),
  UNIQUE KEY `color_name` (`color_name`),
  KEY `group_color` (`group_color`),
  CONSTRAINT `colors_ibfk_1` FOREIGN KEY (`group_color`) REFERENCES `group_colors` (`group_color`)
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS sizes;
CREATE TABLE `sizes` (
  `size_id` int NOT NULL AUTO_INCREMENT,
  `size` int DEFAULT NULL,
  PRIMARY KEY (`size_id`),
  UNIQUE KEY `size` (`size`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO categories(category_id,category_name) VALUES(1,'Sneakers'),(2,'Heels'),(3,'Boots'),(4,'Formal'),(5,'Sandals'),(6,'Crocs'),(7,'Trainers'),(8,'Flip Flop');

INSERT INTO colors(color_id,color_name,color_hex,group_color) VALUES(1,'Black','#000000','Black'),(2,'White','#ffffff','White'),(3,'Grey','#808080','Grey'),(4,'Red','#ff0000','Red'),(5,'Blue','#0000ff','Blue'),(6,'Green','#008000','Green'),(7,'Orange','#ffa500','Orange'),(8,'Pink','#FFC0CB','Pink'),(9,'Silver','#C0C0C0','Silver'),(10,'Purple','#800080','Purple'),(11,'Yellow','#FFFF00','Yellow'),(12,'Brown','#A52A2A','Brown'),(14,'Lime Green','#B7E241','Green'),(15,'Pumpkin','#EA9149','Orange'),(16,'Deep Lavender','#826AD9','Purple'),(17,'Fern Green','#73BF78','Green'),(18,'Sand','#D9AD77','Orange'),(19,'Salmon','#EC5D5D','Red'),(20,'Jade','#338C30','Green'),(21,'Ash','#7C7C7C','Grey'),(22,'Apricot','#E17F4D','Orange'),(23,'Lilac','#A871C5','Purple'),(24,'Ink Blue','#0F2444','Blue'),(25,'Criomson','#BF0404','Red'),(26,'Sky Blue','#04B2D9','Blue'),(27,'Espresso','#40341E','Brown'),(28,'Ever Green','#30592A','Green'),(29,'Maroon','#592E32','Red'),(30,'Baby Blue','#91BDD9','Blue'),(31,'Royal Purple','#6C568C','Purple'),(32,'Seafoam Green','#6DA696','Green'),(33,'Pale Yellow','#E9F2A0','Yellow'),(34,'Periwinkle Purple','#8086C6','Purple'),(35,'Navy Blue','#081040','Blue'),(36,'Vibrant Purple','#BC04BF','Purple'),(37,'Beige','#C1AC96','Brown'),(38,'Deep Blue','#014888','Blue'),(39,'Gold','#A69544','Yellow'),(42,'Mint Green','#82D98F','Green'),(44,'Rose Gold','#D58A7C','Pink'),(45,'Tibatan Silver','#AEB1B3','Silver'),(46,'Denim Blue','#517EA6','Blue'),(47,'Earthy Brown','#8C6151','Brown'),(48,'Slate Grey','#404040','Grey'),(49,'Teal','#518C81','Green');


INSERT INTO genders(gender_id,gender) VALUES(1,'Male'),(2,'Female');

INSERT INTO group_colors(group_color,hex_code) VALUES('Black','#000000'),('Blue','#0000FF'),('Brown','#A52A2A'),('Green','#008000'),('Grey','#808080'),('Orange','#FFA500'),('Pink','#FFC0CB'),('Purple','#800080'),('Red','#FF0000'),('Silver','#C0C0C0'),('White','#FFFFFF'),('Yellow','#FFFF00');

INSERT INTO product_categories(product_id,category_id) VALUES(1,1),(1,7),(2,1),(3,1),(3,7),(4,1),(5,5),(5,8),(6,5),(6,8),(7,5),(7,6),(8,6),(8,8),(9,2),(9,4),(10,2),(10,4),(11,2),(11,4),(12,4),(13,4),(14,4);

INSERT INTO product_colors(product_id,color_id) VALUES(1,8),(1,14),(1,15),(1,16),(2,8),(2,17),(2,18),(2,19),(3,20),(3,21),(3,22),(3,23),(4,1),(4,21),(4,6),(4,24),(5,3),(5,25),(5,26),(6,24),(6,27),(6,28),(6,29),(7,30),(7,31),(7,32),(7,29),(7,12),(8,8),(8,26),(8,33),(8,34),(9,1),(9,34),(9,35),(9,36),(10,1),(10,25),(10,37),(11,38),(11,39),(11,42),(11,44),(11,45),(11,1),(12,46),(12,47),(12,48),(12,49),(13,1),(13,35),(13,12),(13,3),(13,25),(13,49),(14,1),(14,29);

INSERT INTO product_genders(product_id,gender_id) VALUES(1,1),(1,2),(2,1),(2,2),(3,1),(3,2),(4,1),(5,1),(6,1),(6,2),(7,1),(7,2),(8,2),(9,2),(10,2),(11,2),(12,1),(12,2),(13,1),(14,2);

INSERT INTO product_sizes(product_id,size_id) VALUES(1,4),(1,5),(1,6),(1,7),(2,4),(2,5),(2,7),(2,9),(3,5),(3,6),(3,7),(3,8),(4,6),(4,7),(4,8),(4,10),(5,6),(5,7),(5,8),(5,9),(6,4),(6,5),(6,7),(6,9),(7,4),(7,5),(7,6),(7,7),(8,4),(8,5),(8,6),(8,7),(9,4),(9,5),(9,6),(9,7),(10,4),(10,5),(10,6),(10,7),(11,3),(11,4),(11,5),(11,6),(12,4),(12,6),(12,7),(12,9),(13,6),(13,7),(13,8),(13,10),(14,3),(14,4),(14,5),(14,6);

INSERT INTO products(product_id,product_name,product_discription,price,quantity) VALUES(1,'Nike SuperRep','Nike SuperRep is a breathable, supportive training shoe with two layers of foam for cushioning and stability, plus a burpee break for mobility.',1300.00,21),(2,'Vans Old Skool','The Vans Old Skool is a classic low-top skate shoe with a canvas and suede upper, iconic side stripe, padded collar, reinforced toe cap, and signature waffle outsole.',700.00,42),(3,'Nike AirStride','The Nike AirStride: a pinnacle of style and performance. With its cushioned sole, breathable materials, and versatile design, it\'s the ultimate choice for athletic prowess and everyday fashion. Elevate your game.',1000.00,36),(4,'Aldo SwiftStride','The Aldo SwiftStride: Experience the perfect blend of style and performance. With its sleek design, cushioned comfort, and reliable traction, it\'s the ideal choice for all-day wear. Step up your game with confidence.',800.00,17),(5,'SunBreeze','The SunBreeze Flipflop: Stylish and comfortable, perfect for beach days and summer strolls. Premium materials, cushioned footbed, and durable outsole for relaxed adventures. Casual elegance redefined.',120.00,56),(6,'RVCA Breezy Step','The RVCA Breezy Step: Embrace summer with lightweight comfort. Featuring a soft, breathable footbed and flexible outsole, it\'s your go-to for effortless relaxation and beachside adventures. Experience ultimate freedom for your feet.',120.00,60),(7,'Cloud Esase','The CloudEase Slip-On Sandal: Effortless comfort awaits with our lightweight foam sandal. Slip into cloud-like softness and enjoy a breezy stride for casual outings and relaxing moments. Embrace soothing relaxation for your feet.',250.00,32),(8,'Foam Glide','Experience the next level of comfort with our foam-infused flip-flops. Enjoy plush cushioning, lightweight support, and a flexible fit for ultimate relaxation and carefree adventures. Embrace foam luxury for your feet.',180.00,25),(9,'LuxeSuede','Elevate your style with timeless sophistication. Crafted with premium suede, sleek silhouette, and a comfortable heel, it\'s the epitome of elegance and refinement. Step into effortless glamour and make a statement.',1400.00,36),(10,'Radiant Gleam','Illuminate your every step with our shining leather heel. Imbued with elegance and a sleek silhouette, it captivates with its lustrous finish and adds a touch of glamour to any occasion. Shine bright with sophistication.',500.00,23),(11,'Enchantment',' A captivating fusion of style and allure. Crafted with luxurious suede, its reflective finish creates an enchanting play of light. Step into elegance that mesmerizes and leaves a lasting impression',1500.00,26),(12,'Opulent Touch','Exude timeless sophistication with our suede masterpiece. Meticulously crafted with luxurious suede, impeccable detailing, and a refined silhouette, it embodies opulence and elegance. Make a statement that captures attention and admiration.\n\n\n\n\n',800.00,24),(13,'Polished Aura','Radiate confidence with our patent leather masterpiece. Impeccably crafted with a glossy, light-reflecting finish, refined silhouette, and meticulous detailing, it illuminates your every step with elegance and charm. Step into a world of captivating sophistication.',400.00,42),(14,'Empress','Redefine elegance with our patent leather masterpiece. Meticulously crafted with a thick sole and a small, masculine-inspired heel, it blends sophistication and comfort seamlessly. Step into regal confidence and make a lasting impression.     ',500.00,21);
INSERT INTO sizes(size_id,size) VALUES(1,1),(2,2),(3,3),(4,4),(5,5),(6,6),(7,7),(8,8),(9,9),(10,10);