/*
Navicat MySQL Data Transfer

Source Server         : localhost_3306
Source Server Version : 50720
Source Host           : localhost:3306
Source Database       : school_secondhand

Target Server Type    : MYSQL
Target Server Version : 50720
File Encoding         : 65001

Date: 2020-04-13 00:05:55
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for goods_img
-- ----------------------------
DROP TABLE IF EXISTS `goods_img`;
CREATE TABLE `goods_img` (
  `good_img_url` varchar(50) NOT NULL,
  `good_id` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of goods_img
-- ----------------------------
INSERT INTO `goods_img` VALUES ('static\\goods\\1586706629314.jpg', 'ib3dlbffrh');
INSERT INTO `goods_img` VALUES ('static\\goods\\1586706629315.jpg', 'ib3dlbffrh');
INSERT INTO `goods_img` VALUES ('static\\goods\\1586707241248.jpg', 'kr9koha1c1');
