<template>
  <div class="container bgeeeeee">
    <!-- 头部 start -->
    <my-header @setStartdate="setStartdate" :addFlag="'dateFlag'">
      <template v-slot:backs>
        <i class="el-icon-arrow-left"></i>
      </template>
      <template v-slot:header>卡值变化</template>
    </my-header>
    <!-- 头部 end -->
    <!-- 内容部分盒子 start -->
    <div class="userinfo_main bgffffff">
      <!-- card start -->
      <div class="userinfo recharge_card colorffffff bgffffff">
        <div class="font36 colorffffff">可用余额</div>
        <div class="card_desc">
          <div class="font96 font_blod">{{Balancemoney}}</div>
          <div>元</div>
        </div>
      </div>
      <!-- card end -->
      <!-- 卡值列表 start -->
      <div class="score_list">
        <ul v-if="cardMoneyList.length">
          <li class="score_item" v-for="(item, index) in cardMoneyList" :key="index">
            <div>
              <div class="ellipsis">{{item.changeType}}</div>
              <div class="font24 color999999">{{item.Saletime}}</div>
            </div>
            <div class="font32">{{item.Changemoney}}元</div>
          </li>
        </ul>
        <!-- 无信息提示 start -->
        <nodata v-else></nodata>
        <!-- 无信息提示 end -->
      </div>
      <!-- 卡值列表 end -->
    </div>
    <!-- 内容部分盒子 end -->
  </div>
</template>

<script>
import MyHeader from '@/components/common/header/myheader'
import nodata from '@/components/common/nodata/nodata'

export default {
  name: 'cardMoneyList',
  data () {
    return {
      // 卡值记录列表
      cardMoneyList: '',
      // 查询开始时间
      startdate: '',
      // 当前卡值
      Balancemoney: 0
    }
  },
  computed: {
    date () {
      let _this = this
      if (!this.startdate) {
        let dt = new Date()
        dt.setMonth(dt.getMonth() - 6)
        dt = dt.toLocaleString()
        dt = (dt.replace(/\//g, '-')).split(' ')[0]
        _this.startdate = dt
      }
      return this.startdate
    }
  },
  components: {
    MyHeader,
    nodata
  },
  methods: {
    // 获取积分记录列表
    getCardMoneyList () {
      let data = new FormData()
      let requestData
      requestData = {
        memcode: this.$store.state.userInfo.memcode,
        startdate: this.date
      }
      requestData = JSON.stringify(requestData)
      data.append('requestData', requestData)
      this.$axios.post('mem/card/listMoneyCardDtl', data).then(result => {
        let res = result.data
        if (res.code === 200) {
          this.cardMoneyList = res.data.dataList
          this.Balancemoney = res.data.Balancemoney
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
    // 设置查询开始时间
    setStartdate (data) {
      this.startdate = data
      this.getCardMoneyList()
    }
  },
  watch: {},
  beforeCreate () {
  },
  created () {
    // 获取积分记录列表
    this.getCardMoneyList()
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
