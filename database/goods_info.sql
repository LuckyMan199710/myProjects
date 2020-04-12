/*
Navicat MySQL Data Transfer

Source Server         : localhost_3306
Source Server Version : 50720
Source Host           : localhost:3306
Source Database       : school_secondhand

Target Server Type    : MYSQL
Target Server Version : 50720
File Encoding         : 65001

Date: 2020-04-13 00:07:21
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for goods_info
-- ----------------------------
DROP TABLE IF EXISTS `goods_info`;
CREATE TABLE `goods_info` (
  `good_id` varchar(50) NOT NULL COMMENT '商品id',
  `good_title` varchar(50) NOT NULL COMMENT '商品标题',
  `good_info` varchar(200) NOT NULL COMMENT '商品详细信息',
  `good_price` decimal(10,2) NOT NULL COMMENT '商品价格',
  `seller_id` varchar(50) NOT NULL COMMENT '发布人id',
  `seller` varchar(30) NOT NULL COMMENT '发布者名字',
  PRIMARY KEY (`good_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of goods_info
-- ----------------------------
INSERT INTO `goods_info` VALUES ('18knagn3l29', '111', '55555', '2.00', 'fysybmbk4d', '老八美食家');
INSERT INTO `goods_info` VALUES ('ib3dlbffrh', '1111', '1111', '20.50', 'fysybmbk4d', '老八美食家');
INSERT INTO `goods_info` VALUES ('kr9koha1c1', '555', '555', '3333.00', 'fysybmbk4d', '老八美食家');
INSERT INTO `goods_info` VALUES ('ms8kf3linc', '111', '55555', '2.00', 'fysybmbk4d', '老八美食家');
