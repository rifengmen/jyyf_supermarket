<template>
  <div class="container bgeeeeee">
    <!-- 头部 start -->
    <my-header @setStartdate="setStartdate" :addFlag="'dateFlag'">
      <template v-slot:backs>
        <i class="el-icon-arrow-left"></i>
      </template>
      <template v-slot:header>零钱变化</template>
    </my-header>
    <!-- 头部 end -->
    <!-- 内容部分盒子 start -->
    <div class="userinfo_main bgffffff">
      <!-- card start -->
      <div class="card1 card_card colorffffff bgffffff">
        <div class="font36 colorffffff">可用零钱</div>
        <div class="card_desc">
          <div class="font96 font_blod">{{smallMoney}}</div>
          <div>元</div>
        </div>
      </div>
      <!-- card end -->
      <div class="score_cont">
        <!-- 加载中动画 start -->
        <loading v-if="isShowLoading"></loading>
        <!-- 下拉刷新动画 end -->
        <!-- 零钱列表 start -->
        <div class="score_list">
          <ul v-if="looseChangeList.length">
            <li class="score_item" v-for="(item, index) in looseChangeList" :key="index">
              <div>
                <div class="ellipsis">{{item.changetype}}</div>
                <div class="font24 color999999">{{item.saletime}}</div>
              </div>
              <div class="font32">{{item.Score}}元</div>
            </li>
          </ul>
          <!-- 无信息提示 start -->
          <nodata v-else></nodata>
          <!-- 无信息提示 end -->
        </div>
        <!-- 零钱列表 end -->
      </div>
    </div>
    <!-- 内容部分盒子 end -->
  </div>
</template>

<script>
import MyHeader from '@/components/common/header/myheader'
import nodata from '@/components/common/nodata/nodata'
import loading from '@/components/common/loading/loading'

export default {
  name: 'scoreList',
  data () {
    return {
      // 零钱记录列表
      looseChangeList: '',
      // 查询开始时间
      startdate: '',
      // 当前零钱
      smallMoney: 0,
      // 加载中动画
      isShowLoading: true
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
    nodata,
    loading
  },
  methods: {
    // 获取积分记录列表
    getLooseChangeList () {
      this.isShowLoading = true
      let data = new FormData()
      let requestData
      requestData = {
        memcode: this.$store.state.userInfo.memcode,
        startdate: this.date
      }
      requestData = JSON.stringify(requestData)
      data.append('requestData', requestData)
      this.$axios.post('mem/card/listSmallMoneyDtl', data).then(result => {
        let res = result.data
        if (res.code === 200) {
          this.isShowLoading = false
          this.looseChangeList = res.data.dataList
          this.smallMoney = res.data.smallMoney
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
    // 设置查询开始时间
    setStartdate (data) {
      this.startdate = data
      this.getLooseChangeList()
    }
  },
  watch: {},
  beforeCreate () {
  },
  created () {
    // 获取积分记录列表
    this.getLooseChangeList()
  },
  beforeMount () {
  },
  mounted () {
  }
}
</script>

<style scoped>
@import "static/css/userInfo.css";
.score_cont {
  position: relative;
}
</style>
