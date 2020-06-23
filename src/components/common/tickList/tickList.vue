<template>
  <div class="tick_main">
    <!-- 内容部分盒子 start -->
    <div class="userinfo_main bgffffff">
      <div class="tick_cont">
        <!-- 加载中动画 start -->
        <loading v-if="isShowLoading"></loading>
        <!-- 下拉刷新动画 end -->
        <!-- 优惠券列表 start -->
        <div class="tick_main" v-if="tickList.length">
          <ul>
            <li class="tick_item border_r6 colorffffff" v-for="(item, index) in tickList" :key="index">
              <!-- 折抵金额 start -->
              <div class="tick_item_money" @click="editorder(item)">
                <div class="font40 font_blod tc" v-if="item.tickettype === 1">
                  ￥
                  <span class="font80">{{item.usemoney}}</span>
                </div>
                <div class="font40 font_blod tc" v-if="item.tickettype === 2">
                  折
                  <span class="font80">{{item.usemoney * 10}}</span>
                </div>
                <div class="font26 tc">{{item.tickname}}</div>
                <div class="font26 tc">满{{item.minsalemoney}}元使用</div>
              </div>
              <!-- 折抵金额 end -->
              <!-- 时间 start -->
              <div class="tick_item_time">
                <div class="tick_item_desc" @click="editorder(item)">
                  <div class="font22">截止日期</div>
                  <div class="font22">{{item.enddate}}</div>
                  <div class="font22">每月禁用日：{{item.notuseday === '' ? '无' : item.notuseday}}</div>
                  <!--<div class="font22">已领/可领总数：</div>-->
                  <!--<div class="font22">使用说明：</div>-->
                </div>
                <!-- 领取 start -->
                <div class="tick_item_get" v-if="froms === 'index'" @click="getTick(item)">
                  <div class="font34">立</div>
                  <div class="font34">即</div>
                  <div class="font34">领</div>
                  <div class="font34">用</div>
                </div>
                <!-- 领取 end -->
              </div>
              <!-- 时间 end -->
            </li>
          </ul>
        </div>
        <!-- 优惠券列表 end -->
        <!-- 无信息提示 start -->
        <nodata v-else></nodata>
        <!-- 无信息提示 end -->
      </div>
    </div>
    <!-- 内容部分盒子 end -->
  </div>
</template>

<script>
import nodata from '@/components/common/nodata/nodata'
import loading from '@/components/common/loading/loading'

export default {
  name: 'tickList',
  props: {
    // 调用的地方
    froms: {
      type: String,
      default: function () {
        return ''
      }
    },
    // 支付金额 来自填写订单
    payMoney: {
      type: Number,
      default: function () {
        return 0
      }
    },
    // 订单总额 来自填写订单
    Totalmoney: {
      type: Number,
      default: function () {
        return 0
      }
    },
    // 收货地址id 来自填写订单
    addressid: {
      type: Number,
      default: function () {
        return 0
      }
    }
  },
  data () {
    return {
      // 优惠券列表
      tickList: {},
      // 加载中动画
      isShowLoading: true
    }
  },
  computed: {
  },
  components: {
    nodata,
    loading
  },
  methods: {
    // 请求优惠券
    getList (data, url) {
      this.isShowLoading = true
      this.$axios.post(url, data).then(result => {
        let res = result.data
        if (res.code === 200) {
          this.isShowLoading = false
          this.tickList = res.data
        } else {
          this.$toast({
            message: res.msg,
            type: 'fail'
          })
        }
      }).catch(error => {
        throw error
      })
    },
    // 获取优惠券列表
    getTicklist () {
      if (this.froms === 'editorder') { // 来自填写订单
        let data = new FormData()
        let requestData
        requestData = {
          payMoney: this.payMoney,
          Totalmoney: this.Totalmoney,
          addressid: this.addressid,
          // 区分微会员和百货，wemember：微会员；generalMerchandise：百货
          flag: 'wemember'
        }
        requestData = JSON.stringify(requestData)
        data.append('requestData', requestData)
        let url = 'bill/pay/payMoneytick'
        this.getList(data, url)
      } else if (this.froms === 'userinfo') { // 来自会员中心
        let data = new FormData()
        let requestData
        requestData = {
          // 区分微会员和百货，wemember：微会员；generalMerchandise：百货
          flag: 'wemember'
        }
        requestData = JSON.stringify(requestData)
        data.append('requestData', requestData)
        let url = 'mem/member/listCoupon'
        this.getList(data, url)
      } else if (this.froms === 'index') { // 来自首页
        let data = new FormData()
        let requestData
        requestData = {
        }
        requestData = JSON.stringify(requestData)
        data.append('requestData', requestData)
        let url = 'mem/member/listCouponForGet'
        this.getList(data, url)
      }
    },
    // 领取优惠券
    getTick (item) {
      let data = new FormData()
      let requestData
      requestData = {
        tickid: item.tickid
      }
      requestData = JSON.stringify(requestData)
      data.append('requestData', requestData)
      this.$axios.post('mem/member/panicCoupon', data).then(result => {
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
    },
    // 去填写订单
    editorder (tick) {
      if (this.froms === 'editorder') {
        let data = new FormData()
        let requestData
        requestData = {
          payMoney: this.payMoney,
          tick: tick,
          otc: '',
          // 区分微会员和百货，wemember：微会员；generalMerchandise：百货
          flag: 'wemember'
        }
        requestData = JSON.stringify(requestData)
        data.append('requestData', requestData)
        this.$axios.post('invest/microFlow/payTicketCheck', data).then(result => {
          let res = result.data
          if (res.code === 200) {
            tick.dicountMoney = res.data.dicountMoney
            this.$store.commit('setTick', tick)
            this.$emit('setTickListFlag')
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
    }
  },
  watch: {},
  beforeCreate () {
  },
  created () {
    // 获取优惠券列表
    this.getTicklist()
  },
  beforeMount () {
  },
  mounted () {
  }
}
</script>

<style scoped>
@import "static/css/tickList.css";
.userinfo_main {
  position: relative;
}
</style>
