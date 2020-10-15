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
        <div class="tick_detail_info">
          <div class="font28 font_blod">券码</div>
          <div class="font26 color999999">{{ticketInfo.tickid}}</div>
          <div class="font28 font_blod">有效期</div>
          <div class="font26 color999999">{{ticketInfo.startdate}}--{{ticketInfo.enddate}}</div>
          <div class="font28 font_blod">使用规则</div>
          <div class="font26 color999999" v-if="ticketInfo.dealflagdescrible">{{ticketInfo.dealflagdescrible}}</div>
          <div class="font26 color999999">使用时间：{{ticketInfo.startdate}}--{{ticketInfo.enddate}}</div>
        </div>
        <div class="tick_detail_btn bgffae43 colorffffff font30 border_r10" @click="getTick">立即领取</div>
      </div>
    </div>
    <!-- 内容部分盒子 end -->
  </div>
</template>

<script>
import MyHeader from '@/components/common/header/myheader'

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
      let data = new FormData()
      let requestData
      requestData = {
        tickid: this.tickid
      }
      requestData = JSON.stringify(requestData)
      data.append('requestData', requestData)
      this.$axios.post('mem/member/getCouponDtl', data).then(result => {
        let res = result.data
        if (res.code === 200) {
          this.ticketInfo = res.data[0]
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
    // 领取优惠券
    getTick () {
      let data = new FormData()
      let requestData
      requestData = {
        tickid: this.tickid
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
          this.$router.back()
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
  beforeCreate () {
  },
  created () {
    // 页面加载时获取优惠券详情
    this.getTicketInfo()
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
  height: 100%;
}
.tick_detail {
  width: calc(100% - 0.48rem);
  display: flex;
  flex-direction: column;
  padding: 0 0.24rem 0 0.24rem;
  margin-bottom: 0.24rem;
}
.tick_detail_card {
  height: 1.54rem;
  display: flex;
  background-color: #FEF7ED;
  align-items: center;
  padding: 0.24rem;
  margin: 0.24rem 0 0.24rem 0;
}
.tick_detail_info {
  display: flex;
  flex-direction: column;
  margin-left: 0.24rem;
}
.tick_detail_info div {
  margin-bottom: 0.24rem;
}
.tick_detail_btn {
  width: calc(100% - 0.48rem);
  height: 0.96rem;
  display: flex;
  justify-content: center;
  align-items: center;
  bottom: 0.48rem;
  position: fixed;
}
</style>
