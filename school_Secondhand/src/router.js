import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

Router.prototype.goBack = function () { 
	this.isBack = true
	window.history.go(-1)
}
const routes = [
  {
	redirect:'/login'
  },
  {
	name:'login',
	component:() => import('./view/login'),
	meta:{
		title:'登录'
	}
  },
  {
	name:'register',
	component:() => import('./view/register'),
	meta:{
		title:'注册账号'
	}
  },
  {
	name:'changePwd',
	component:() => import('./view/changePwd'),
	meta:{
		title:'修改密码'
	}
  },
  {
	name:'addUserMsg',
	component:() => import('./view/addUserMsg'),
	meta:{
		title:'填写用户信息'
	}
  },
  {
	name:'home',
	component:() => import('./view/index'),
	meta:{
		title:'主页'
	}
  },
  {
    name: 'user',
    component: () => import('./view/user'),
    meta: {
      title: '会员中心'
    }
  },
  {
    name: 'goods',
    component: () => import('./view/goods'),
    meta: {
      title: '商品信息'
    }
  },
  {
	name: 'list',
	component: () => import('./view/list'),
	meta: {
      title: '商品列表',
	}
  },
  {
    name: 'usermsg',
    component: () => import('./view/userMsg'),
    meta: {
      title: '用户信息',
    }
  },
  {
    name:'changeUmsg',
    component:() => import('./view/changeUesrMsg'),
    meta:{
       title:'修改信息'
    }
  },
  {
	name:'allOrder',
	component:() => import('./view/allOrder'),
	meta:{
		title:'全部订单'
	}
  },
  {
	name:'search',
	component:() => import('./view/search'),
	meta:{
		title:'搜索'
	}
  },
  {
	name:'goodsInfo',
	component:() => import('./view/goodsInfo'),
	meta:{
		title:'商品详情'
	}
  },
  {
	name:'seller',
	component:() => import('./view/seller'),
	meta:{
		title:'卖家详情'
	}
  },
  {
	name:'orderGoods',
	component:() => import('./view/orderGoods'),
	meta:{
		title:'下单详情'
	}
  },
  {
	name:'orderPlaced',
	component:() => import('./view/orderPlaced'),
	meta:{
		title:'已下单'
	}
  },
  {
	name:'deliver',
	component:() => import('./view/deliver'),
	meta:{
		title:'已发货'
	}
  },
  {
	name:'myCollection',
	component:() => import('./view/myCollection'),
	meta:{
		title:'我的收藏'
	}
  },
  {
	name:'whichISelled',
	component:() => import('./view/whichISelled'),
	meta:{
		title:'我卖出的'
	}
  },
  {
	name:'publish',
	component:() => import('./view/publish'),
	meta:{
		title:'发布闲置'
	}
  },
  {
	name:'publishNotice',
	component:() => import('./view/administrator/publishNotice'),
	meta:{
		title:'发布公告'
	}
  }
];

// add route path
routes.forEach(route => {
  route.path = route.path || '/' + (route.name || '');
});

const router = new Router({ routes });

router.beforeEach((to, from, next) => {
  const title = to.meta && to.meta.title;
  if (title) {
    document.title = title;
  }
  next();
});

export {
  router
};
