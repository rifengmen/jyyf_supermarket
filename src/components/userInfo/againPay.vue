<template>
  <div class="container bgeeeeee">
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
          <ul class="goodsList">
            <!-- 商品简介 start -->
            <li v-for="(item, index) in goodsList" :key="index">
              <div class="goods_item bgffffff ellipsis">
                <div class="goods_item_img">
                  <img :src="(item.picture1 ? (imgurl + 'image/' + item.picture1.replace('.', '-zip-300.')) : ('static/img/goods.png'))">
                </div>
                <div class="goods_item_cont">
                  <div class="goods_item_name ellipsis font26">{{item.goodsname}}</div>
                  <div class="goods_item_name ellipsis font24 colorfa2a2a"></div>
                  <div class="goods_item_price">
                    <div class="font30 font_blod colorf84242">￥{{item.price}}</div>
                    <del class="font24 color999999">￥{{item.saleprice}}</del>
                  </div>
                  <div class="goods_item_editnum">
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
      <!-- 积分抵扣 start -->
      <div class="order_sectionss bgffffff">
        <div class="">积分抵扣</div>
        <div class="color999999">
          <span class="colorf84242">￥{{score.Money}}</span>&nbsp;
          共
          <span class="colorf84242">{{score.useScore}}</span>
          分
        </div>
        <div class="score_img" @click="setScoreflag">
          <img src="static/img/on.png" v-if="scoreFlag">
          <img src="static/img/off.png" v-else>
        </div>
      </div>
      <!-- 积分抵扣 end -->
      <!-- 支付方式 start -->
      <div class="order_sectionss bgffffff paymode_img">
        <div class="">支付方式</div>
        <el-radio v-model="paymodeid" label="3">
          <img src="static/img/card.png">&nbsp;储值卡
        </el-radio>
        <el-radio v-model="paymodeid" label="7">
          <img src="static/img/wechat.png">&nbsp;微信
        </el-radio>
      </div>
      <!-- 支付方式 end -->
    </div>
    <!-- 订单内容 end -->
    <!-- 支付按钮 start -->
    <div class="again_order_money bgffffff">
      <div class="order_money_totalMoney font24 ellipsis">实付：<span class="colorf84242 font34">￥{{paymoney.toFixed(2)}}</span></div>
      <div class="pay colorffffff bgff6400">
        <pay-btn
          :paymodeid="paymodeid"
          :scoreFlag="scoreFlag"
          :tradeno="tradeno"
        >立即支付</pay-btn>
      </div>
    </div>
    <!-- 支付按钮 end -->
  </div>
</template>

<script>
import MyHeader from '@/components/common/header/myheader'
import payBtn from '@/components/common/payBtn/payBtn'

export default {
  name: 'againPay',
  data () {
    return {
      // 订单tradeno
      tradeno: this.$route.params.tradeno,
      // 订单详情
      orderdetail: '',
      // 订单商品列表
      goodsList: '',
      // 图片路径
      imgurl: this.IMGURL,
      // 促销类型
      Promotemode: this.$store.state.Promotemode,
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
    // 积分
    score () {
      return this.$store.state.score
    },
    // 积分抵扣金额
    scoreMoney () {
      let money
      if (!this.scoreFlag) {
        money = 0
      } else {
        money = this.score.Money || 0
      }
      return money
    }
  },
  components: {
    MyHeader,
    payBtn
  },
  methods: {
    // 获取订单详情
    getOrderdetail () {
      let data = new FormData()
      let requestData = {
        tradeno: this.tradeno
      }
      requestData = JSON.stringify(requestData)
      data.append('requestData', requestData)
      this.$axios.post('api/order/getOrderDtl', data).then(result => {
        let res = result.data
        if (res.code === 200) {
          this.orderdetail = res.data
          this.paymoney = res.data.shouldmoney
          this.goodsList = res.data.OrderDetail
          let _this = this
          // 页面加载时计算实付金额
          this.orderdetail.PayDetail.forEach((item) => {
            if (item.paymodeid === 4 || item.paymodeid === 5) {
              _this.paymoney -= item.paymoney
            }
          })
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      }).catch(error => {
        throw error
      })
    },
    // 获取再支付信息
    getOrder () {
      let data = new FormData()
      let requestData = {
        tradeno: this.tradeno
      }
      requestData = JSON.stringify(requestData)
      data.append('requestData', requestData)
      this.$axios.post('invest/microFlow/getCanPayMoneyForTrade', data).then(result => {
        let res = result.data
        if (res.code === 200) {
          this.$store.commit('setOrder', res.data)
          this.$store.commit('setFreightmoney', {freightmoney: res.data.freightmoney})
          this.order = res.data
          // 页面加载时请求积分
          this.getScore()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      }).catch(error => {
        throw error
      })
    },
    // 请求可用积分
    getScore () {
      let data = new FormData()
      let requestData = {
        payMoney: parseFloat(this.order.canPayMoney),
        Totalmoney: parseFloat(this.order.totalMoney)
      }
      requestData = JSON.stringify(requestData)
      data.append('requestData', requestData)
      this.$axios.post('bill/pay/payMoneyjf', data).then(result => {
        let res = result.data
        if (res.code === 200) {
          this.$store.commit('setScore', res.data)
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      }).catch(error => {
        throw error
      })
    },
    // 是否使用积分
    setScoreflag () {
      this.scoreFlag = !this.scoreFlag
      if (this.scoreFlag) {
        this.paymoney = this.paymoney - this.score.Money
      } else {
        this.paymoney = this.paymoney + this.score.Money
      }
    }
  },
  watch: {},
  beforeCreate () {
  },
  created () {
    // 页面加载时获取订单详情
    this.getOrderdetail()
    // 页面加载时获取再支付信息
    this.getOrder()
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
