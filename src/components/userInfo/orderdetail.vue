<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div class="container_pt90 bgeeeeee">
    <!-- 头部 start -->
    <my-header>
      <template v-slot:backs>
        <i class="el-icon-arrow-left"></i>
      </template>
      <template v-slot:header>订单详情</template>
    </my-header>
    <!-- 头部 end -->
    <!-- 订单内容 start -->
    <div class="order_cont bgeeeeee" v-if="orderdetail">
      <!-- 订单详情 start -->
      <order-desc
              :orderdetail="orderdetail"
              :goodsList="goodsList"></order-desc>
      <!-- 订单详情 end -->
      <!-- 支付信息 start -->
      <div class="order_section bgffffff">
        <div class="paydesc">
          <div class="font24">商品金额</div>
          <div class="font24 color666666">￥{{((orderdetail.shouldmoney - orderdetail.freight) || 0).toFixed(2)}}</div>
        </div>
        <div class="paydesc">
          <div class="font24">服务费</div>
          <div class="font24 color666666">+￥{{(orderdetail.freight || 0).toFixed(2)}}</div>
        </div>
        <div class="paydesc" v-for="(item, index) in orderdetail.PayDetail" :key="index" v-if="item.paymodeid === 5">
          <div class="font24">积分抵扣</div>
          <div class="font24 color666666">-￥{{(item.paymoney || 0).toFixed(2)}}</div>
        </div>
        <div class="paydesc"  v-for="(item, index) in orderdetail.PayDetail" :key="index" v-if="item.paymodeid === 4">
          <div class="font24">优惠券</div>
          <div class="font24 color666666">-￥{{(item.paymoney || 0).toFixed(2)}}</div>
        </div>
        <div class="paydesc"  v-for="(item, index) in orderdetail.PayDetail" :key="index" v-if="item.paymodeid === 10">
          <div class="font24">零钱</div>
          <div class="font24 color666666" v-if="item.paymoney >= 0">-￥{{(item.paymoney || 0).toFixed(2)}}</div>
          <div class="font24 color666666" v-if="item.paymoney < 0">+￥{{(Math.abs(item.paymoney) || 0).toFixed(2)}}</div>
        </div>
        <div class="paydesc">
          <div>订单金额</div>
          <div class="colorf84242 font_blod">￥{{(paymoney || 0).toFixed(2)}}</div>
        </div>
        <div class="item_btn" v-if="orderdetail.payflag || orderdetail.cancelflag || orderdetail.deleflag">
          <div class="pay_btn border_r4 bgff6400 colorffffff borderff6400" v-if="orderdetail.payflag">
            <div @click="againPay">付款</div>
          </div>
          <div class="cancel_btn border_r4 bgffffff color666666 borderc7c7c7" v-if="orderdetail.cancelflag">
            <cancel-btn :tradeno="orderdetail.tradeno"></cancel-btn>
          </div>
          <div class="del_btn border_r4 bgffffff color666666 borderc7c7c7" v-if="orderdetail.deleflag">
            <del-btn :tradeno="orderdetail.tradeno"></del-btn>
          </div>
        </div>
      </div>
      <!-- 支付信息 end -->
    </div>
    <!-- 订单内容 end -->
  </div>
</template>

<script>
import MyHeader from '@/components/common/header/myheader'
import orderDesc from '@/components/common/orderDesc/orderDesc'
import payBtn from '@/components/common/payBtn/payBtn'
import delBtn from '@/components/common/delBtn/delBtn'
import cancelBtn from '@/components/common/cancelBtn/cancelBtn'
import tip from '@/utils/tip'

export default {
  name: 'orderdetail',
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
      paymoney: 0
    }
  },
  computed: {
  },
  components: {
    MyHeader,
    orderDesc,
    payBtn,
    delBtn,
    cancelBtn
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
          self.paymoney = res.data.shouldmoney
          self.goodsList = res.data.OrderDetail
          // 页面加载时计算实付金额
          self.orderdetail.PayDetail.forEach((item) => {
            if (item.paymodeid === 4 || item.paymodeid === 5 || item.paymodeid === 10) {
              self.paymoney -= item.paymoney
            }
          })
        } else {
          tip(res.msg)
        }
      })
    },
    // 再支付
    againPay () {
      let self = this
      self.$router.push({name: 'againPay', query: {tradeno: self.tradeno, group: self.orderdetail.ordertype, groupno: self.orderdetail.groupno}})
    }
  },
  watch: {},
  beforeRouteLeave (to, from, next) {
    let self = this
    let toReg = /orderList/
    let toReg2 = /again/
    if (!toReg.test(to.name) && !toReg2.test(to.name)) {
      self.$store.commit('addExcludeComponent', 'orderList')
    } else if (toReg.test(to.name) || toReg2.test(to.name)) {
      self.$store.commit('removeExcludeComponent', 'orderList')
    }
    next()
  },
  beforeCreate () {
  },
  created () {
    let self = this
    // 页面加载时获取订单详情
    self.getOrderdetail()
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
