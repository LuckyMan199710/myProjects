<template>
  <div>
    <img class="user-poster" src="https://img.yzcdn.cn/public_files/2017/10/23/8690bb321356070e0b8c4404d087f8fd.png">
    <van-row class="user-links" >
      <van-col span="12" @click = "runToOrderPlaced">
        <van-icon name="pending-payment" />
        已下单
      </van-col>
      <van-col span="12">
        <van-icon name="logistics" @click="runToDeliver"/>
        已出单
      </van-col>
    </van-row>

    <van-cell-group class="user-group">
      <van-cell icon="records" title="全部订单" is-link to="/allOrder"/>
    </van-cell-group>

    <van-cell-group>
      <van-cell icon="manager-o" title="个人信息" to="/usermsg" is-link />
      <van-cell icon="balance-o" title="我卖出的" is-link />
      <van-cell icon="star-o" title="我的收藏" to="/myCollection" is-link />
    </van-cell-group>
  </div>
</template>

<script>
import { Row, Col, Icon, Cell, CellGroup } from 'vant';
export default {
  components: {
    [Row.name]: Row,
    [Col.name]: Col,
    [Icon.name]: Icon,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup
  },
  mounted() {
    this.$store.commit('changeTabbarStatusTrue');
    this.$store.commit('changeNavBarStatusFalse');
  },
  methods:{
	runToOrderPlaced(){
		this.$router.push('./orderPlaced');
	},
	runToDeliver(){
		this.$router.push('./deliver')
	}
  }
};
</script>

<style lang="less">
.user {
  &-poster {
    width: 100%;
    height: 53vw;
    display: block;
  }

  &-group {
    margin-bottom: 15px;
  }

  &-links {
    padding: 15px 0;
    font-size: 12px;
    text-align: center;
    background-color: #fff;

    .van-icon {
      display: block;
      font-size: 24px;
    }
  }
}
</style>
