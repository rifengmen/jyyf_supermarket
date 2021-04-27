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
        <div class="tick_detail_card colorff7e42 bgfef7ed">
          <div class="font_blod tc" v-if="tickettype === 1">
            <span class="font30">￥</span>
            <span class="font80">{{usemoney}}</span>
          </div>
          <div class="font40 font_blod tc" v-if="tickettype === 2">
            <span class="font30">折</span>
            <span class="font80">{{(usemoney * 10).toFixed(2)}}</span>
          </div>
          <div class="tick_item_name">
            <div class="font32 tc" v-if="tickDetail.score">{{tickDetail.score}}积分兑换</div>
            <div class="font26 tc" v-if="tickettype === 1">{{'金额券'}}</div>
            <div class="font26 tc" v-else-if="tickettype === 2">{{'折扣券'}}</div>
            <div class="font26 tc" v-else>{{tickDetail.tickettypename}}</div>
            <div class="font26 tc">满{{minsalemoney}}元使用</div>
          </div>
        </div>
        <!-- 面额 end -->
        <!-- 券信息 start -->
        <div class="tick_detail_info">
          <div class="">
            <div class="font28 font_blod">券码</div>
            <div class="font26 color999999">{{tickid}}</div>
          </div>
          <div class="">
            <div class="font28 font_blod">券名称</div>
            <div class="font26 color999999">{{tickname}}</div>
          </div>
          <div class="">
            <div class="font28 font_blod">使用时间</div>
            <div class="font26 color999999">{{startdate}} —— {{enddate}}</div>
          </div>
          <div class="">
            <div class="font28 font_blod">发行量</div>
            <div class="font26 color999999">{{tickDetail.totalcount || 0}}张</div>
          </div>
          <div class="">
            <div class="font28 font_blod">剩余量</div>
            <div class="font26 color999999">{{tickDetail.residuecount || 0}}张</div>
          </div>
          <div class="">
            <div class="font28 font_blod">使用规则</div>
            <div class="font26 color999999">{{limitname || '无'}}</div>
          </div>
          <div class="">
            <div class="font28 font_blod">使用说明</div>
            <div class="font26 color999999">{{tickDetail.useinstructions || '无'}}</div>
          </div>
        </div>
        <!-- 券信息 end -->
      </div>
    </div>
    <!-- 内容部分盒子 end -->
    <!-- 领用按钮 start -->
    <div class="tick_detail_btn colorffffff font32 border_r10 tc" :class="[tickDetail.residuecount ? 'bgffae43' : 'bgcecece']" v-if="froms === 'index'">
      <panic-tick :tick="tickDetail" :from="'ticketdetail'"></panic-tick>
    </div>
    <!-- 领用按钮 end -->
  </div>
</template>

<script>
import MyHeader from '@/components/common/header/myheader'
import panicTick from '@/components/common/panicTick/panicTick'

export default {
  name: 'ticketdetail',
  data () {
    return {
      // 调用的地方
      froms: '',
      // 优惠券ID
      tickid: '',
      // 面额
      usemoney: '',
      // 券类型
      tickettype: '',
      // 最低消费金额
      minsalemoney: '',
      // 券名称
      tickname: '',
      // 使用规则
      limitname: '',
      // 使用开始时间
      startdate: '',
      // 使用结束时间
      enddate: '',
      // 优惠券详情
      tickDetail: {}
    }
  },
  components: {
    MyHeader,
    panicTick
  },
  methods: {
    // 获取优惠券详情
    getTickDetail () {
      let self = this
      let data = {
        tickid: self.tickid
      }
      self.$api.mem.getCouponDtl(data).then(result => {
        let res = result.data
        if (res.code === 200) {
          let tickDetail = res.data[0]
          let residuecount = tickDetail.totalcount - tickDetail.havepaniccount
          if (residuecount < 0) {
            residuecount = 0
          }
          tickDetail.residuecount = residuecount
          self.tickDetail = tickDetail
        }
      })
    }
  },
  beforeCreate () {
  },
  created () {
    let self = this
    let {query} = self.$route
    self.froms = query.froms
    self.tickid = query.tickid
    self.enddate = query.enddate
    self.limitname = query.limitname
    self.minsalemoney = query.minsalemoney
    self.startdate = query.startdate
    self.tickettype = query.tickettype
    self.tickname = query.tickname
    self.usemoney = query.usemoney
    // 获取优惠券详情
    self.getTickDetail()
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
  padding: 0 .24rem 1.8rem .24rem;
}
.tick_detail_card {
  width: calc(100% - .48rem);
  height: 1.54rem;
  display: flex;
  align-items: center;
  padding: 0.24rem;
  margin: 0.24rem auto;
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
