<template>
  <div class="container_pt110 bgeeeeee">
    <!-- 头部 start -->
    <my-header @setStartdate="setStartdate" :addFlag="'dateFlag'">
      <template v-slot:backs>
        <i class="el-icon-arrow-left"></i>
      </template>
      <template v-slot:header>订单</template>
    </my-header>
    <!-- 头部 end -->
    <div :class="{orderlist: true, bgffffff: saomaorderList.length, bgeeeeee: !saomaorderList.length}">
      <!-- 加载中动画 start -->
      <loading v-if="isShowLoading"></loading>
      <!-- 下拉刷新动画 end -->
      <!-- 订单列表 start -->
      <div class="order_list" v-if="saomaorderList.length">
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
          <van-list
            v-model="loading"
            :finished="finished"
            :offset="offset"
            finished-text="没有更多了"
            @load="onLoad">
            <router-link :to="{name: 'saomaorderDetail', query:{flowno: item.flowno, deptcode: item.shopCode}}" v-for="(item, index) in saomaorderList" :key="index" tag="div" class="order_item bgffffff">
              <div class="order_item_desc">
                <div class="font32 font_blod">{{item.shopName}}</div>
                <div>订单编号：{{item.flowno}}</div>
                <div class="font24">订单金额：<span class="colorfa2a2a">{{((item.totalMoney) || 0).toFixed(2)}}</span></div>
                <div class="font24 color666666">{{item.saletime}}</div>
              </div>
              <div class="order_item_status">
                <div class="font24 colorf84242">{{item.stausdescribe}}</div>
                <div class="item_btn" v-if="item.payFLag || item.cancelFlag">
                  <div class="pay_btn border_r4 bgff6400 colorffffff borderff6400" v-if="item.payFLag">
                    <router-link
                      :to="{name: 'saomaorder', query: {flowno: item.flowno, deptcode: item.shopCode, deptname: item.shopName}}"
                      tag="div"
                    >付款</router-link>
                  </div>
                  <div class="cancel_btn border_r4 bgffffff color666666 borderc7c7c7" v-if="item.cancelFlag">
                    <saomacancel-btn
                      :flowno="item.flowno"
                      :deptcode="item.shopCode"
                      @onRefresh="onRefresh"
                    ></saomacancel-btn>
                  </div>
                </div>
              </div>
            </router-link>
          </van-list>
        </van-pull-refresh>
      </div>
      <!-- 订单列表 end -->
      <!-- 无信息提示 start -->
      <nodata v-else class="bgeeeeee"></nodata>
      <!-- 无信息提示 end -->
    </div>
  </div>
</template>

<script>
import MyHeader from '@/components/common/header/myheader'
import loading from '@/components/common/loading/loading'
import saomacancelBtn from '@/components/common/saomaBtn/saomacancelBtn'
import nodata from '@/components/common/nodata/nodata'
import tip from '@/utils/Toast'

export default {
  name: 'saomaorderList',
  data () {
    return {
      // 是否处在加载状态
      loading: false,
      // 是否已加载完成
      finished: false,
      // 下拉刷新
      refreshing: false,
      // 滚动条与底部距离小于 offset 时触发load事件
      offset: 100,
      // 订单列表
      saomaorderList: [],
      // 查询时间
      startdate: '',
      // 当前页码
      page: 0,
      // 每页显示条数
      pageSize: 15,
      // 目前总共多少条
      totalSize: '',
      // 目前总共多少页
      totalPages: '',
      // 加载中动画
      isShowLoading: true
    }
  },
  computed: {
    // 查询时间
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
    loading,
    saomacancelBtn,
    nodata
  },
  methods: {
    onLoad () {
      let self = this
      self.page++
      self.getSaomaorderList()
    },
    onRefresh () {
      let self = this
      self.isShowLoading = true
      // 清空列表数据
      self.finished = false
      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      self.loading = true
      self.page = 0
      self.saomaorderList = []
      self.onLoad()
    },
    // 获取订单列表
    getSaomaorderList () {
      let self = this
      let data = {
        startDate: self.date,
        Page: self.page,
        pageSize: self.pageSize
      }
      self.$api.invest.listMicroFlow(data).then(result => {
        let res = result.data
        if (res.code === 200) {
          self.isShowLoading = false
          // 无数据时
          if (!res.data.totalSize) {
            self.finished = true
          }
          if (res.data.retlist && res.data.retlist.length) {
            let currentpage = self.page
            let total = Math.ceil(res.data.totalSize / self.pageSize)
            // 页码不足或者最后一页不足的情况
            if (currentpage >= total || res.data.retlist.length < self.pageSize) {
              self.finished = true
              return false
            }
            if (self.refreshing) { // 刷新
              self.saomaorderList = res.data.retlist
              self.refreshing = false
            } else { // 下一页
              self.saomaorderList.push(...res.data.retlist)
            }
            self.loading = false
          }
        } else {
          tip(res.msg)
        }
      })
    },
    // 设置查询开始时间
    setStartdate (data) {
      let self = this
      self.startdate = data
      self.onRefresh()
    }
  },
  watch: {},
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.$store.commit('removeExcludeComponent', 'saomaorderList')
      next()
    })
  },
  beforeRouteLeave (to, from, next) {
    let self = this
    let reg = /saomaorderDetail/
    let reg2 = /saomaorder/
    if (reg.test(to.name) || reg2.test(to.name)) {
      self.$store.commit('removeExcludeComponent', 'saomaorderList')
    } else {
      self.$store.commit('addExcludeComponent', 'saomaorderList')
    }
    next()
  },
  beforeCreate () {
  },
  created () {
    let self = this
    // 获取订单列表
    self.getSaomaorderList()
  },
  beforeMount () {
  },
  mounted () {
  }
}
</script>

<style scoped>
@import 'static/css/saomagou.css';
</style>
