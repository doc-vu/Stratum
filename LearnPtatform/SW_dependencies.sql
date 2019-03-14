-- MySQL dump 10.13  Distrib 5.7.12, for Win64 (x86_64)
--
-- Host: 129.59.234.224    Database: softwaredependency
-- ------------------------------------------------------
-- Server version	5.5.55-0ubuntu0.14.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `os_dependency`
--

DROP TABLE IF EXISTS `os_dependency`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `os_dependency` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `app_sw_id` int(11) NOT NULL,
  `os_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `swDep_idx` (`app_sw_id`),
  KEY `asad_idx` (`os_id`),
  CONSTRAINT `apppDep` FOREIGN KEY (`os_id`) REFERENCES `os_pkg_mgr` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `swDep` FOREIGN KEY (`app_sw_id`) REFERENCES `packages` (`sw_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `os_dependency`
--

LOCK TABLES `os_dependency` WRITE;
/*!40000 ALTER TABLE `os_dependency` DISABLE KEYS */;
INSERT INTO `os_dependency` VALUES (1,1,1),(2,2,1),(3,3,1),(4,4,1),(6,6,1),(7,7,1),(8,8,1),(9,9,1),(10,10,1),(11,11,1),(12,12,1),(13,13,1),(14,14,1),(15,15,1),(16,16,1),(17,17,1),(18,18,1),(19,19,1),(20,20,1),(21,21,1),(22,22,1),(23,23,4),(24,24,4),(25,25,4),(26,26,4),(27,27,1),(29,1,4),(30,2,4),(31,3,4),(32,4,4),(33,21,4),(34,22,4),(35,28,4),(36,29,4),(37,30,4),(38,31,4);
/*!40000 ALTER TABLE `os_dependency` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `os_pkg_mgr`
--

DROP TABLE IF EXISTS `os_pkg_mgr`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `os_pkg_mgr` (
  `id` int(11) NOT NULL,
  `OS_type` varchar(45) NOT NULL,
  `pkg_mgr` varchar(45) NOT NULL,
  `OS_version` varchar(45) NOT NULL,
  `distribution` varchar(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `os_pkg_mgr`
--

LOCK TABLES `os_pkg_mgr` WRITE;
/*!40000 ALTER TABLE `os_pkg_mgr` DISABLE KEYS */;
INSERT INTO `os_pkg_mgr` VALUES (1,'ubuntu','apt','14.04','linux'),(2,'centos','yum','7','linux'),(3,'rhel','yum','7.3','linux'),(4,'ubuntu','apt','16.04','linux');
/*!40000 ALTER TABLE `os_pkg_mgr` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `packages`
--

DROP TABLE IF EXISTS `packages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `packages` (
  `sw_id` int(11) NOT NULL AUTO_INCREMENT,
  `pkg_name` varchar(45) NOT NULL,
  `app_id` int(11) NOT NULL,
  PRIMARY KEY (`sw_id`),
  UNIQUE KEY `sw_id_UNIQUE` (`sw_id`),
  KEY `appDep_idx` (`app_id`),
  CONSTRAINT `appDep` FOREIGN KEY (`app_id`) REFERENCES `swdependency` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `packages`
--

LOCK TABLES `packages` WRITE;
/*!40000 ALTER TABLE `packages` DISABLE KEYS */;
INSERT INTO `packages` VALUES (1,'mysql-server',2),(2,'mysql-client',2),(3,'python-mysqldb',2),(4,'libmysqlclient-dev',2),(6,'php5-fpm',1),(7,'php5-cgi',1),(8,'php5-cli',1),(9,'php5-curl',1),(10,'php5-json',1),(11,'php5-odbc',1),(12,'php5-tidy',1),(13,'php5-common',1),(14,'php5-xmlrpc',1),(15,'php5-gd',1),(16,'php-pear',1),(17,'php5-dev',1),(18,'php5-imap',1),(19,'php5-mcrypt',1),(20,'php5-mysql',1),(21,'apache2',3),(22,'nginx',4),(23,'libapache2-mod-php',1),(24,'php',1),(25,'php-fpm',1),(26,'php-mysql',1),(27,'libapache2-mod-php5',1),(28,'nodejs-legacy',5),(29,'mcrypt',5),(30,'nodejs',5),(31,'npm',5);
/*!40000 ALTER TABLE `packages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `swdependency`
--

DROP TABLE IF EXISTS `swdependency`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `swdependency` (
  `id` int(11) NOT NULL,
  `AppType` varchar(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `swdependency`
--

LOCK TABLES `swdependency` WRITE;
/*!40000 ALTER TABLE `swdependency` DISABLE KEYS */;
INSERT INTO `swdependency` VALUES (1,'php'),(2,'mysql'),(3,'apache'),(4,'nginx'),(5,'nodejs');
/*!40000 ALTER TABLE `swdependency` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2017-07-06 15:28:31
