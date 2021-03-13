<template>
  <!-- 内容部分盒子 start -->
  <div class="tick_cont">
    <!-- 加载中动画 start -->
    <loading v-if="isShowLoading"></loading>
    <!-- 下拉刷新动画 end -->
    <!-- 优惠券列表 start -->
    <div class="tick_main" v-if="tickList.length">
      <ul class="tick_ul bgeeeeee">
        <li class="tick_item border_r20 colorffffff bgfef7ed" v-for="(item, index) in tickList" :key="index" @click="toTicketInfo(item)" :style="{backgroundImage: 'url(' + IMGURL + 'image/' + item.bgurl + ')', backgroundSize: 'cover'}">
          <div :class="{tick_item_head: true, tick_head_bg: (item.bgurl ? false : true)}">
            <div class="tick_item_head_left">
              <div class="font_blod tc" v-if="item.tickettype !== 2">
                <span class="font30">￥</span>
                <span class="font80">{{item.usemoney}}</span>
              </div>
              <div class="font_blod tc" v-if="item.tickettype === 2">
                <span class="font30">折</span>
                <span class="font80">{{item.usemoney * 10}}</span>
              </div>
              <div class="tick_item_name">
                <div class="font32 tc" v-if="item.score">{{item.score}}积分兑换</div>
                <div class="font26 tc">{{item.tickettypename}}</div>
                <div class="font26 tc">满{{item.minsalemoney}}元使用</div>
              </div>
            </div>
            <div class="tick_item_head_btn font30 bgffffff border_r500" :class="[item.residuecount ? 'colorf58d37' : 'colorcecece']" v-if="froms === 'index'">
              <panic-tick :tick="item" :from="'tickList'"></panic-tick>
            </div>
            <div class="tick_item_head_btn colorf58d37 font30 bgffffff border_r500" v-if="froms === 'editorder'" @click="editorder(item)">立即使用</div>
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
  <!-- 内容部分盒子 end -->
</template>

<script>
import nodata from '@/components/common/nodata/nodata'
import panicTick from '@/components/common/panicTick/panicTick'
import loading from '@/components/common/loading/loading'
import tip from '@/utils/tip'

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
    panicTick,
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
          // 优惠券简介统一字段
          if (item.dealflagdescription) {
            item.dealflagdescrible = item.dealflagdescription
          }
          // 优惠券id统一字段
          if (!item.onlinetickid) {
            item.onlinetickid = item.tickid
          }
          // 优惠券背景图为空时处理
          if (item.bgurl === '0') {
            item.bgurl = ''
          }
          // 设置剩余数量
          let residuecount = item.totalcount - item.havepaniccount
          if (residuecount <= 0) {
            residuecount = 0
          }
          item.residuecount = residuecount
        })
      } else {
        tip(res.msg)
      }
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
    toTicketInfo (tick) {
      let self = this
      if (self.froms === 'editorder') {
        return false
      }
      self.$router.push({name: 'ticketdetail', query: {tickid: tick.onlinetickid, froms: self.froms}})
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
.nodata {
  height: calc(100vh - 1.1rem);
}
</style>
