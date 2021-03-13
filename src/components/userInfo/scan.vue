<template>
  <div class="container_pt110 bgeeeeee">
    <!-- 头部 start -->
    <my-header :froms="'userinfo'">
      <template v-slot:userinfo>
        <i class="el-icon-arrow-left"></i>
      </template>
      <template v-slot:header>{{$route.query.header_tit}}</template>
    </my-header>
    <!-- 头部 end -->
    <!-- 内容部分盒子 start -->
    <div class="order_main bgffffff" :class="{scan_cont: goodsList.length}">
      <!-- 用户资料部分 start -->
      <div class="user_detail">
        <div class="user_section">
          <div>操作人员</div>
          <div class="user_desc bgffffff">
            <input type="text" v-model="userInfo.mobile" class="tr" disabled>
          </div>
        </div>
        <div class="user_section">
          <div>{{$route.query.header_tit}}</div>
          <div class="user_desc bgffffff border_r500">
            <input type="text" v-model="tradeno" class="tr" placeholder="输入订单号、取货码或点击右侧扫描条形码">
            <!-- 扫一扫按钮 start -->
            <div class="scan" @click="scanTradeno">
              <img src="static/img/scan.png">
            </div>
            <!-- 扫一扫按钮 end -->
          </div>
        </div>
      </div>
      <!-- 用户资料部分 end -->
      <!-- 订单详情 start -->
      <order-desc
              v-if="goodsList.length"
              :orderdetail="orderdetail"
              :goodsList="goodsList"></order-desc>
      <!-- 订单详情 end -->
    </div>
    <!-- 内容部分盒子 -->
    <!-- 按钮部分 start -->
    <div class="btn_cont">
      <!-- 确认按钮 start -->
      <div class="btn colorffffff font32 font_normal bgff7e42 border_r6 borderff7e42 tc" @click="confrim">确认</div>
      <!-- 确认按钮 end -->
      <!-- 重置按钮 start -->
      <div class="btn colorff7e42 font32 font_normal bgffffff border_r6 borderff7e42 tc" @click="resetTradeno">重置</div>
      <!-- 重置按钮 end -->
    </div>
    <!-- 按钮部分 end -->
  </div>
</template>

<script>
import MyHeader from '@/components/common/header/myheader'
import orderDesc from '@/components/common/orderDesc/orderDesc'
import wx from 'weixin-js-sdk'
import tip from '@/utils/tip'

export default {
  name: 'scan1',
  data () {
    return {
      // 订单编号
      tradeno: '',
      // 扫一扫调用开关
      scanFlag: true,
      // 订单详情
      orderdetail: '',
      // 订单商品列表
      goodsList: ''
    }
  },
  computed: {
    // 用户信息
    userInfo () {
      let self = this
      return self.$store.state.userInfo
    }
  },
  components: {
    MyHeader,
    orderDesc
  },
  methods: {
    // 确定按钮
    confrim () {
      let self = this
      // 判断订单编号不为空
      if (self.tradeno) {
        // 判断查询订单详情还是修改订单状态
        if (self.goodsList.length) {
          // 修改订单状态
          self.pickOrder()
        } else {
          // 获取订单详情
          self.getOrderdetail()
        }
      }
    },
    // 修改订单状态
    pickOrder () {
      let self = this
      let data = {
        role: self.$route.query.role,
        phone: self.userInfo.mobile,
        tradeno: self.tradeno,
        // 区分微会员和百货，wemember：微会员；generalMerchandise：百货
        flag: 'wemember'
      }
      self.$api.api.pickOrder(data).then(result => {
        let res = result.data
        if (res.code === 200) {
          self.orderdetail = ''
          self.goodsList = []
        }
        tip(res.msg)
      })
    },
    // 重置订单编号
    resetTradeno () {
      let self = this
      self.tradeno = ''
    },
    // 扫一扫
    scanTradeno () {
      let self = this
      self.scanFlag = false
      wx.scanQRCode({
        // 默认为0，扫描结果由微信处理，1则直接返回扫描结果
        needResult: 1,
        scanType: ['barCode'], // 可以指定扫二维码还是一维码，默认二者都有
        desc: 'scanQRCode desc',
        success: function (res) {
          // 扫码后获取结果参数赋值给Input
          let result = res.resultStr
          if (result.indexOf(',') >= 0) {
            let str1 = result.split(',')
            // 订单号码
            self.tradeno = str1[1]
            self.scanFlag = true
            // 获取订单详情
            self.getOrderdetail()
          } else {
            tip('请对准条形码扫码!')
          }
        }
      })
    },
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
    }
  },
  watch: {},
  beforeCreate () {
  },
  created () {
  },
  beforeMount () {
  },
  mounted () {
  }
}
</script>

<style scoped>
@import "./static/css/userInfo.css";
</style>
