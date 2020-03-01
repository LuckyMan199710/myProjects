<template>
  <div class="goods">
    <van-swipe class="goods-swipe" :autoplay="3000">
      <van-swipe-item v-for="thumb in goods.thumb" :key="thumb">
        <img :src="thumb" fit="cover">
      </van-swipe-item>
    </van-swipe>

    <van-cell-group>
      <van-cell>
        <div class="goods-title">{{ goods.title }}</div>
        <div class="goods-price">{{ formatPrice(goods.price) }}</div>
      </van-cell>
      <van-cell class="goods-express">
        <van-col span="10">运费：{{ goods.express }}</van-col>
      </van-cell>
    </van-cell-group>

    <van-cell-group class="goods-cell-group">
      <van-cell value="查看卖家" icon="manager-o" is-link @click="runToSeller">
        <template slot="title">
          <span class="van-cell-text">{{goods.sellerName}}</span>
        </template>
      </van-cell>
    </van-cell-group>

    <van-cell-group class="goods-cell-group">
      <van-cell title="查看商品详情" is-link @click="runToGoodsInfo" />
    </van-cell-group>

    <van-goods-action>
      <van-goods-action-icon icon="star" :text="text" :color="color" @click="collectGoods"/>
      <van-goods-action-button type="info" @click="runToOrderGoods">
        立即下单
      </van-goods-action-button>
    </van-goods-action>
  </div>
</template>

<script>
import {
  Tag,
  Col,
  Icon,
  Cell,
  CellGroup,
  Swipe,
  Toast,
  SwipeItem,
  GoodsAction,
  GoodsActionIcon,
  GoodsActionButton,
  Sku
} from 'vant';

export default {
  components: {
    [Tag.name]: Tag,
    [Col.name]: Col,
    [Icon.name]: Icon,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Swipe.name]: Swipe,
    [SwipeItem.name]: SwipeItem,
    [GoodsAction.name]: GoodsAction,
    [GoodsActionIcon.name]: GoodsActionIcon,
    [GoodsActionButton.name]: GoodsActionButton,
	[Sku.name]: Sku,
	[Toast.name]:Toast
  },

  data() {
    return {
      goods: {
		goodsid:1,
		sellerId:101,
		sellerName:"飞翔的鱼",
        title: '苹果6二手',
        price: 999,
        express: '免运费',
		explain:"因为换新手机用不到了所以出了，功能正常，换过屏幕，有意者加vx，可小刀，恶意骚扰者请绕道",
        thumb: [
          require('../assets/timg.jpg'),
          require('../assets/图2.jpg'),
          require('../assets/图3.jpg')
        ]
      },
        isCollected:false ,//判断当前物品是否被收藏
        color:"black" ,//收藏状态的改变
		text:""
    };
  },
  methods: {
    formatPrice() {
      return '¥' + (this.goods.price).toFixed(2);
    },
	runToGoodsInfo(){
		this.$router.push({name:'goodsInfo',params:this.goods})
	},
	runToSeller(){
		this.$router.push({name:'seller',params:{id:this.goods.sellerId}});
	},
	runToOrderGoods(){
		this.$router.push({name:"orderGoods",params:this.goods})
	},
	collectGoods(){
		this.isisCollected = !this.isisCollected;
		if(this.isisCollected === true){
			this.color = "skyblue";
			this.text = "已收藏";
		}
		else{
			this.color = "black";
			this.text = "";
		}
	}
  },
  mounted() {
		this.$store.commit('changeTabbarStatusFalse'); //使导航栏消失避免占用空间
		this.$store.commit('changeNavBarStatusTrue'); 
  }
};
</script>

<style lang="less">
.goods {
  &-swipe {
    img {
      width: 100%;
      height: 350px;
      display: block;
    }
  }

  &-title {
    font-size: 16px;
  }

  &-price {
    color: #f44;
  }

  &-express {
    color: #999;
    font-size: 12px;
    padding: 5px 15px;
  }

  &-cell-group {
    margin: 15px 0;

    .van-cell__value {
      color: #999;
    }
  }

  &-tag {
    margin-left: 5px;
  }
}
</style>
