-- MySQL dump 10.13  Distrib 9.1.0, for macos14 (arm64)
--
-- Host: localhost    Database: Meet
-- ------------------------------------------------------
-- Server version	9.1.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `_prisma_migrations`
--

DROP TABLE IF EXISTS `_prisma_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_prisma_migrations`
--

LOCK TABLES `_prisma_migrations` WRITE;
/*!40000 ALTER TABLE `_prisma_migrations` DISABLE KEYS */;
INSERT INTO `_prisma_migrations` VALUES ('912ebd4d-090f-4b76-86ea-27b560cef1d6','73060784f32a6e063d16deeb17be991635f16854861d02230c534ceaa0ee720a','2025-06-15 09:48:25.715','20250615093932_init',NULL,NULL,'2025-06-15 09:48:25.678',1);
/*!40000 ALTER TABLE `_prisma_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `InterviewRecord`
--

DROP TABLE IF EXISTS `InterviewRecord`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `InterviewRecord` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sessionId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `step` int NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `timestamp` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `InterviewRecord_sessionId_idx` (`sessionId`),
  KEY `InterviewRecord_userId_fkey` (`userId`),
  CONSTRAINT `InterviewRecord_sessionId_fkey` FOREIGN KEY (`sessionId`) REFERENCES `InterviewSession` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `InterviewRecord_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `InterviewRecord`
--

LOCK TABLES `InterviewRecord` WRITE;
/*!40000 ALTER TABLE `InterviewRecord` DISABLE KEYS */;
/*!40000 ALTER TABLE `InterviewRecord` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `InterviewSession`
--

DROP TABLE IF EXISTS `InterviewSession`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `InterviewSession` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `startTime` datetime(3) NOT NULL,
  `endTime` datetime(3) DEFAULT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `currentStep` int NOT NULL DEFAULT '0',
  `totalDuration` int NOT NULL DEFAULT '0',
  `pausedDuration` int NOT NULL DEFAULT '0',
  `notes` text COLLATE utf8mb4_unicode_ci,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `candidateName` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `position` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `interviewer` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `technicalScore` double DEFAULT NULL,
  `communicationScore` double DEFAULT NULL,
  `overallScore` double DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `InterviewSession`
--

LOCK TABLES `InterviewSession` WRITE;
/*!40000 ALTER TABLE `InterviewSession` DISABLE KEYS */;
INSERT INTO `InterviewSession` VALUES ('951550fb-2eb1-4269-b65a-57847b5423a6','2025-06-17 09:57:46.128',NULL,'active',0,0,0,NULL,'2025-06-17 09:57:46.218','2025-06-17 09:57:46.218',NULL,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `InterviewSession` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_requirements`
--

DROP TABLE IF EXISTS `job_requirements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_requirements` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `jobTitle` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pdfUrl` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pdfContent` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `fileName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `questions` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_requirements`
--

LOCK TABLES `job_requirements` WRITE;
/*!40000 ALTER TABLE `job_requirements` DISABLE KEYS */;
INSERT INTO `job_requirements` VALUES ('cmcaaoam30001grimjoavprod','vue前端工程师','','职位：前端工程师（金融方向）\n部门：财富视觉工作室（上海）\n地点：上海\n岗位职责：\n1、精通HTML5、CSS、JavaScript，熟悉页面架构、浏览器和多平台布局及优化；\n2、与设计师、产品经理紧密配合，保证产品具有优质的用户体验与浏览器、跨平台的兼容\n性 ；\n3、熟悉主流框架，类库的设计和实现，对前后端合作模式有深入理解，平时会主动学习\nangular.js、node.js、vue.js等前端技术兴替。\n任职要求：\n1、全日制本科以上学历，具有相关产品开发工作经历；\n2、具备一定的财经知识功底，做过金融类产品开发优先；\n3、有良好的团队沟通能力和执行能力。\n应聘方式：\n请将个人简历及相关作品发送至官方招聘邮箱：zhaopin@cfmgroup.com.cn\n邮件主题格式要求：职位-姓名-联系电话','','2025-06-24 08:59:49.532','2025-06-24 08:59:49.532','1、Vue跟传统开发的区别\n2、Vue和React对比\n3、说说你对slot的理解？slot使用场景有哪些？\n4、动态给vue的data添加一个新的属性时会发生什么？怎样解决？\n5、Vue组件之间的通信方式都有哪些？\n6、双向数据绑定是什么\n7、Vue中的$nextTick有什么作用？\n8、Vue常用的修饰符有哪些有什么应用场景'),('cmcab49fg0002grimtqq4luph','React前端工程师','','负责公司核心产品的Web前端开发，使用React技术栈构建高质量的用户界面\n与产品、设计和后端团队紧密合作，将产品需求转化为技术实现\n优化前端性能，提升用户体验和页面加载速度\n编写清晰、可复用、可测试的代码，并参与代码审查\n持续关注和学习前端新技术，并在团队内分享和应用\n参与技术方案设计，解决开发过程中的技术难题\n【任职要求】\n本科及以上学历，计算机相关专业优先\n5年以上React开发经验。\n精通JavaScript、HTML5、CSS3，熟悉ES6+新特性\n熟悉Redux、ReactRouter等React生态系统常用库\n了解前端工程化，熟悉Webpack、Babel等构建工具\n具备良好的代码风格，注重代码质量和性能优化\n熟悉RESTfulAPI设计和前后端分离开发模式\n有TypeScript使用经验者优先\n有移动端开发经验（ReactNative）者优先\n良好的学习能力、团队协作能力和解决问题的能力\n【我们提供】\n扁平化的组织结构，开放的工作环境\n定期的技术分享和学习机会\n充满挑战的项目和成长空间\n五险一金、带薪年假、节日福利等\n如果你热爱前端技术，渴望在一个充满活力的团队中发挥所长，欢迎加入我们！','','2025-06-24 09:12:14.514','2025-06-24 09:12:14.514','1、说说对React的理解？有哪些特性？\n2、说说对Reactrefs的理解？应用场景？\n3、说说对ReactHooks的理解？解决了什么问题？\n4、你在React项目中是如何使用Redux的?项目结构是如何划分的？\n5、说说你对ReactRouter的理解？常用的Router组件有哪些？\n6、说说Reactrender方法的原理？在什么时候会被触发？\n7、说说Reactdiff的原理是什么？\n8、说说React性能优化的手段有哪些？'),('cmcacx88m0003grimq4sdbg99','全栈工程师','','Node.js高级软件工程师\n##职位概述\n我们在寻找Node.js高级软件工程师，本职位将负责开发Node.js后端服务，设计多样化\nWeb服务接口，并开发移动及Web应用。我们欢迎对新技术充满热情的开发者。\n##主要职责\n1.开发Node.js服务器应用。\n2.设计REST和GraphQL等Web服务接口。\n3.使用ReactNative开发跨平台移动应用。\n4.构建响应式Web应用，以提升用户体验。\n5.参与产品设计、开发、测试和上线的全过程。\n6.编写、测试并维护高质量代码。\n7.不断学习新技术，提升产品质量和开发效率。\n##职位要求\n1.计算机科学或相关专业学位或具备同等学识。\n2.具备Node.js开发经验。\n3.熟悉关系数据库技术，如MySQL或PostgreSQL。\n4.重视代码质量和安全，有编写单元测试和集成测试的经验。\n##优先条件\n1.有开发Web服务接口的经验者。\n2.有使用ReactNative开发移动应用的经验者。\n3.对HTML5、CSS3、JavaScript等前端技术有深入了解。\n4.具备大数据处理的基础知识和经验者。\n5.具备流利的英语阅读能力。','','2025-06-24 10:02:45.591','2025-06-24 10:02:45.591','1、说说Node.js有哪些全局对象？\n2、说说对Node中的process的理解？有哪些常用方法？\n3、说说对Node中的fs模块的理解?有哪些常用方法\n4、说说Node中的EventEmitter?如何实现一个EventEmitter?\n5、说说对Nodejs中的事件循环机制理解?\n6、什么是HTTP?HTTP和HTTPS的区别?\n7、说说JavaScript中的数据类型？存储上的差别？\n8、说说new操作符具体干了什么？\n9、说说JavaScript中内存泄漏的几种情况？\n10、web常见的攻击方式有哪些？如何防御？');
/*!40000 ALTER TABLE `job_requirements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pdf_documents`
--

DROP TABLE IF EXISTS `pdf_documents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pdf_documents` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fileName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fileUrl` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fileType` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fileSize` int NOT NULL,
  `uploadedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pdf_documents`
--

LOCK TABLES `pdf_documents` WRITE;
/*!40000 ALTER TABLE `pdf_documents` DISABLE KEYS */;
INSERT INTO `pdf_documents` VALUES ('cmc4q9z690001grlw2nc46om5','1750418997151-gz7ilcg4bpn.pdf','https://zygipulkdgtztignbrjr.supabase.co/storage/v1/object/public/pdfs/1750418997151-gz7ilcg4bpn.pdf','require',86254,'2025-06-20 11:29:58.346','2025-06-20 11:29:58.346'),('cmc5zxr540000grfpuhf64hm1','1750495688272-v25oabyul8p.pdf','https://zygipulkdgtztignbrjr.supabase.co/storage/v1/object/public/pdfs/1750495688272-v25oabyul8p.pdf','require',86254,'2025-06-21 08:48:10.408','2025-06-21 08:48:10.408'),('cmc60fqjq0001grfp23aok0za','1750496528251-jltq9rbvh4.pdf','https://zygipulkdgtztignbrjr.supabase.co/storage/v1/object/public/pdfs/1750496528251-jltq9rbvh4.pdf','require',86254,'2025-06-21 09:02:09.439','2025-06-21 09:02:09.439'),('cmc60hgon0002grfptbh1tn1q','1750496608292-qi8zx5zfj1m.pdf','https://zygipulkdgtztignbrjr.supabase.co/storage/v1/object/public/pdfs/1750496608292-qi8zx5zfj1m.pdf','require',86254,'2025-06-21 09:03:29.974','2025-06-21 09:03:29.974'),('cmca9zuv20000grimnp2mxlxh','1750754441692-mbu1044u49c.pdf','https://zygipulkdgtztignbrjr.supabase.co/storage/v1/object/public/pdfs/1750754441692-mbu1044u49c.pdf','company',6138254,'2025-06-24 08:40:49.406','2025-06-24 08:40:49.406');
/*!40000 ALTER TABLE `pdf_documents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `User`
--

DROP TABLE IF EXISTS `User`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `User` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `User_email_key` (`email`),
  KEY `User_email_idx` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `User`
--

LOCK TABLES `User` WRITE;
/*!40000 ALTER TABLE `User` DISABLE KEYS */;
/*!40000 ALTER TABLE `User` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-25 14:14:19
