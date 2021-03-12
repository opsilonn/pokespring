CREATE DATABASE `pokespring` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;


-- pokespring.account definition

CREATE TABLE `account` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `email` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `password` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- pokespring.team definition

CREATE TABLE `team` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` text,
  `fk_account_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `team_FK` (`fk_account_id`),
  CONSTRAINT `team_FK` FOREIGN KEY (`fk_account_id`) REFERENCES `account` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- pokespring.pokemon_instance definition

CREATE TABLE `pokemon_instance` (
  `id` int NOT NULL AUTO_INCREMENT,
  `surname` text,
  `fk_team_id` int NOT NULL,
  `fk_pokemon_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `pokemon_instance_FK` (`fk_team_id`),
  CONSTRAINT `pokemon_instance_FK` FOREIGN KEY (`fk_team_id`) REFERENCES `team` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


INSERT INTO pokespring.account (id,username,email,password) VALUES
 (1,'opsilonn','opsilonn@gmail.com','1234'),
 (2,'scorpiondu78','scorpion@gmail.com','5678');


INSERT INTO pokespring.team (id,name,fk_account_id) VALUES
 (1,'équipe 1 d''opsilonn',1),
(2,'équipe 2 d''opsilonn',1),
 (3,'équipe 1 de scorpion',2);


INSERT INTO pokespring.pokemon_instance (id,surname,fk_team_id,fk_pokemon_id) VALUES
 (1,'beuhbizarre',1,1),
 (2,'salamiche',1,4),
 (3,'carapute',1,7),
 (4,'germicide',2,192),
 (5,'hérisent',2,195),
 (6,'kaiserminus',2,198),
 (7,'arckonnar',3,299),
 (8,'pussyfeu',3,302),
 (9,'gobtout',3,305);