-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 21, 2022 at 02:37 AM
-- Server version: 10.4.22-MariaDB
-- PHP Version: 8.1.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `armfirewall`
--

CREATE DATABASE IF NOT EXISTS armfirewall;

USE armfirewall;

-- --------------------------------------------------------

--
-- Table structure for table `applicationstring`
--

CREATE TABLE `applicationstring` (
  `idString` int(11) NOT NULL,
  `valString` varchar(255) NOT NULL,
  `idComponent` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `component`
--

CREATE TABLE `component` (
  `idComponent` varchar(255) NOT NULL,
  `fileLocation` int(11) NOT NULL,
  `isEnabled` tinyint(1) NOT NULL DEFAULT 0,
  `typeEnv` int(11) NOT NULL,
  `childComponent` tinyint(1) NOT NULL,
  `parentComponent` varchar(255) DEFAULT NULL,
  `langComponent` char(6) NOT NULL,
  `settingsComponent` int(11) NOT NULL,
  `privilegeComponent` int(1) NOT NULL,
  `creationComponent` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `component`
--

INSERT INTO `component` (`idComponent`, `fileLocation`, `isEnabled`, `typeEnv`, `childComponent`, `parentComponent`, `langComponent`, `settingsComponent`, `privilegeComponent`, `creationComponent`) VALUES
('auth', 4, 1, 1, 0, NULL, 'es_ES', 6, 8, '2022-06-01'),
('interfaces', 2, 1, 1, 0, 'interfaces', 'es_ES', 2, 6, '2022-05-26'),
('pwdManager', 4, 1, 1, 1, 'auth', 'es_ES', 5, 6, '2022-06-01'),
('rules', 2, 1, 1, 0, NULL, 'es_ES', 7, 6, '2022-06-02'),
('setup', 1, 1, 1, 0, 'setup', 'es_ES', 1, 8, '2022-05-10');

-- --------------------------------------------------------

--
-- Table structure for table `configuration`
--

CREATE TABLE `configuration` (
  `idConfiguration` int(11) NOT NULL,
  `idComponent` varchar(255) NOT NULL,
  `valConfiguration` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`valConfiguration`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `configuration`
--

INSERT INTO `configuration` (`idConfiguration`, `idComponent`, `valConfiguration`) VALUES
(1, 'setup', '{\"completed\": false}'),
(2, 'interfaces', '[{\"interfaceId\":3,\"settings\":{\"isEnabled\":true,\"ip_setting\":\"ipv4\",\"isPrimary\":false,\"isLocked\":false,\"desc\":\"Interfaz VirtualBox Host-Only Network\"}},{\"interfaceId\":11,\"settings\":{\"isEnabled\":true,\"ip_setting\":\"dhcp\",\"isPrimary\":true,\"isLocked\":true,\"desc\":\"Interfaz Wi-Fi\"}}]'),
(5, 'pwdManager', '{\"enabled\": true}'),
(6, 'auth', '{}'),
(7, 'rules', '[]');

-- --------------------------------------------------------

--
-- Table structure for table `enviroment`
--

CREATE TABLE `enviroment` (
  `idEnv` int(11) NOT NULL,
  `typeEnv` varchar(5) NOT NULL DEFAULT '',
  `descEnv` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `enviroment`
--

INSERT INTO `enviroment` (`idEnv`, `typeEnv`, `descEnv`) VALUES
(1, 'dev', 'Development Enviroment'),
(2, 'prod', 'Production Enviroment');

-- --------------------------------------------------------

--
-- Table structure for table `filestructure`
--

CREATE TABLE `filestructure` (
  `idStructure` int(11) NOT NULL,
  `fileLocation` varchar(255) NOT NULL,
  `idPrivilege` int(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `filestructure`
--

INSERT INTO `filestructure` (`idStructure`, `fileLocation`, `idPrivilege`) VALUES
(1, '__dirname/src/controllers/SetupController', 8),
(2, '__dirname/src/controllers/FirewallController', 8),
(3, '__dirname/src/controllers/DashboardController', 8),
(4, '__dirname/src/controllers/AuthController', 8);

-- --------------------------------------------------------

--
-- Stand-in structure for view `interfaces`
-- (See below for the actual view)
--
CREATE TABLE `interfaces` (
`nameComponent` varchar(255)
,`fileLocation` varchar(255)
,`isEnabled` tinyint(1)
,`settingsComponent` longtext
,`privilege` enum('---','--x','-w-','-wx','r---','r-x','rw-','rwx')
);

-- --------------------------------------------------------

--
-- Table structure for table `language`
--

CREATE TABLE `language` (
  `langCode` char(6) NOT NULL,
  `langDesc` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `language`
--

INSERT INTO `language` (`langCode`, `langDesc`) VALUES
('en_GB', 'Enlgish United Kingdom'),
('en_US', 'English United States'),
('es_CO', 'Español Colombia'),
('es_ES', 'Español España'),
('es_MX', 'Español Mexico');

-- --------------------------------------------------------

--
-- Table structure for table `privilege`
--

CREATE TABLE `privilege` (
  `idPrivilege` int(1) NOT NULL,
  `permPrivilege` enum('---','--x','-w-','-wx','r---','r-x','rw-','rwx') NOT NULL,
  `descPrivilege` varchar(150) DEFAULT NULL,
  `idRole` int(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `privilege`
--

INSERT INTO `privilege` (`idPrivilege`, `permPrivilege`, `descPrivilege`, `idRole`) VALUES
(1, '---', 'El usuario normal no puede ejecutar ninguna acción.', 3),
(2, 'r---', 'El usuario únicamente podrá leer lo permitido dentro de su entorno', 3),
(3, '--x', 'El usuario únicamente podrá ejecutar lo permitido dentro de su entorno.', 3),
(4, 'r-x', 'El moderador podrá ejecutar o leer lo permitido dentro de su entorno.', 2),
(5, 'rw-', 'El moderador podrá escribir o leer lo permitido dentro de su entorno.', 2),
(6, 'r-x', 'El administrador podrá ejecutar o leer lo permitido dentro de cualquier entorno.', 1),
(7, 'rw-', 'El administrador podrá escribir o leer lo permitido dentro de cualquier entorno.', 1),
(8, 'rwx', 'El administrador tiene todos los permisos dentro de cualquier entorno.', 1);

-- --------------------------------------------------------

--
-- Table structure for table `role`
--

CREATE TABLE `role` (
  `idRole` int(1) NOT NULL DEFAULT 2,
  `typeRole` varchar(25) NOT NULL,
  `descRole` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `role`
--

INSERT INTO `role` (`idRole`, `typeRole`, `descRole`) VALUES
(1, 'admin', 'Administrador autorizado en el sistema.'),
(2, 'moderator', 'Personal autorizado por el adminsitrador a realizar cierto tipo de acciones.'),
(3, 'user', 'Usuario normal');

-- --------------------------------------------------------

--
-- Stand-in structure for view `rules`
-- (See below for the actual view)
--
CREATE TABLE `rules` (
`nameComponent` varchar(255)
,`fileLocation` varchar(255)
,`isEnabled` tinyint(1)
,`settingsComponent` longtext
,`privilege` enum('---','--x','-w-','-wx','r---','r-x','rw-','rwx')
);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `authUser` varchar(25) NOT NULL,
  `authPassword` varchar(65) NOT NULL,
  `firstName` varchar(75) NOT NULL,
  `lastName` varchar(75) NOT NULL,
  `firstSurname` varchar(75) NOT NULL,
  `lastSurname` varchar(75) NOT NULL,
  `fullName` varchar(300) NOT NULL,
  `authEmail` varchar(255) NOT NULL,
  `termsAccepted` tinyint(1) NOT NULL DEFAULT 0,
  `accountStatus` tinyint(1) NOT NULL DEFAULT 0,
  `idPrivilege` int(1) NOT NULL,
  `registrationUser` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`authUser`, `authPassword`, `firstName`, `lastName`, `firstSurname`, `lastSurname`, `fullName`, `authEmail`, `termsAccepted`, `accountStatus`, `idPrivilege`, `registrationUser`) VALUES
('admin', '$2b$12$.pbwr9MfJxULE75MSfNNbuwLOaQmsb9xRtYTmtS9Ws9.yPWEbK.lq', 'Administrador', '', 'Firewall', '', 'Administrador Firewall', 'admin@arm-firewall.com', 1, 1, 8, '2022-05-02');

-- --------------------------------------------------------

--
-- Stand-in structure for view `userdata`
-- (See below for the actual view)
--
CREATE TABLE `userdata` (
`authUser` varchar(25)
,`authEmail` varchar(255)
,`authPassword` varchar(65)
,`name` varchar(300)
,`isActive` tinyint(1)
,`typeRole` varchar(25)
,`typePrivileges` enum('---','--x','-w-','-wx','r---','r-x','rw-','rwx')
);

-- --------------------------------------------------------

--
-- Structure for view `interfaces`
--
DROP TABLE IF EXISTS `interfaces`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `interfaces`  AS SELECT `c`.`idComponent` AS `nameComponent`, `fs`.`fileLocation` AS `fileLocation`, `c`.`isEnabled` AS `isEnabled`, `sc`.`valConfiguration` AS `settingsComponent`, `p`.`permPrivilege` AS `privilege` FROM ((((`component` `c` join `filestructure` `fs`) join `configuration` `sc`) join `role` `r`) join `privilege` `p`) WHERE `c`.`privilegeComponent` = `p`.`idPrivilege` AND `c`.`settingsComponent` = `sc`.`idConfiguration` AND `c`.`fileLocation` = `fs`.`idStructure` AND `p`.`idRole` = `r`.`idRole` AND `c`.`idComponent` like '%interface%' ;

-- --------------------------------------------------------

--
-- Structure for view `rules`
--
DROP TABLE IF EXISTS `rules`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `rules`  AS SELECT `c`.`idComponent` AS `nameComponent`, `fs`.`fileLocation` AS `fileLocation`, `c`.`isEnabled` AS `isEnabled`, `sc`.`valConfiguration` AS `settingsComponent`, `p`.`permPrivilege` AS `privilege` FROM ((((`component` `c` join `filestructure` `fs`) join `configuration` `sc`) join `role` `r`) join `privilege` `p`) WHERE `c`.`privilegeComponent` = `p`.`idPrivilege` AND `c`.`settingsComponent` = `sc`.`idConfiguration` AND `c`.`fileLocation` = `fs`.`idStructure` AND `p`.`idRole` = `r`.`idRole` AND `c`.`idComponent` like '%rule%' ;

-- --------------------------------------------------------

--
-- Structure for view `userdata`
--
DROP TABLE IF EXISTS `userdata`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `userdata`  AS SELECT `u`.`authUser` AS `authUser`, `u`.`authEmail` AS `authEmail`, `u`.`authPassword` AS `authPassword`, `u`.`fullName` AS `name`, `u`.`accountStatus` AS `isActive`, `r`.`typeRole` AS `typeRole`, `p`.`permPrivilege` AS `typePrivileges` FROM ((`user` `u` join `role` `r`) join `privilege` `p`) WHERE `u`.`idPrivilege` = `p`.`idPrivilege` AND `p`.`idRole` = `r`.`idRole` ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `applicationstring`
--
ALTER TABLE `applicationstring`
  ADD PRIMARY KEY (`idString`),
  ADD KEY `idComponent` (`idComponent`);

--
-- Indexes for table `component`
--
ALTER TABLE `component`
  ADD PRIMARY KEY (`idComponent`),
  ADD KEY `privilegeComponent` (`privilegeComponent`),
  ADD KEY `typeEnv` (`typeEnv`),
  ADD KEY `parentComponent` (`parentComponent`),
  ADD KEY `langComponent` (`langComponent`),
  ADD KEY `settingsComponent` (`settingsComponent`),
  ADD KEY `fileLocation` (`fileLocation`);

--
-- Indexes for table `configuration`
--
ALTER TABLE `configuration`
  ADD PRIMARY KEY (`idConfiguration`),
  ADD KEY `idComponent` (`idComponent`);

--
-- Indexes for table `enviroment`
--
ALTER TABLE `enviroment`
  ADD PRIMARY KEY (`idEnv`);

--
-- Indexes for table `filestructure`
--
ALTER TABLE `filestructure`
  ADD PRIMARY KEY (`idStructure`),
  ADD KEY `idPrivilege` (`idPrivilege`);

--
-- Indexes for table `language`
--
ALTER TABLE `language`
  ADD PRIMARY KEY (`langCode`);

--
-- Indexes for table `privilege`
--
ALTER TABLE `privilege`
  ADD PRIMARY KEY (`idPrivilege`),
  ADD KEY `idRole` (`idRole`);

--
-- Indexes for table `role`
--
ALTER TABLE `role`
  ADD PRIMARY KEY (`idRole`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`authUser`),
  ADD KEY `idPrivilege` (`idPrivilege`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `applicationstring`
--
ALTER TABLE `applicationstring`
  MODIFY `idString` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `configuration`
--
ALTER TABLE `configuration`
  MODIFY `idConfiguration` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `enviroment`
--
ALTER TABLE `enviroment`
  MODIFY `idEnv` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `filestructure`
--
ALTER TABLE `filestructure`
  MODIFY `idStructure` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `privilege`
--
ALTER TABLE `privilege`
  MODIFY `idPrivilege` int(1) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `applicationstring`
--
ALTER TABLE `applicationstring`
  ADD CONSTRAINT `applicationstring_ibfk_1` FOREIGN KEY (`idComponent`) REFERENCES `component` (`idComponent`);

--
-- Constraints for table `component`
--
ALTER TABLE `component`
  ADD CONSTRAINT `component_ibfk_1` FOREIGN KEY (`privilegeComponent`) REFERENCES `privilege` (`idPrivilege`),
  ADD CONSTRAINT `component_ibfk_2` FOREIGN KEY (`typeEnv`) REFERENCES `enviroment` (`idEnv`),
  ADD CONSTRAINT `component_ibfk_4` FOREIGN KEY (`langComponent`) REFERENCES `language` (`langCode`),
  ADD CONSTRAINT `component_ibfk_5` FOREIGN KEY (`settingsComponent`) REFERENCES `configuration` (`idConfiguration`),
  ADD CONSTRAINT `component_ibfk_6` FOREIGN KEY (`idComponent`) REFERENCES `configuration` (`idComponent`),
  ADD CONSTRAINT `component_ibfk_7` FOREIGN KEY (`fileLocation`) REFERENCES `filestructure` (`idStructure`),
  ADD CONSTRAINT `component_ibfk_8` FOREIGN KEY (`parentComponent`) REFERENCES `component` (`idComponent`) ON UPDATE CASCADE;

--
-- Constraints for table `filestructure`
--
ALTER TABLE `filestructure`
  ADD CONSTRAINT `filestructure_ibfk_1` FOREIGN KEY (`idPrivilege`) REFERENCES `privilege` (`idPrivilege`);

--
-- Constraints for table `privilege`
--
ALTER TABLE `privilege`
  ADD CONSTRAINT `privilege_ibfk_1` FOREIGN KEY (`idRole`) REFERENCES `role` (`idRole`);

--
-- Constraints for table `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `user_ibfk_1` FOREIGN KEY (`idPrivilege`) REFERENCES `privilege` (`idPrivilege`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;