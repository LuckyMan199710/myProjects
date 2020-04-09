/*
Navicat MySQL Data Transfer

Source Server         : localhost_3306
Source Server Version : 50720
Source Host           : localhost:3306
Source Database       : school_secondhand

Target Server Type    : MYSQL
Target Server Version : 50720
File Encoding         : 65001

Date: 2020-04-10 00:17:30
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` varchar(50) NOT NULL COMMENT '用户id',
  `userName` varchar(50) NOT NULL COMMENT '用户名',
  `userPwd` varchar(100) NOT NULL COMMENT '用户密码',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES ('16jvh75jwdx', '1635335844@qq.com', '25f9e794323b453885f5181f1b624d0b');
INSERT INTO `user` VALUES ('1wjochteu3z', '12345678@qq.com', 'cc517d52092adbf54dcc61c6424556fc');
INSERT INTO `user` VALUES ('21o017apid2', '23145678@163.com', '5d93ceb70e2bf5daa84ec3d0cd2c731a');
INSERT INTO `user` VALUES ('fysybmbk4d', '1292082437@qq.com', '9fab6755cd2e8817d3e73b0978ca54a6');
