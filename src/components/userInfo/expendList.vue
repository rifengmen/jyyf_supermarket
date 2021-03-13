<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div class="container_pt110 bgeeeeee">
    <!-- 头部 start -->
    <my-header @setStartdate="setStartdate" :addFlag="'dateFlag'">
      <template v-slot:backs>
        <i class="el-icon-arrow-left"></i>
      </template>
      <template v-slot:header>消费记录</template>
    </my-header>
    <!-- 头部 end -->
    <!-- 内容部分盒子 start -->
    <div class="userinfo_main bgffffff">
      <!-- 加载中动画 start -->
      <loading v-if="isShowLoading"></loading>
      <!-- 下拉刷新动画 end -->
      <div class="expend_cont">
        <!-- 零钱列表 start -->
        <div class="score_list" v-if="expendList.length">
          <ul>
            <router-link :to="{name: 'expendDetail', query: {Flowno: item.flowno, Deptcode: item.deptcode, saletime: item.saletime, deptname: item.deptname}}" tag="li" class="score_item" v-for="(item, index) in expendList" :key="index">
              <div>
                <div class="ellipsis">{{item.deptname}}</div>
                <div class="font24 color999999">{{item.saletime}}</div>
              </div>
              <div class="tr">
                <div class="font30">+{{item.Score}}分</div>
                <div class="font30">{{item.Money}}元</div>
              </div>
            </router-link>
          </ul>
        </div>
        <!-- 零钱列表 end -->
        <!-- 无信息提示 start -->
        <nodata v-else class="bgeeeeee"></nodata>
        <!-- 无信息提示 end -->
      </div>
    </div>
    <!-- 内容部分盒子 end -->
  </div>
</template>

<script>
import MyHeader from '@/components/common/header/myheader'
import nodata from '@/components/common/nodata/nodata'
import loading from '@/components/common/loading/loading'
import tip from '@/utils/tip'

export default {
  name: 'expendList',
  data () {
    return {
      // 零钱记录列表
      expendList: '',
      // 查询开始时间
      startdate: '',
      // 加载中动画
      isShowLoading: true
    }
  },
  computed: {
    date () {
      let self = this
      if (!self.startdate) {
        let nowdate = new Date()
        let timelength = 6 * 30 * 24 * 60 * 60 * 1000
        let startdate = new Date(nowdate - timelength).toLocaleString().split('午')[0]
        startdate = startdate.slice(0, startdate.length - 1)
        self.startdate = startdate
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
    // 获取消费记录列表
    getLooseChangeList () {
      let self = this
      self.isShowLoading = true
      let data = {
        memcode: self.$store.state.userInfo.memcode,
        Startday: self.date
      }
      self.$api.mem.listMemberConsum(data).then(result => {
        let res = result.data
        if (res.code === 200) {
          self.isShowLoading = false
          self.expendList = JSON.parse(res.data)
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
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.$store.commit('removeExcludeComponent', 'expendList')
      next()
    })
  },
  beforeRouteLeave (to, from, next) {
    let self = this
    let reg = /expendDetail/
    if (reg.test(to.name)) {
      self.$store.commit('removeExcludeComponent', 'expendList')
    } else {
      self.$store.commit('addExcludeComponent', 'expendList')
    }
    next()
  },
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
.nodata {
  height: calc(100vh - 1.1rem);
}
</style>
