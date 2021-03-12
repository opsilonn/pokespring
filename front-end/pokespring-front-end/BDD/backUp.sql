-- --------------------------------------------------------
-- Hôte :                        localhost
-- Version du serveur:           10.5.8-MariaDB - mariadb.org binary distribution
-- SE du serveur:                Win64
-- HeidiSQL Version:             11.0.0.5919
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

-- Listage des données de la table otter_worlds.article : ~14 rows (environ)
TRUNCATE TABLE `article`;
/*!40000 ALTER TABLE `article` DISABLE KEYS */;
INSERT INTO `article` (`idArticle`, `title`, `content`, `subTopic_idSubTopic`) VALUES
	(1, 'Les Cité', 'les cite de la cote de l\'epee sont tres impressionannte', 4),
	(2, 'never winter', 'never winter est la capital du monde connues', 4),
	(3, 'les mechant', 'les mechants sont pas gentils', 4),
	(4, 'le temple de baldurs gate', 'ce temple est dédier a zafriel l\'ange dechu qui est devenu un genral whalla c\'est chaud mon pote', 7),
	(5, 'La porte de Baldur', 'La porte de Baldur est l\'une des plus imposante cite de la cote de l\'epee et est connus pour etre le temoin d\'evenement obscur', 4),
	(6, 'welcome to barovia', 'La barovie ce n\'est pas un endroit ou je voudrais passé mes vacance', 6),
	(7, 'the sword coast', 'La cote de l\'épée est le coeur de la civilisation humaine dans la triste region des royaumes oublié', 4),
	(8, 'The cruel leader', 'he is the cruel leader of the terrible wild hunt', 11),
	(9, 'the fist balade', 'do re mi fa sol al si do re mi fa fa mi re do', 10),
	(10, 'the second balade', 'it\'s a beautifull song sing by the most impressive bard you will ever see', 10),
	(11, 'the emperor', 'the uncontested leader of the powerfull and conquestfull nilfgardien empire', 9),
	(12, 'the cult', 'the cult of the eternal fire is a very influancial cult', 8),
	(13, 'house', 'it\'s a house, for poney', 1),
	(14, 'warior', 'it\'s a poney with an armor that shout lazer with his eyes ', 3);
/*!40000 ALTER TABLE `article` ENABLE KEYS */;

-- Listage des données de la table otter_worlds.character : ~6 rows (environ)
TRUNCATE TABLE `character`;
/*!40000 ALTER TABLE `character` DISABLE KEYS */;
INSERT INTO `character` (`idCharacter`, `name`, `backstory`, `bIsAlive`, `sheetStatus`, `user_idUser`, `universe_idUniverse`) VALUES
	(1, 'Eozen Thelir Daragon', 'A strange warrior who lost his memory', 1, 0, 1, 4),
	(2, 'Le faurain', 'He come from a demon and patate his enemies', 1, 0, 4, 4),
	(3, 'ConnArgonien', 'A very friendly reptile', 1, 0, 2, 4),
	(4, 'François', 'Just François in is own universe', 1, 0, 3, 4),
	(5, 'Jeskia', 'A original bard', 1, 0, 3, 2),
	(6, 'Smith', 'A very very respectable priest', 1, 0, 2, 2);
/*!40000 ALTER TABLE `character` ENABLE KEYS */;

-- Listage des données de la table otter_worlds.characteringroup : ~3 rows (environ)
TRUNCATE TABLE `characteringroup`;
/*!40000 ALTER TABLE `characteringroup` DISABLE KEYS */;
INSERT INTO `characteringroup` (`group_idGroup`, `character_idCharacter`) VALUES
	(1, 1),
	(3, 2),
	(4, 5);
/*!40000 ALTER TABLE `characteringroup` ENABLE KEYS */;

-- Listage des données de la table otter_worlds.event : ~5 rows (environ)
TRUNCATE TABLE `event`;
/*!40000 ALTER TABLE `event` DISABLE KEYS */;
INSERT INTO `event` (`idEvent`, `name`, `year`, `month`, `day`, `description`, `article_idArticle`, `timeline_idTimeline`) VALUES
	(1, 'the battle of the fist hell', -125, 10, 6, 'the fist batle of the war', NULL, 1),
	(2, 'the fall of zafriel', 250, 12, 14, 'this event shaped the world for ever', NULL, 1),
	(3, 'the walk of asmodeus', 100, 8, 10, 'the wrath of asmodeus was emesearuble', NULL, 1),
	(4, 'the first horse', 120, 12, 11, 'before the world was quite empty', NULL, 2),
	(5, 'the fist poney', 240, NULL, NULL, 'poney are so much cooler than horses', NULL, 2);
/*!40000 ALTER TABLE `event` ENABLE KEYS */;

-- Listage des données de la table otter_worlds.group : ~9 rows (environ)
TRUNCATE TABLE `group`;
/*!40000 ALTER TABLE `group` DISABLE KEYS */;
INSERT INTO `group` (`idGroup`, `name`, `universe_idUniverse`) VALUES
	(3, 'Asimar', 4),
	(4, 'bard', 2),
	(10, 'heretic', 3),
	(1, 'Hero', 4),
	(9, 'horse', 1),
	(5, 'marchant', 2),
	(8, 'shetland', 1),
	(2, 'sorceler', 2),
	(7, 'witch', 2);
/*!40000 ALTER TABLE `group` ENABLE KEYS */;

-- Listage des données de la table otter_worlds.interestpoint : ~19 rows (environ)
TRUNCATE TABLE `interestpoint`;
/*!40000 ALTER TABLE `interestpoint` DISABLE KEYS */;
INSERT INTO `interestpoint` (`idInterestPoint`, `name`, `coordinates`, `map_idMap`, `article_idArticle`) VALUES
	(1, 'Clock Tower', '(3043, 1638)', 1, NULL),
	(2, 'Moonstone Mask', '(430, 1215)', 1, NULL),
	(3, 'Castle Never', '(1049, 1401)', 1, NULL),
	(4, 'The Passiflora', '(831, 1057)', 2, NULL),
	(5, 'Tavern', '(607, 592)', 2, NULL),
	(6, 'poney land', '(709, 574)', 3, NULL),
	(7, 'Zebrica', '(627, 350)', 3, NULL),
	(8, 'heretic houses', '(20, 20)', 4, NULL),
	(13, 'Agarica', '(701, 36)', 3, NULL),
	(16, 'Equestria', '(451, 585)', 3, NULL),
	(17, 'Amarezonia', '(361, 279)', 3, NULL),
	(18, 'Cintra', '(2819, 5777)', 7, NULL),
	(19, 'Kaer Morhen', '(5925, 8055)', 7, NULL),
	(20, 'Aretuza', '(3835, 7149)', 7, NULL),
	(21, 'Novigrad', '(4026, 7261)', 7, NULL),
	(22, 'Vizima', '(4246, 6660)', 7, NULL),
	(23, 'Tor Ziraeael', '(4075, 3932)', 7, NULL),
	(24, 'Nilfgaard', '(1806, 1415)', 7, NULL),
	(25, 'Kear Trolde', '(1616, 6176)', 7, NULL);
/*!40000 ALTER TABLE `interestpoint` ENABLE KEYS */;

-- Listage des données de la table otter_worlds.inventory : ~4 rows (environ)
TRUNCATE TABLE `inventory`;
/*!40000 ALTER TABLE `inventory` DISABLE KEYS */;
INSERT INTO `inventory` (`idInventory`, `name`, `number`, `description`, `weight`, `character_idCharacter`) VALUES
	(1, 'Torch', 3, 'Torch to light the dark', 0.50, 1),
	(2, 'Rope', 10, 'number = meter; weight = 2 * meter', 20.00, 1),
	(3, 'Sword prout', 189, 'Dealing +4 prout damage', 4.00, 1),
	(7, 'my super cool item but different 3', 1, 'un item vraiment cool', 1854.00, 1);
/*!40000 ALTER TABLE `inventory` ENABLE KEYS */;

-- Listage des données de la table otter_worlds.keyword : ~7 rows (environ)
TRUNCATE TABLE `keyword`;
/*!40000 ALTER TABLE `keyword` DISABLE KEYS */;
INSERT INTO `keyword` (`name`, `article_idArticle`) VALUES
	('donjon', 4),
	('dragon', 4),
	('lore', 4),
	('poney', 1),
	('sun sword', 4),
	('war', 3),
	('witcher', 2);
/*!40000 ALTER TABLE `keyword` ENABLE KEYS */;

-- Listage des données de la table otter_worlds.map : ~5 rows (environ)
TRUNCATE TABLE `map`;
/*!40000 ALTER TABLE `map` DISABLE KEYS */;
INSERT INTO `map` (`idMap`, `name`, `universe_idUniverse`, `article_idArticle`) VALUES
	(1, 'Neverwinter', 4, 2),
	(2, 'Novigrad', 2, NULL),
	(3, 'Poney land', 1, NULL),
	(4, 'heretic land', 3, NULL),
	(7, 'World Map', 2, NULL);
/*!40000 ALTER TABLE `map` ENABLE KEYS */;

-- Listage des données de la table otter_worlds.session : ~0 rows (environ)
TRUNCATE TABLE `session`;
/*!40000 ALTER TABLE `session` DISABLE KEYS */;
/*!40000 ALTER TABLE `session` ENABLE KEYS */;

-- Listage des données de la table otter_worlds.stat : ~12 rows (environ)
TRUNCATE TABLE `stat`;
/*!40000 ALTER TABLE `stat` DISABLE KEYS */;
INSERT INTO `stat` (`value`, `character_idCharacter`, `templateStat_idTemplateStat`) VALUES
	('5', 1, 1),
	('4', 1, 2),
	('Eozen Thelir Daragon', 1, 3),
	('Human', 1, 4),
	('H', 1, 5),
	('100', 1, 6),
	('11', 1, 7),
	('14', 1, 8),
	('7', 1, 9),
	('15', 1, 10),
	('13', 1, 12),
	('2', 1, 13);
/*!40000 ALTER TABLE `stat` ENABLE KEYS */;

-- Listage des données de la table otter_worlds.subtopic : ~9 rows (environ)
TRUNCATE TABLE `subtopic`;
/*!40000 ALTER TABLE `subtopic` DISABLE KEYS */;
INSERT INTO `subtopic` (`idSubTopic`, `name`, `order`, `topic_idTopic`, `article_idArticle`) VALUES
	(1, 'poney house', 1, 3, NULL),
	(3, 'poney warior', 2, 3, NULL),
	(4, 'la cote de l\'epee', 1, 7, NULL),
	(6, 'Barovia', 2, 7, 6),
	(7, 'Le culte de zafriel', 1, 6, 4),
	(8, 'the eternal fire', 1, 17, NULL),
	(9, 'nilfgaar', 2, 17, NULL),
	(10, 'jaskie the bard', 1, 15, NULL),
	(11, 'the ice knights', 1, 16, 3);
/*!40000 ALTER TABLE `subtopic` ENABLE KEYS */;

-- Listage des données de la table otter_worlds.templatecategory : ~4 rows (environ)
TRUNCATE TABLE `templatecategory`;
/*!40000 ALTER TABLE `templatecategory` DISABLE KEYS */;
INSERT INTO `templatecategory` (`idTemplateCategory`, `name`, `order`, `bIsSpecial`, `universe_idUniverse`) VALUES
	(1, 'Characteristics', NULL, 0, 4),
	(2, 'Description', NULL, 0, 4),
	(3, 'Skills', NULL, 0, 4),
	(5, 'test', NULL, 0, 4);
/*!40000 ALTER TABLE `templatecategory` ENABLE KEYS */;

-- Listage des données de la table otter_worlds.templatestat : ~13 rows (environ)
TRUNCATE TABLE `templatestat`;
/*!40000 ALTER TABLE `templatestat` DISABLE KEYS */;
INSERT INTO `templatestat` (`idTemplateStat`, `name`, `bIsNumber`, `bIsRequired`, `templateCategory_idTemplateCategory`) VALUES
	(1, 'Run', 1, 0, 3),
	(2, 'Jump', 1, 0, 3),
	(3, 'Name', 0, 1, 2),
	(4, 'Race', 0, 1, 2),
	(5, 'Sex', 0, 1, 2),
	(6, 'Age', 1, 1, 2),
	(7, 'INT', 1, 1, 1),
	(8, 'DEX', 1, 1, 1),
	(9, 'Sword (1-h)', 1, 0, 3),
	(10, 'STR', 1, 1, 1),
	(11, 'Kingdom', 0, 0, 2),
	(12, 'CHA', 1, 1, 1),
	(13, 'Sword (2-h)', 1, 0, 3);
/*!40000 ALTER TABLE `templatestat` ENABLE KEYS */;

-- Listage des données de la table otter_worlds.timeline : ~2 rows (environ)
TRUNCATE TABLE `timeline`;
/*!40000 ALTER TABLE `timeline` DISABLE KEYS */;
INSERT INTO `timeline` (`idTimeline`, `name`, `description`, `bIsPublic`, `universe_idUniverse`) VALUES
	(1, 'the war of the nine hell', 'this timeline resume the event that occured during the long war of the nine hell', 1, 4),
	(2, 'the age of the horses', 'the event that happened in the legendary ages of the horses', 1, 1);
/*!40000 ALTER TABLE `timeline` ENABLE KEYS */;

-- Listage des données de la table otter_worlds.topic : ~8 rows (environ)
TRUNCATE TABLE `topic`;
/*!40000 ALTER TABLE `topic` DISABLE KEYS */;
INSERT INTO `topic` (`idTopic`, `name`, `order`, `universe_idUniverse`, `article_idArticle`) VALUES
	(3, 'poney Land', 1, 1, NULL),
	(6, 'Religions', 2, 4, NULL),
	(7, 'les royaumes oublier', 1, 4, NULL),
	(15, 'the human', 1, 2, NULL),
	(16, 'the wild hunt', 2, 2, 3),
	(17, 'faction and power', 3, 2, NULL),
	(18, 'war', 1, 3, NULL),
	(19, 'hammer', 2, 3, NULL);
/*!40000 ALTER TABLE `topic` ENABLE KEYS */;

-- Listage des données de la table otter_worlds.universe : ~5 rows (environ)
TRUNCATE TABLE `universe`;
/*!40000 ALTER TABLE `universe` DISABLE KEYS */;
INSERT INTO `universe` (`idUniverse`, `name`, `description`, `bIsPublic`, `user_idUser`) VALUES
	(1, 'My little Poney', 'Wonderful world with a lot of magical poney', 1, 4),
	(2, 'The Witcher', 'Dark world with beasts and magic', 0, 1),
	(3, 'Warhammer', 'Chaotic world with wars and heretics', 1, 2),
	(4, 'Dungeons and dragons', 'Medieval fantasy world with epic quests', 1, 3),
	(5, 'Unity', 'a mix of fantasy post apocaliptic and weird scify', 1, 3);
/*!40000 ALTER TABLE `universe` ENABLE KEYS */;

-- Listage des données de la table otter_worlds.user : ~5 rows (environ)
TRUNCATE TABLE `user`;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` (`idUser`, `username`, `password`) VALUES
	(1, 'Eddy', '$2b$10$TEWQvpaLdXsuIO1UP.FUMO.l8K9vqpbwfLeY9zGWHTVeuEge3YkW2'),
	(2, 'Hugues', '$2b$10$khMtJK8HLR97Sol7.QQNZ.FLFSdw49Xm4tDWblL.be4aZ.2qU28iu'),
	(3, 'François', '$2b$10$33gbG0B3LryMS7ab38CbLeRJWRou3rR/5HepKOZvywPUl4tMXDlmS'),
	(4, 'Paul', '$2b$10$qhTeCVDONZidg1fmyXqWdOUpxdtcCHAxYPfd4x/UViCgw9k5tb9Ge');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;

-- Listage des données de la table otter_worlds.userinvitation : ~5 rows (environ)
TRUNCATE TABLE `userinvitation`;
/*!40000 ALTER TABLE `userinvitation` DISABLE KEYS */;
INSERT INTO `userinvitation` (`user_idUser`, `universe_idUniverse`, `bIsGM`) VALUES
	(1, 4, 1),
	(2, 2, 0),
	(2, 4, 0),
	(3, 2, 0),
	(4, 4, 0);
/*!40000 ALTER TABLE `userinvitation` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
