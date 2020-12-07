<template>
  <div class="container_pt110 bgeeeeee">
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
      <div class="userinfo_cont">
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
    </div>
    <!-- 内容部分盒子 end -->
  </div>
</template>

<script>
import MyHeader from '@/components/common/header/myheader'
import nodata from '@/components/common/nodata/nodata'
import loading from '@/components/common/loading/loading'
import tip from '@/utils/Toast'

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
      let self = this
      if (!self.startdate) {
        let dt = new Date()
        dt.setMonth(dt.getMonth() - 6)
        dt = dt.toLocaleString()
        dt = (dt.replace(/\//g, '-')).split(' ')[0]
        self.startdate = dt
      }
      return self.startdate
    }
  },
  components: {
    MyHeader,
    nodata,
    loading
  },
  methods: {
    // 获取零钱记录列表
    getLooseChangeList () {
      let self = this
      self.isShowLoading = true
      let data = {
        memcode: self.$store.state.userInfo.memcode,
        startdate: self.date
      }
      self.$api.mem.listSmallMoneyDtl(data).then(result => {
        let res = result.data
        if (res.code === 200) {
          self.isShowLoading = false
          self.looseChangeList = res.data.dataList
          self.smallMoney = res.data.smallMoney
        } else {
          tip(res.msg)
        }
      })
    },
    // 设置查询开始时间
    setStartdate (data) {
      let self = this
      self.startdate = data
      self.getLooseChangeList()
    }
  },
  watch: {},
  beforeCreate () {
  },
  created () {
    let self = this
    // 获取积分记录列表
    self.getLooseChangeList()
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
