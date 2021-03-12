-- --------------------------------------------------------
-- Hôte :                        127.0.0.1
-- Version du serveur:           10.5.7-MariaDB - mariadb.org binary distribution
-- SE du serveur:                Win64
-- HeidiSQL Version:             11.0.0.5919
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- Listage de la structure de la base pour x87x5p6qhtlvrtkh
DROP DATABASE IF EXISTS `x87x5p6qhtlvrtkh`;
CREATE DATABASE IF NOT EXISTS `x87x5p6qhtlvrtkh` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `x87x5p6qhtlvrtkh`;

-- Listage de la structure de la table x87x5p6qhtlvrtkh. article
DROP TABLE IF EXISTS `article`;
CREATE TABLE IF NOT EXISTS `article` (
  `idArticle` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(45) NOT NULL,
  `content` longtext NOT NULL,
  `subTopic_idSubTopic` int(11) NOT NULL DEFAULT -1,
  PRIMARY KEY (`idArticle`),
  UNIQUE KEY `un_title_subTopic` (`title`,`subTopic_idSubTopic`),
  KEY `fk_article_subTopic1_idx` (`subTopic_idSubTopic`),
  CONSTRAINT `fk_article_subTopic1` FOREIGN KEY (`subTopic_idSubTopic`) REFERENCES `subtopic` (`idSubTopic`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Les données exportées n'étaient pas sélectionnées.

-- Listage de la structure de la table x87x5p6qhtlvrtkh. character
DROP TABLE IF EXISTS `character`;
CREATE TABLE IF NOT EXISTS `character` (
  `idCharacter` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `backstory` text DEFAULT NULL,
  `bIsAlive` tinyint(4) NOT NULL DEFAULT 1,
  `sheetStatus` int(11) NOT NULL DEFAULT 0,
  `user_idUser` int(11) NOT NULL DEFAULT -1,
  `universe_idUniverse` int(11) NOT NULL DEFAULT -1,
  PRIMARY KEY (`idCharacter`),
  UNIQUE KEY `un_name_universe` (`name`,`universe_idUniverse`),
  KEY `fk_characters_users1_idx` (`user_idUser`),
  KEY `fk_characters_univers1_idx` (`universe_idUniverse`),
  CONSTRAINT `fk_characters_univers1` FOREIGN KEY (`universe_idUniverse`) REFERENCES `universe` (`idUniverse`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `fk_characters_users1` FOREIGN KEY (`user_idUser`) REFERENCES `user` (`idUser`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Les données exportées n'étaient pas sélectionnées.

-- Listage de la structure de la table x87x5p6qhtlvrtkh. characteringroup
DROP TABLE IF EXISTS `characteringroup`;
CREATE TABLE IF NOT EXISTS `characteringroup` (
  `group_idGroup` int(11) NOT NULL,
  `character_idCharacter` int(11) NOT NULL,
  UNIQUE KEY `un_character_group` (`group_idGroup`,`character_idCharacter`),
  KEY `fk_characterInGroup_group1_idx` (`group_idGroup`),
  KEY `fk_characterInGroup_character1_idx` (`character_idCharacter`),
  CONSTRAINT `fk_characterInGroup_character1` FOREIGN KEY (`character_idCharacter`) REFERENCES `character` (`idCharacter`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `fk_characterInGroup_group1` FOREIGN KEY (`group_idGroup`) REFERENCES `group` (`idGroup`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Les données exportées n'étaient pas sélectionnées.

-- Listage de la structure de la vue x87x5p6qhtlvrtkh. characterstats
DROP VIEW IF EXISTS `characterstats`;
-- Création d'une table temporaire pour palier aux erreurs de dépendances de VIEW
CREATE TABLE `characterstats` (
	`character` INT(11) NOT NULL,
	`category` VARCHAR(45) NOT NULL COLLATE 'utf8_general_ci',
	`stat` VARCHAR(45) NOT NULL COLLATE 'utf8_general_ci',
	`value` VARCHAR(45) NOT NULL COLLATE 'utf8_general_ci',
	`order` INT(11) NULL,
	`bIsSpecial` TINYINT(4) NOT NULL,
	`bIsNumber` TINYINT(4) NOT NULL,
	`bIsRequired` TINYINT(4) NOT NULL,
	`idTemplateCategory` INT(11) NOT NULL,
	`idTemplateStat` INT(11) NOT NULL
) ENGINE=MyISAM;

-- Listage de la structure de la table x87x5p6qhtlvrtkh. event
DROP TABLE IF EXISTS `event`;
CREATE TABLE IF NOT EXISTS `event` (
  `idEvent` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `year` int(11) NOT NULL,
  `month` int(11) DEFAULT NULL,
  `day` int(11) DEFAULT NULL,
  `description` varchar(500) DEFAULT NULL,
  `article_idArticle` int(11) DEFAULT NULL,
  `timeline_idTimeline` int(11) NOT NULL DEFAULT -1,
  PRIMARY KEY (`idEvent`),
  UNIQUE KEY `un_name_timeline` (`name`,`timeline_idTimeline`),
  UNIQUE KEY `un_date_timeline` (`timeline_idTimeline`,`year`,`month`,`day`),
  KEY `fk_event_timeline1_idx` (`timeline_idTimeline`),
  KEY `fk_event_article1_idx` (`article_idArticle`),
  CONSTRAINT `fk_event_article1` FOREIGN KEY (`article_idArticle`) REFERENCES `article` (`idArticle`) ON DELETE SET NULL ON UPDATE NO ACTION,
  CONSTRAINT `fk_event_timeline1` FOREIGN KEY (`timeline_idTimeline`) REFERENCES `timeline` (`idTimeline`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Les données exportées n'étaient pas sélectionnées.

-- Listage de la structure de la table x87x5p6qhtlvrtkh. group
DROP TABLE IF EXISTS `group`;
CREATE TABLE IF NOT EXISTS `group` (
  `idGroup` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `universe_idUniverse` int(11) NOT NULL DEFAULT -1,
  PRIMARY KEY (`idGroup`),
  UNIQUE KEY `un_name_universe` (`name`,`universe_idUniverse`),
  KEY `fk_group_universe1_idx` (`universe_idUniverse`),
  CONSTRAINT `fk_group_universe1` FOREIGN KEY (`universe_idUniverse`) REFERENCES `universe` (`idUniverse`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Les données exportées n'étaient pas sélectionnées.

-- Listage de la structure de la table x87x5p6qhtlvrtkh. interestpoint
DROP TABLE IF EXISTS `interestpoint`;
CREATE TABLE IF NOT EXISTS `interestpoint` (
  `idInterestPoint` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `coordinates` varchar(45) NOT NULL,
  `map_idMap` int(11) NOT NULL DEFAULT -1,
  `article_idArticle` int(11) DEFAULT NULL,
  PRIMARY KEY (`idInterestPoint`),
  KEY `fk_interestPoint_maps1_idx` (`map_idMap`),
  KEY `fk_interestPoint_article1_idx` (`article_idArticle`),
  CONSTRAINT `fk_interestPoint_article1` FOREIGN KEY (`article_idArticle`) REFERENCES `article` (`idArticle`) ON DELETE SET NULL ON UPDATE NO ACTION,
  CONSTRAINT `fk_interestPoint_maps1` FOREIGN KEY (`map_idMap`) REFERENCES `map` (`idMap`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Les données exportées n'étaient pas sélectionnées.

-- Listage de la structure de la table x87x5p6qhtlvrtkh. inventory
DROP TABLE IF EXISTS `inventory`;
CREATE TABLE IF NOT EXISTS `inventory` (
  `idInventory` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `number` int(11) NOT NULL DEFAULT 1,
  `description` text NOT NULL,
  `weight` decimal(18,2) NOT NULL DEFAULT 0.00,
  `character_idCharacter` int(11) NOT NULL DEFAULT -1,
  PRIMARY KEY (`idInventory`),
  UNIQUE KEY `un_name_character` (`name`,`character_idCharacter`),
  KEY `fk_inventaire_characters1_idx` (`character_idCharacter`),
  CONSTRAINT `fk_inventaire_characters1` FOREIGN KEY (`character_idCharacter`) REFERENCES `character` (`idCharacter`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Les données exportées n'étaient pas sélectionnées.

-- Listage de la structure de la table x87x5p6qhtlvrtkh. keyword
DROP TABLE IF EXISTS `keyword`;
CREATE TABLE IF NOT EXISTS `keyword` (
  `name` varchar(45) NOT NULL,
  `article_idArticle` int(11) NOT NULL DEFAULT -1,
  UNIQUE KEY `un_name_article` (`name`,`article_idArticle`),
  KEY `fk_keyword_article1_idx` (`article_idArticle`),
  CONSTRAINT `fk_keyword_article1` FOREIGN KEY (`article_idArticle`) REFERENCES `article` (`idArticle`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Les données exportées n'étaient pas sélectionnées.

-- Listage de la structure de la table x87x5p6qhtlvrtkh. map
DROP TABLE IF EXISTS `map`;
CREATE TABLE IF NOT EXISTS `map` (
  `idMap` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `universe_idUniverse` int(11) NOT NULL DEFAULT -1,
  `article_idArticle` int(11) DEFAULT NULL,
  PRIMARY KEY (`idMap`),
  UNIQUE KEY `un_universe_name` (`universe_idUniverse`,`name`),
  KEY `fk_maps_univers1_idx` (`universe_idUniverse`),
  KEY `fk_map_article1_idx` (`article_idArticle`),
  CONSTRAINT `fk_map_article1` FOREIGN KEY (`article_idArticle`) REFERENCES `article` (`idArticle`) ON DELETE SET NULL ON UPDATE NO ACTION,
  CONSTRAINT `fk_maps_univers1` FOREIGN KEY (`universe_idUniverse`) REFERENCES `universe` (`idUniverse`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Les données exportées n'étaient pas sélectionnées.

-- Listage de la structure de la table x87x5p6qhtlvrtkh. session
DROP TABLE IF EXISTS `session`;
CREATE TABLE IF NOT EXISTS `session` (
  `sid` varchar(100) NOT NULL,
  `session` varchar(2048) DEFAULT '{}',
  `lastSeen` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`sid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Les données exportées n'étaient pas sélectionnées.

-- Listage de la structure de la table x87x5p6qhtlvrtkh. stat
DROP TABLE IF EXISTS `stat`;
CREATE TABLE IF NOT EXISTS `stat` (
  `value` varchar(45) NOT NULL DEFAULT '0',
  `character_idCharacter` int(11) NOT NULL DEFAULT -1,
  `templateStat_idTemplateStat` int(11) NOT NULL DEFAULT -1,
  UNIQUE KEY `un_character_templateStat` (`character_idCharacter`,`templateStat_idTemplateStat`),
  KEY `fk_stats_characters1_idx` (`character_idCharacter`),
  KEY `fk_stat_templateStat1_idx` (`templateStat_idTemplateStat`),
  CONSTRAINT `fk_stat_templateStat1` FOREIGN KEY (`templateStat_idTemplateStat`) REFERENCES `templatestat` (`idTemplateStat`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `fk_stats_characters1` FOREIGN KEY (`character_idCharacter`) REFERENCES `character` (`idCharacter`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Les données exportées n'étaient pas sélectionnées.

-- Listage de la structure de la table x87x5p6qhtlvrtkh. subtopic
DROP TABLE IF EXISTS `subtopic`;
CREATE TABLE IF NOT EXISTS `subtopic` (
  `idSubTopic` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `order` int(11) DEFAULT NULL,
  `topic_idTopic` int(11) NOT NULL DEFAULT -1,
  `article_idArticle` int(11) DEFAULT NULL,
  PRIMARY KEY (`idSubTopic`),
  UNIQUE KEY `un_name_topic` (`name`,`topic_idTopic`),
  KEY `fk_subTopic_topic1_idx` (`topic_idTopic`),
  KEY `fk_subTopic_article1_idx` (`article_idArticle`),
  CONSTRAINT `fk_subTopic_article1` FOREIGN KEY (`article_idArticle`) REFERENCES `article` (`idArticle`) ON DELETE SET NULL ON UPDATE NO ACTION,
  CONSTRAINT `fk_subTopic_topic1` FOREIGN KEY (`topic_idTopic`) REFERENCES `topic` (`idTopic`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Les données exportées n'étaient pas sélectionnées.

-- Listage de la structure de la table x87x5p6qhtlvrtkh. templatecategory
DROP TABLE IF EXISTS `templatecategory`;
CREATE TABLE IF NOT EXISTS `templatecategory` (
  `idTemplateCategory` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `order` int(11) DEFAULT NULL,
  `bIsSpecial` tinyint(4) NOT NULL DEFAULT 0,
  `universe_idUniverse` int(11) NOT NULL DEFAULT -1,
  PRIMARY KEY (`idTemplateCategory`),
  UNIQUE KEY `un_universe_name` (`name`,`universe_idUniverse`),
  KEY `fk_templateCategory_universe1_idx` (`universe_idUniverse`),
  CONSTRAINT `fk_templateCategory_universe1` FOREIGN KEY (`universe_idUniverse`) REFERENCES `universe` (`idUniverse`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Les données exportées n'étaient pas sélectionnées.

-- Listage de la structure de la table x87x5p6qhtlvrtkh. templatestat
DROP TABLE IF EXISTS `templatestat`;
CREATE TABLE IF NOT EXISTS `templatestat` (
  `idTemplateStat` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `bIsNumber` tinyint(4) NOT NULL,
  `bIsRequired` tinyint(4) NOT NULL DEFAULT 1,
  `templateCategory_idTemplateCategory` int(11) NOT NULL DEFAULT -1,
  PRIMARY KEY (`idTemplateStat`),
  UNIQUE KEY `un_name_idCategory` (`name`,`templateCategory_idTemplateCategory`),
  KEY `fk_templateStat_templateCategory1_idx` (`templateCategory_idTemplateCategory`),
  CONSTRAINT `fk_templateStat_templateCategory1` FOREIGN KEY (`templateCategory_idTemplateCategory`) REFERENCES `templatecategory` (`idTemplateCategory`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Les données exportées n'étaient pas sélectionnées.

-- Listage de la structure de la table x87x5p6qhtlvrtkh. timeline
DROP TABLE IF EXISTS `timeline`;
CREATE TABLE IF NOT EXISTS `timeline` (
  `idTimeline` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `description` tinytext DEFAULT NULL,
  `bIsPublic` tinyint(4) NOT NULL DEFAULT 1,
  `universe_idUniverse` int(11) NOT NULL DEFAULT -1,
  PRIMARY KEY (`idTimeline`),
  UNIQUE KEY `un_name_universe` (`name`,`universe_idUniverse`),
  KEY `fk_timeline_universe1_idx` (`universe_idUniverse`),
  CONSTRAINT `fk_timeline_universe1` FOREIGN KEY (`universe_idUniverse`) REFERENCES `universe` (`idUniverse`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Les données exportées n'étaient pas sélectionnées.

-- Listage de la structure de la table x87x5p6qhtlvrtkh. topic
DROP TABLE IF EXISTS `topic`;
CREATE TABLE IF NOT EXISTS `topic` (
  `idTopic` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `order` int(11) DEFAULT NULL,
  `universe_idUniverse` int(11) NOT NULL DEFAULT -1,
  `article_idArticle` int(11) DEFAULT NULL,
  PRIMARY KEY (`idTopic`),
  UNIQUE KEY `un_name_univers` (`name`,`universe_idUniverse`),
  KEY `fk_topic_universe1_idx` (`universe_idUniverse`),
  KEY `fk_topic_article1_idx` (`article_idArticle`),
  CONSTRAINT `fk_topic_article1` FOREIGN KEY (`article_idArticle`) REFERENCES `article` (`idArticle`) ON DELETE SET NULL ON UPDATE NO ACTION,
  CONSTRAINT `fk_topic_universe1` FOREIGN KEY (`universe_idUniverse`) REFERENCES `universe` (`idUniverse`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Les données exportées n'étaient pas sélectionnées.

-- Listage de la structure de la table x87x5p6qhtlvrtkh. universe
DROP TABLE IF EXISTS `universe`;
CREATE TABLE IF NOT EXISTS `universe` (
  `idUniverse` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `description` text DEFAULT NULL,
  `bIsPublic` tinyint(4) NOT NULL DEFAULT 1,
  `user_idUser` int(11) NOT NULL DEFAULT -1,
  PRIMARY KEY (`idUniverse`),
  UNIQUE KEY `un_idOwner_name` (`user_idUser`,`name`),
  KEY `fk_univers_utilisateur_idx` (`user_idUser`),
  CONSTRAINT `fk_univers_utilisateur` FOREIGN KEY (`user_idUser`) REFERENCES `user` (`idUser`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Les données exportées n'étaient pas sélectionnées.

-- Listage de la structure de la table x87x5p6qhtlvrtkh. user
DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `idUser` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(45) NOT NULL,
  `password` varchar(128) NOT NULL,
  PRIMARY KEY (`idUser`),
  UNIQUE KEY `username_UNIQUE` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Les données exportées n'étaient pas sélectionnées.

-- Listage de la structure de la vue x87x5p6qhtlvrtkh. userinuniverse
DROP VIEW IF EXISTS `userinuniverse`;
-- Création d'une table temporaire pour palier aux erreurs de dépendances de VIEW
CREATE TABLE `userinuniverse` (
	`idUser` INT(11) NOT NULL,
	`bIsGM` INT(4) NULL,
	`idUniverse` INT(11) NOT NULL
) ENGINE=MyISAM;

-- Listage de la structure de la table x87x5p6qhtlvrtkh. userinvitation
DROP TABLE IF EXISTS `userinvitation`;
CREATE TABLE IF NOT EXISTS `userinvitation` (
  `user_idUser` int(11) NOT NULL,
  `universe_idUniverse` int(11) NOT NULL,
  `bIsGM` tinyint(4) NOT NULL DEFAULT 0,
  UNIQUE KEY `un_user_universe` (`user_idUser`,`universe_idUniverse`),
  KEY `fk_userInvitation_user1_idx` (`user_idUser`),
  KEY `fk_userInvitation_universe1_idx` (`universe_idUniverse`),
  CONSTRAINT `fk_userInvitation_universe1` FOREIGN KEY (`universe_idUniverse`) REFERENCES `universe` (`idUniverse`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `fk_userInvitation_user1` FOREIGN KEY (`user_idUser`) REFERENCES `user` (`idUser`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Les données exportées n'étaient pas sélectionnées.

-- Listage de la structure de la vue x87x5p6qhtlvrtkh. characterstats
DROP VIEW IF EXISTS `characterstats`;
-- Suppression de la table temporaire et création finale de la structure d'une vue
DROP TABLE IF EXISTS `characterstats`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `characterstats` AS SELECT s.character_idCharacter AS "character", tc.name AS "category", ts.name AS "stat", s.value, tc.`order`, tc.bIsSpecial, ts.bIsNumber, ts.bIsRequired, tc.idTemplateCategory, ts.idTemplateStat FROM stat s
		INNER JOIN templatestat ts ON s.templateStat_idTemplateStat = ts.idTemplateStat
		INNER JOIN templatecategory tc ON ts.templateCategory_idTemplateCategory = tc.idTemplateCategory
		ORDER BY s.character_idCharacter ASC, tc.`order` ASC, ts.bIsRequired DESC, ts.bIsNumber DESC, ts.name ASC ;

-- Listage de la structure de la vue x87x5p6qhtlvrtkh. userinuniverse
DROP VIEW IF EXISTS `userinuniverse`;
-- Suppression de la table temporaire et création finale de la structure d'une vue
DROP TABLE IF EXISTS `userinuniverse`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `userinuniverse` AS SELECT idUser, MAX(bIsGM) AS "bIsGM", idUniverse FROM (
		SELECT us.idUser, 1 AS bIsGM, un.idUniverse FROM universe un
		INNER JOIN user us
			ON us.idUser = un.user_idUser
			
		UNION
		
		SELECT us.idUser, ui.bIsGM, un.idUniverse FROM user us
		INNER JOIN userinvitation ui
			ON ui.user_idUser = us.idUser
		INNER JOIN universe un 
			ON un.idUniverse = ui.universe_idUniverse
			
		UNION
		
		SELECT us.idUser, 0 AS bIsGM, un.idUniverse FROM universe un
		INNER JOIN `character` c
			ON c.universe_idUniverse = un.idUniverse
		INNER JOIN user us
			ON us.idUser = c.user_idUser
	) allUsersInUniverse
	GROUP BY idUser, idUniverse
	ORDER BY idUniverse ASC, bIsGM DESC, idUser ASC ;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
