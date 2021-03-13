<template>
  <div class="container_pt90 bgeeeeee">
    <!-- 头部 start -->
    <my-header>
      <template v-slot:backs>
        <i class="el-icon-arrow-left"></i>
      </template>
      <template v-slot:header>支付信息</template>
    </my-header>
    <!-- 头部 end -->
    <!-- 订单内容 start -->
    <div class="again_order_cont">
      <!-- 收货地址 start -->
      <div class="order_section bgffffff">
        <div class="address_item_desc">
          <div class="address_item_user font_blod ellipsis">
            <div>{{orderdetail.receiver}}</div>
            <div>{{orderdetail.phone}}</div>
            <!--<div class="address_item_age bgffae43 colorffffff tc border_r4 font22 font_normal">店铺</div>-->
          </div>
          <div class="address_item_address ellipsis color666666">
            <!--<div class="font24">{{'收货片'}}</div>-->
            <!--<div class="font24">{{'收货区'}}</div>-->
            <div class="font24">{{orderdetail.address}}</div>
          </div>
        </div>
      </div>
      <!-- 收货地址 end -->
      <!-- 订单商品 start -->
      <div class="order_sections bgffffff">
        <div class="order_goods">
          <!-- 商品列表 start -->
          <ul class="goods_list goodsList">
            <!-- 商品简介 start -->
            <li class="goods_li" v-for="(item, index) in goodsList" :key="index">
              <div class="goods_item bgffffff ellipsis">
                <div class="goods_item_img">
                  <img v-lazy="(item.picture1) ? IMGURL + 'image/' + item.picture1.replace('.', '-zip-300.') : ''">
                </div>
                <div class="goods_item_cont">
                  <div class="goods_item_name ellipsis font26">{{item.goodsname}}</div>
                  <div class="goods_item_name ellipsis font24 colorfa2a2a"></div>
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
          <div>订单编号</div>
          <div class="font24 color666666">{{orderdetail.tradeno}}</div>
        </div>
        <div class="orderdesc">
          <div>下单时间</div>
          <div class="font24 color666666">{{orderdetail.Recordtime}}</div>
        </div>
        <div class="orderdesc">
          <div>订单备注</div>
          <div class="order_comment font24 color666666">{{orderdetail.comment}}</div>
        </div>
      </div>
      <!-- 订单信息 end -->
      <!-- 已支付金额 start -->
      <div class="order_sectionss bgffffff">
        <div class="">已支付</div>
        <div class="color999999">
          <span class="colorf84242">￥{{(order.havepaymoney || 0).toFixed(2)}}</span>
        </div>
      </div>
      <!-- 已支付金额 end -->
      <!-- 积分抵扣 start -->
      <div class="order_sectionss bgffffff" v-if="paymodeList.filter(item => item.paymodeid === 5).length">
        <div class="">积分抵扣</div>
        <div class="color999999">
          <span class="colorf84242">￥{{score.Money}}</span>&nbsp;
          抵扣
          <span class="colorf84242">{{score.useScore}}</span>
          分
        </div>
        <div class="score_img" @click="setScoreflag">
          <img src="static/img/on.png" v-if="scoreFlag">
          <img src="static/img/off.png" v-else>
        </div>
      </div>
      <!-- 积分抵扣 end -->
      <!-- 可用零钱 start -->
      <div class="order_sectionss bgffffff" v-if="smallmoney">
        <div class="">零钱</div>
        <div class="color999999">
          <span class="colorf84242" v-if="smallmoney >= 0">
            <span class="font26">使用零钱</span>
            ￥{{(smallmoney || 0).toFixed(2)}}
          </span>
          <span class="colorf84242" v-if="smallmoney < 0">
            <span class="font26">补缴零钱</span>
            ￥{{(Math.abs(smallmoney) || 0).toFixed(2)}}
          </span>
        </div>
      </div>
      <!-- 可用零钱 end -->
      <!-- 支付方式 start -->
      <div class="order_sectionss bgffffff paymode_img">
        <div class="">支付方式</div>
        <van-radio-group
          direction="horizontal"
          v-model="paymodeid">
          <van-radio
            v-if="paymodeList.filter(item => item.paymodeid === 3).length"
            name="3"
            checked-color="#ff6400">
            <img src="static/img/card.png">&nbsp;
            <span class="payname font24">储值卡</span>
          </van-radio>
          <van-radio
            name="7"
            checked-color="#ff6400">
            <img src="static/img/wechat.png">&nbsp;
            <span class="payname font24">微信</span>
          </van-radio>
        </van-radio-group>
      </div>
      <!-- 支付方式 end -->
    </div>
    <!-- 订单内容 end -->
    <!-- 支付按钮 start -->
    <div class="again_order_money bgffffff">
      <div class="order_money_totalMoney font24 ellipsis">待支付：<span class="colorf84242 font34">￥{{paymoney.toFixed(2)}}</span></div>
      <div class="pay colorffffff bgff6400">
        <pay-btn
          :paymodeid="paymodeid"
          :scoreFlag="scoreFlag"
          :tradeno="tradeno"
          :froms="'againpay'"
        >立即支付</pay-btn>
      </div>
    </div>
    <!-- 支付按钮 end -->
  </div>
</template>

<script>
import MyHeader from '@/components/common/header/myheader'
import payBtn from '@/components/common/payBtn/payBtn'
import tip from '@/utils/tip'

export default {
  name: 'againPay',
  data () {
    return {
      // 订单tradeno
      tradeno: this.$route.query.tradeno,
      // 订单详情
      orderdetail: '',
      // 订单商品列表
      goodsList: '',
      // 图片路径
      IMGURL: this.IMGURL,
      // 计算付款金额
      paymoney: 0,
      // 积分使用开关
      scoreFlag: false,
      // 支付方式
      paymodeid: '7',
      // 再支付订单信息
      order: ''
    }
  },
  computed: {
    // 支付方式列表
    paymodeList () {
      let self = this
      return self.$store.state.order.paymodeList || []
    },
    // 积分
    score () {
      let self = this
      return self.$store.state.score
    },
    // 积分抵扣金额
    scoreMoney () {
      let self = this
      let money
      if (!self.scoreFlag) {
        money = 0
      } else {
        money = self.score.Money || 0
      }
      return money
    },
    // 零钱
    smallmoney () {
      let self = this
      let money = self.paymoney - self.order.smallmoney
      if (money < 0) {
        return self.paymoney
      }
      return self.order.smallmoney
    }
  },
  components: {
    MyHeader,
    payBtn
  },
  methods: {
    // 获取订单详情
    getOrderdetail () {
      let self = this
      let data = {
        tradeno: self.tradeno,
        // 区分微会员和百货，wemember：微会员；generalMerchandise：百货
        flag: 'wemember'
      }
      self.$api.api.getOrderDtl(data).then(result => {
        let res = result.data
        if (res.code === 200) {
          self.orderdetail = res.data
          self.goodsList = res.data.OrderDetail
        } else {
          tip(res.msg)
        }
      })
    },
    // 获取再支付信息
    getOrder () {
      let self = this
      let data = {
        tradeno: self.tradeno
      }
      self.$api.invest.getCanPayMoneyForTrade(data).then(result => {
        let res = result.data
        if (res.code === 200) {
          self.$store.commit('setOrder', res.data)
          self.$store.commit('setFreightmoney', {freightmoney: res.data.freightmoney})
          self.order = res.data
          self.paymoney = res.data.canPayMoney
          // 存在积分抵扣支付方式时
          if (self.paymodeList.filter(item => item.paymodeid === 5).length) {
            // 页面加载时请求积分
            self.getScore()
          }
        } else {
          tip(res.msg)
        }
      })
    },
    // 请求可用积分
    getScore () {
      let self = this
      let data = {
        payMoney: parseFloat(self.order.canPayMoney),
        Totalmoney: parseFloat(self.order.totalMoney)
      }
      self.$api.bill.payMoneyjf(data).then(result => {
        let res = result.data
        if (res.code === 200) {
          self.$store.commit('setScore', res.data)
        } else {
          tip(res.msg)
        }
      })
    },
    // 是否使用积分
    setScoreflag () {
      let self = this
      self.scoreFlag = !self.scoreFlag
      if (self.scoreFlag) {
        self.paymoney = self.paymoney - self.score.Money
      } else {
        self.paymoney = self.paymoney + self.score.Money
      }
    }
  },
  watch: {},
  beforeCreate () {
  },
  created () {
    let self = this
    // 页面加载时获取订单详情
    self.getOrderdetail()
    // 页面加载时获取再支付信息
    self.getOrder()
  },
  beforeMount () {
  },
  mounted () {
  }
}
</script>

<style scoped>
@import "static/css/userInfo.css";

</style>
