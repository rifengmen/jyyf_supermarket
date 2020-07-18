<template>
  <div class="container bgeeeeee">
    <!-- 头部 start -->
    <my-header :froms="'userinfo'">
      <template v-slot:userinfo>
        <i class="el-icon-arrow-left"></i>
      </template>
      <template v-slot:header>{{$route.params.header_tit}}</template>
    </my-header>
    <!-- 头部 end -->
    <!-- 内容部分盒子 start -->
    <div class="order_main bgffffff">
      <!-- 用户资料部分 start -->
      <div class="user_detail">
        <div class="user_section">
          <div>操作人员</div>
          <div class="user_desc bgffffff">
            <input type="text" v-model="userInfo.mobile" class="tr" disabled>
          </div>
        </div>
        <div class="user_section">
          <div></div>
          <div class="user_desc bgffffff border_r500">
            <input type="text" v-model="$route.params.header_tit" class="tr" disabled>
          </div>
        </div>
        <div class="user_section">
          <div></div>
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
      <!-- 按钮部分 start -->
      <div class="btn_box scan_section">
        <!-- 确认按钮 start -->
        <div class="send_btn border_r6 borderff7e42 bgff7e42 colorffffff font32 font_normal" @click="sendTradeno">确认</div>
        <!-- 确认按钮 end -->
        <!-- 重置按钮 start -->
        <div class="send_btn border_r6 borderff7e42 bgffffff colorff7e42 font32 font_normal" @click="resetTradeno">重置</div>
        <!-- 重置按钮 end -->
      </div>
      <!-- 按钮部分 end -->
    </div>
    <!-- 内容部分盒子 -->
  </div>
</template>

<script>
import MyHeader from '@/components/common/header/myheader'
import wx from 'weixin-js-sdk'

export default {
  name: 'scan1',
  data () {
    return {
      // 订单编号
      tradeno: '',
      // 扫一扫调用开关
      scanFlag: true
    }
  },
  computed: {
    // 用户信息
    userInfo () {
      return this.$store.state.userInfo
    }
  },
  components: {
    MyHeader
  },
  methods: {
    // 发送订单编号
    sendTradeno () {
      if (this.tradeno) {
        let data = new FormData()
        let requestData = {
          role: this.$route.params.role,
          phone: this.userInfo.mobile,
          tradeno: this.tradeno,
          // 区分微会员和百货，wemember：微会员；generalMerchandise：百货
          flag: 'wemember'
        }
        requestData = JSON.stringify(requestData)
        data.append('requestData', requestData)
        this.$axios.post('api/order/pickOrder', data).then(result => {
          let res = result.data
          if (res.code === 200) {
            this.$toast({
              message: res.msg,
              type: 'success'
            })
          } else {
            this.$toast({
              message: res.msg,
              type: 'fail'
            })
          }
        }).catch(error => {
          throw error
        })
      }
    },
    // 重置订单编号
    resetTradeno () {
      this.tradeno = ''
    },
    // 扫一扫
    scanTradeno () {
      if (this.scanFlag) {
        this.scanFlag = false
        let _this = this
        wx.scanQRCode({
          // 默认为0，扫描结果由微信处理，1则直接返回扫描结果
          needResult: 1,
          scanType: ['barCode'], // 可以指定扫二维码还是一维码，默认二者都有
          desc: 'scanQRCode desc',
          success: function (res) {
            // 扫码后获取结果参数赋值给Input
            let result = res.resultStr
            if (result.indexOf(',') >= 0) {
              _this.$toast({
                message: '扫描成功!',
                type: 'success'
              })
              let str1 = result.split(',')
              // 订单号码
              _this.tradeno = str1[1]
              _this.scanFlag = true
              _this.sendTradeno()
            } else {
              _this.$toast({
                message: '请对准条形码扫码!',
                type: 'fail'
              })
            }
          }
        })
      }
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
