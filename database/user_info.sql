/*
Navicat MySQL Data Transfer

Source Server         : localhost_3306
Source Server Version : 50720
Source Host           : localhost:3306
Source Database       : school_secondhand

Target Server Type    : MYSQL
Target Server Version : 50720
File Encoding         : 65001

Date: 2020-04-10 00:17:39
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for user_info
-- ----------------------------
DROP TABLE IF EXISTS `user_info`;
CREATE TABLE `user_info` (
  `u_Id` varchar(50) NOT NULL COMMENT '用户id',
  `u_name` varchar(50) NOT NULL COMMENT '用户昵称',
  `u_area` varchar(50) NOT NULL COMMENT '用户所在地',
  `u_headimg` varchar(50) NOT NULL COMMENT '用户头像url',
  `u_sex` int(2) NOT NULL COMMENT '性别',
  `u_age` int(4) NOT NULL COMMENT '年龄',
  `u_birthday` varchar(50) NOT NULL COMMENT '生日',
  `u_phonenum` varchar(20) NOT NULL COMMENT '联系电话',
  `u_mail` varchar(20) NOT NULL COMMENT '邮箱',
  `u_collage` varchar(20) NOT NULL COMMENT '所在学院',
  `u_grade` varchar(20) NOT NULL COMMENT '班级',
  `u_address` varchar(100) NOT NULL COMMENT '收货地址',
  `u_qq` varchar(20) NOT NULL COMMENT 'QQ号',
  `u_wechat` varchar(20) NOT NULL COMMENT '微信号',
  PRIMARY KEY (`u_Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of user_info
-- ----------------------------
