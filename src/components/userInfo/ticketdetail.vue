<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div class="container_pt110 bgeeeeee">
    <!-- 头部 start -->
    <my-header>
      <template v-slot:backs>
        <i class="el-icon-arrow-left"></i>
      </template>
      <template v-slot:header>电子券详情</template>
    </my-header>
    <!-- 头部 end -->
    <!-- 内容部分盒子 start -->
    <div class="userinfo_main bgffffff">
      <div class="tick_detail">
        <!-- 面额 start -->
        <div class="tick_detail_card colorff7e42">
          <div class="font40 font_blod tc" v-if="ticketInfo.tickettype === 1">
            ￥
            <span class="font80">{{ticketInfo.usemoney}}</span>
          </div>
          <div class="font40 font_blod tc" v-if="ticketInfo.tickettype === 2">
            折
            <span class="font80">{{ticketInfo.usemoney * 10}}</span>
          </div>
          <div>
            <div class="font26 tc">{{ticketInfo.tickname}}</div>
            <div class="font26 tc">满{{ticketInfo.minsalemoney}}元使用</div>
          </div>
        </div>
        <!-- 面额 end -->
        <!-- 券信息 start -->
        <div class="tick_detail_info">
          <div class="">
            <div class="font28 font_blod">券码</div>
            <div class="font26 color999999">{{ticketInfo.tickid}}</div>
          </div>
          <div class="">
            <div class="font28 font_blod">领用时间</div>
            <div class="font26 color999999">{{ticketInfo.panicstart}} —— {{ticketInfo.panicend}}</div>
          </div>
          <div class="">
            <div class="font28 font_blod">使用时间</div>
            <div class="font26 color999999">{{ticketInfo.startdate}} —— {{ticketInfo.enddate}}</div>
          </div>
          <div class="">
            <div class="font28 font_blod">限用名称日期</div>
            <div class="font26 color999999">{{ticketInfo.limitname}}</div>
          </div>
          <div class="">
            <div class="font28 font_blod">使用说明</div>
            <div class="font26 color999999">{{ticketInfo.useinstructions}}</div>
          </div>
        </div>
        <!-- 券信息 end -->
      </div>
    </div>
    <!-- 内容部分盒子 end -->
    <!-- 领用按钮 start -->
    <div class="tick_detail_btn bgffae43 colorffffff font30 border_r10 tc" @click="getTick">立即领取</div>
    <!-- 领用按钮 end -->
  </div>
</template>

<script>
import MyHeader from '@/components/common/header/myheader'
import tip from '@/utils/Toast'

export default {
  name: 'ticketdetail',
  data () {
    return {
      // 优惠券ID
      tickid: this.$route.query.tickid,
      // 优惠券详情
      ticketInfo: {}
    }
  },
  components: {
    MyHeader
  },
  methods: {
    // 获取优惠券详情
    getTicketInfo () {
      let self = this
      let data = {
        tickid: self.tickid
      }
      self.$api.mem.getCouponDtl(data).then(result => {
        let res = result.data
        if (res.code === 200) {
          self.ticketInfo = res.data[0]
        } else {
          tip(res.msg)
        }
      })
    },
    // 领取优惠券
    getTick () {
      let self = this
      let data = {
        tickid: self.tickid
      }
      self.$api.mem.panicCoupon(data).then(result => {
        let res = result.data
        if (res.code === 200) {
          tip(res.msg)
          self.$router.back()
        } else {
          tip(res.msg)
        }
      })
    }
  },
  beforeCreate () {
  },
  created () {
    let self = this
    // 页面加载时获取优惠券详情
    self.getTicketInfo()
  },
  beforeMount () {
  },
  mounted () {
  }
}
</script>

<style scoped>
.userinfo_main{
  width: 100%;
  min-height: 100%;
}
.tick_detail {
  width: calc(100% - 0.48rem);
  display: flex;
  flex-direction: column;
  padding: 0 0.24rem;
  margin-bottom: 1.8rem;
}
.tick_detail_card {
  height: 1.54rem;
  display: flex;
  background-color: #FEF7ED;
  align-items: center;
  padding: 0.24rem;
  margin: 0.24rem 0 0.24rem 0;
}
.tick_detail_info div {
  line-height: 1.5;
  margin-bottom: 0.24rem;
}
.tick_detail_btn {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 0.48rem);
  height: 0.8rem;
  line-height: .8rem;
  margin: .5rem auto;
}
</style>
