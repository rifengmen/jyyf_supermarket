<template>
    <!-- 订单内容 start -->
    <div>
        <!-- 收货地址 start -->
        <div class="order_section bgffffff">
            <div class="address_item_desc">
                <div class="address_item_user font_blod ellipsis">
                    <div>{{orderdetail.receiver}}</div>
                    <div>{{orderdetail.phone}}</div>
                </div>
                <div class="address_item_address font24 color666666">{{orderdetail.address}}</div>
            </div>
        </div>
        <!-- 收货地址 end -->
        <!-- 订单商品 start -->
        <div class="order_sections bgffffff">
            <div class="order_goods">
                <!-- 商品列表 start -->
                <ul class="goodsList">
                    <!-- 商品简介 start -->
                    <li v-for="(item, index) in goodsList" :key="index" class="goods_li">
                        <div class="goods_item bgffffff">
                            <div class="goods_item_img">
                                <img v-lazy="(item.picture1) ? IMGURL + 'image/' + item.picture1.replace('.', '-zip-300.') : ''">
                            </div>
                            <div class="goods_item_cont">
                                <div class="goods_item_name ellipsis2 font26">{{item.goodsname}}</div>
                                <div class="goods_item_editnum">
                                    <div class="goods_item_price">
                                        <div class="font30 font_blod colorf84242">￥{{item.price}}</div>
                                        <del class="font24 color999999">￥{{item.saleprice}}</del>
                                    </div>
                                    <div class="font30 color999999">x <span class="">{{item.amount}}</span></div>
                                </div>
                            </div>
                        </div>
                    </li>
                    <!-- 商品简介 end -->
                </ul>
                <!-- 商品列表 end -->
            </div>
        </div>
        <!-- 订单商品 end -->
        <!-- 订单信息 start -->
        <div class="order_section bgffffff">
            <div class="orderdesc">
                <div>订单状态</div>
                <div class="font24 color666666">{{orderdetail.stausdescribe}}</div>
            </div>
            <div class="orderdesc">
                <div>订单编号</div>
                <div class="font24 color666666">{{orderdetail.tradeno}}</div>
            </div>
            <div class="orderdesc" v-if="orderdetail.pickoutcode">
                <div>取货码</div>
                <div class="font24 colorff6400">{{orderdetail.pickoutcode}}</div>
            </div>
            <div class="orderdesc">
                <div>下单时间</div>
                <div class="font24 color666666">{{orderdetail.Recordtime}}</div>
            </div>
            <div class="orderdesc">
                <div>订单备注</div>
                <div class="order_comment font24 color666666">{{orderdetail.comment}}</div>
            </div>
            <div class="orderdesc" v-for="(item, index) in orderdetail.PayDetail" :key="index" v-if="orderdetail.paystate === 1 && item.paymodeid === 3">
                <div>付款方式</div>
                <div class="pay_img tl color666666">
                    <img src="static/img/card.png">&nbsp;储值卡
                </div>
                <div class="pay_img color666666" v-if="!orderdetail.paymoney">无</div>
            </div>
            <div class="orderdesc" v-for="(item, index) in orderdetail.PayDetail" :key="index" v-if="orderdetail.paystate === 1 && item.paymodeid === 7">
                <div>付款方式</div>
                <div class="pay_img tl color666666">
                    <img src="static/img/wechat.png">&nbsp;微信
                </div>
                <div class="pay_img color666666" v-if="!orderdetail.paymoney">无</div>
            </div>
            <div class="orderdesc" v-for="(item, index) in orderdetail.PayDetail" :key="index" v-if="orderdetail.paystate === 1 && orderdetail.shouldmoney === 0">
                <div>付款方式</div>
                <div class="pay_img color666666">无</div>
            </div>
            <div class="orderdesc" v-if="orderdetail.paystate === 1">
                <div>付款时间</div>
                <div class="font24 color666666">{{orderdetail.paydate}}</div>
            </div>
        </div>
        <!-- 订单信息 end -->
    </div>
    <!-- 订单内容 end -->
</template>
<script>

export default {
  /**
   * 组件名称
   */
  name: 'orderDesc',

  /**
   * 接收父组件参数
   */
  props: {
    // 订单详情
    orderdetail: {
      type: Object,
      default () {
        return {}
      }
    },
    // 商品列表
    goodsList: {
      type: Array,
      default () {
        return []
      }
    }
  },

  /**
   * 组件属性
   */
  data () {
    return {
      // 图片路径
      IMGURL: this.IMGURL
    }
  },

  /**
   * 组件计算属性
   */
  computed: {},

  /**
   * 组件子组件
   */
  components: {},

  /**
   * 组件方法
   */
  methods: {},

  /**
   * 路由进入前
   */
  beforeRouteEnter (to, from, next) {
    next()
  },

  /**
   * 路由离开前
   */
  beforeRouteLeave (to, from, next) {
    next()
  },

  /**
   * 组件创建之前
   */
  beforeCreate () {},

  /**
   * 组件创建之后
   */
  created () {},

  /**
   * 组件模版编译挂载之前
   */
  beforeMount () {},

  /**
   * 组件模版编译挂载之后
   */
  mounted () {},

  /**
   * 组件更新之前
   */
  beforeUpdate () {},

  /**
   * 组件更新之后
   */
  updated () {},

  /**
   * 缓存组件激活时
   */
  activated () {},

  /**
   * 缓存组件移除时
   */
  deactivated () {},

  /**
   * 组件被销毁之前
   */
  beforeDestroy () {},

  /**
   * 组件被销毁之后
   */
  destroyed () {}
}
</script>

<style scoped>
    @import url('static/css/orderDesc.css');
</style>
