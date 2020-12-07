<template>
  <div class="tick_main">
    <!-- 内容部分盒子 start -->
    <div class="userinfo_main">
      <div class="tick_cont">
        <!-- 加载中动画 start -->
        <loading v-if="isShowLoading"></loading>
        <!-- 下拉刷新动画 end -->
        <!-- 优惠券列表 start -->
        <div class="tick_main" v-if="tickList.length">
          <ul>
            <li class="tick_item border_r20 colorffffff bgfef7ed" v-for="(item, index) in tickList" :key="index" @click="toTicketInfo(index)" :style="{backgroundImage: 'url(' + IMGURL + 'image/' + item.bgurl + ')', backgroundSize: 'cover'}">
              <div :class="{tick_item_head: true, tick_head_bg: (item.bgurl ? false : true)}">
                <div class="tick_item_head_left">
                  <div class="font40 font_blod tc" v-if="item.tickettype !== 2">
                    ￥
                    <span class="font80">{{item.usemoney}}</span>
                  </div>
                  <div class="font40 font_blod tc" v-if="item.tickettype === 2">
                    折
                    <span class="font80">{{item.usemoney * 10}}</span>
                  </div>
                  <div>
                    <div class="font26 tc">{{item.tickname}}</div>
                    <div class="font26 tc">满{{item.minsalemoney}}元使用</div>
                  </div>
                </div>
                <div class="tick_item_head_btn font26 bgf7bb1f border_r500" v-if="froms === 'index'" @click="getTick(item)">立即领取</div>
                <div class="tick_item_head_btn font26 bgf7bb1f border_r500" v-if="froms === 'editorder'" @click="editorder(item)">立即使用</div>
              </div>
              <div class="tick_item_foot color000000">
                <div class="font26 ellipsis">使用规则：{{item.limitname || '无'}}</div>
                <div class="font26 ellipsis">使用时间：{{item.startdate}} —— {{item.enddate}}</div>
              </div>
            </li>
          </ul>
        </div>
        <!-- 优惠券列表 end -->
        <!-- 无信息提示 start -->
        <nodata v-else class="bgeeeeee"></nodata>
        <!-- 无信息提示 end -->
      </div>
    </div>
    <!-- 内容部分盒子 end -->
  </div>
</template>

<script>
import nodata from '@/components/common/nodata/nodata'
import loading from '@/components/common/loading/loading'
import tip from '@/utils/Toast'

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
      // 图片路径
      IMGURL: this.IMGURL,
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
    // 获取优惠券列表
    getTicklist () {
      let self = this
      if (self.froms === 'editorder') { // 来自填写订单
        let data = {
          payMoney: self.payMoney,
          Totalmoney: self.Totalmoney,
          addressid: self.addressid,
          // 区分微会员和百货，wemember：微会员；generalMerchandise：百货
          flag: 'wemember'
        }
        self.$api.bill.payMoneytick(data).then(result => {
          // 设置优惠券列表
          self.setList(result)
        })
      } else if (self.froms === 'userinfo') { // 来自会员中心
        let data = {
          // 区分微会员和百货，wemember：微会员；generalMerchandise：百货
          flag: 'wemember'
        }
        self.$api.mem.listCoupon(data).then(result => {
          // 设置优惠券列表
          self.setList(result)
        })
      } else if (self.froms === 'index') { // 来自首页
        let data = {}
        self.$api.mem.listCouponForGet(data).then(result => {
          // 设置优惠券列表
          self.setList(result)
        })
      }
    },
    // 设置优惠券列表
    setList (result) {
      let self = this
      let res = result.data
      if (res.code === 200) {
        self.isShowLoading = false
        self.tickList = res.data.reverse()
        self.tickList.forEach(item => {
          if (item.dealflagdescription) {
            item.dealflagdescrible = item.dealflagdescription
          }
          if (item.bgurl === '0') {
            item.bgurl = ''
          }
        })
      } else {
        tip(res.msg)
      }
    },
    // 领取优惠券
    getTick (item) {
      let self = this
      // console.log(item)
      // 阻止冒泡
      window.event.stopPropagation()
      let data = {
        tickid: item.tickid
      }
      self.$api.mem.panicCoupon(data).then(result => {
        let res = result.data
        if (res.code === 200) {
          tip(res.msg)
        } else {
          tip(res.msg)
        }
      })
    },
    // 去填写订单
    editorder (tick) {
      let self = this
      if (self.froms === 'editorder') {
        let data = {
          payMoney: self.payMoney,
          tick: tick,
          otc: '',
          // 区分微会员和百货，wemember：微会员；generalMerchandise：百货
          flag: 'wemember'
        }
        self.$api.invest.payTicketCheck(data).then(result => {
          let res = result.data
          if (res.code === 200) {
            tick.dicountMoney = res.data.dicountMoney
            self.$store.commit('setTick', tick)
            self.$emit('setTickListFlag')
          } else {
            tip(res.msg)
          }
        })
      }
    },
    // 跳转优惠券详情
    toTicketInfo (index) {
      let self = this
      // console.log(this.tickList[index].tickid)
      if (self.froms === 'index') {
        self.$router.push({name: 'ticketdetail', query: {tickid: self.tickList[index].tickid}})
      }
    }
  },
  watch: {},
  beforeCreate () {
  },
  created () {
    let self = this
    // 获取优惠券列表
    self.getTicklist()
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
