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
        Startday: this.date
      }
      requestData = JSON.stringify(requestData)
      data.append('requestData', requestData)
      this.$axios.post('mem/member/listMemberConsum', data).then(result => {
        let res = result.data
        if (res.code === 200) {
          this.isShowLoading = false
          this.expendList = JSON.parse(res.data)
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
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.$store.commit('removeExcludeComponent', 'expendList')
      next()
    })
  },
  beforeRouteLeave (to, from, next) {
    let reg = /expendDetail/
    if (reg.test(to.name)) {
      this.$store.commit('removeExcludeComponent', 'expendList')
    } else {
      this.$store.commit('addExcludeComponent', 'expendList')
    }
    next()
  },
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
.nodata {
  height: calc(100vh - 1.1rem);
}
</style>
