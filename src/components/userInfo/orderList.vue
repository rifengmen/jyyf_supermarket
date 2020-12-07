<template>
  <div class="container_pt90 bgeeeeee">
    <!-- 头部 start -->
    <my-header>
      <template v-slot:backs>
        <i class="el-icon-arrow-left"></i>
      </template>
      <template v-slot:header>我的订单</template>
    </my-header>
    <!-- 头部 end -->
    <!-- 内容部分盒子 start -->
    <div class="order_main bgffffff">
      <!-- 订单分类 start -->
      <div class="order_nav bgffffff">
        <ul>
          <li :class="{order_nav_item: true, active: item.billstatus === orderActive, font24: true}" @click="addActive(item.billstatus)" v-if="ordernav.length" v-for="(item, index) in ordernav" :key="index" :optionvalue="item.billstatus">{{item.stausdescribe}}</li>
        </ul>
      </div>
      <!-- 订单分类 end -->
      <div class="orderlist">
        <!-- 加载中动画 start -->
        <loading v-if="isShowLoading"></loading>
        <!-- 下拉刷新动画 end -->
        <!-- 订单列表 start -->
        <div class="order_list" v-if="orderList.length">
          <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
            <van-list
              v-model="loading"
              :finished="finished"
              :offset="offset"
              finished-text="没有更多了"
              @load="onLoad">
              <router-link :to="{name: 'orderdetail', query:{tradeno: item.tradeno}}" v-for="(item, index) in orderList" :key="index" tag="div" class="order_item bgffffff">
                <div class="order_item_desc">
                  <div>订单编号：{{item.tradeno}}</div>
                  <div class="font24">订单金额：<span class="colorfa2a2a">{{((item.actualmoney + item.freight) || 0).toFixed(2)}}</span></div>
                  <div class="font24 color666666">{{item.Recordtime}}</div>
                </div>
                <div class="order_item_status">
                  <div class="font24 colorf84242">{{item.stausdescribe}}</div>
                  <div class="item_btn" v-if="item.payflag || item.cancelflag || item.deleflag">
                    <div class="pay_btn border_r4 bgff6400 colorffffff borderff6400" v-if="item.payflag">
                      <div @click="againPay(item)">付款</div>
                    </div>
                    <div class="cancel_btn border_r4 bgffffff color666666 borderc7c7c7" v-if="item.cancelflag">
                      <cancel-btn :tradeno="item.tradeno" @onRefresh="onRefresh"></cancel-btn>
                    </div>
                    <div class="del_btn border_r4 bgffffff color666666 borderc7c7c7" v-if="item.deleflag">
                      <del-btn :tradeno="item.tradeno" @onRefresh="onRefresh"></del-btn>
                    </div>
                  </div>
                  <div v-else-if="item.pickoutcode" class="font26 colorff6400">取货码：{{item.pickoutcode}}</div>
                </div>
              </router-link>
            </van-list>
          </van-pull-refresh>
        </div>
        <!-- 订单列表 end -->
        <!-- 无信息提示 start -->
        <nodata v-else class=""></nodata>
        <!-- 无信息提示 end -->
      </div>
    </div>
    <!-- 内容部分盒子 -->
  </div>
</template>

<script>
import MyHeader from '@/components/common/header/myheader'
import loading from '@/components/common/loading/loading'
import payBtn from '@/components/common/payBtn/payBtn'
import delBtn from '@/components/common/delBtn/delBtn'
import cancelBtn from '@/components/common/cancelBtn/cancelBtn'
import nodata from '@/components/common/nodata/nodata'
import tip from '@/utils/Toast'

export default {
  name: 'orderList',
  data () {
    return {
      tabactive: '0',
      // 是否处在加载状态
      loading: false,
      // 是否已加载完成
      finished: false,
      // 下拉刷新
      refreshing: false,
      // 滚动条与底部距离小于 offset 时触发load事件
      offset: 100,
      // 订单列表
      orderList: [],
      // 状态列表
      ordernav: [
        {
          stausdescribe: '全部',
          billstatus: '-2'
        },
        {
          stausdescribe: '未完成',
          billstatus: '-1'
        },
        {
          stausdescribe: '未受理',
          billstatus: '0'
        },
        {
          stausdescribe: '待配送',
          billstatus: '10'
        },
        {
          stausdescribe: '配送中',
          billstatus: '11'
        },
        {
          stausdescribe: '已完成',
          billstatus: '12'
        }
      ],
      // 分类选中状态
      orderActive: '',
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
    status () {
      let self = this
      return self.ordernav.filter(item => item.billstatus === self.orderActive)[0].billstatus
    }
  },
  components: {
    MyHeader,
    loading,
    payBtn,
    delBtn,
    cancelBtn,
    nodata
  },
  methods: {
    // 切换订单分类
    addActive (billstatus) {
      let self = this
      self.orderActive = billstatus
      self.onRefresh()
    },
    onLoad () {
      let self = this
      self.page++
      self.getOrderList()
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
      self.orderList = []
      self.onLoad()
    },
    // 获取商品列表公共方法
    getOrderList () {
      let self = this
      let data = {
        status: self.status,
        page: self.page,
        pageSize: self.pageSize,
        // 区分微会员和百货，wemember：微会员；generalMerchandise：百货
        flag: 'wemember'
      }
      self.$api.api.getOrder(data).then(result => {
        let res = result.data
        if (res.code === 200) {
          self.isShowLoading = false
          // 无数据时
          if (!res.data.totalSize) {
            self.finished = true
          }
          if (res.data.content && res.data.content.length) {
            let currentpage = self.page
            let total = Math.ceil(res.data.totalSize / self.pageSize)
            // 页码不足或者最后一页不足的情况
            if (currentpage >= total || res.data.content.length < self.pageSize) {
              self.finished = true
            }
            // 刷新
            if (self.refreshing) {
              self.orderList = res.data.content
              self.refreshing = false
            } else {
              self.orderList.push(...res.data.content)
            }
            self.loading = false
          }
        } else {
          tip(res.msg)
        }
      })
    },
    // 再支付
    againPay (order) {
      let self = this
      window.event.stopPropagation()
      self.$router.push({name: 'againPay', query: {tradeno: order.tradeno, group: order.ordertype, groupno: order.groupno}})
    }
  },
  watch: {},
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.$store.commit('removeExcludeComponent', 'orderList')
      next()
    })
  },
  beforeRouteLeave (to, from, next) {
    let self = this
    let reg = /orderdetail/
    let reg2 = /again/
    if (reg.test(to.name) || reg2.test(to.name)) {
      self.$store.commit('removeExcludeComponent', 'orderList')
    } else {
      self.$store.commit('addExcludeComponent', 'orderList')
    }
    next()
  },
  beforeCreate () {
  },
  created () {
    let self = this
    self.addActive(self.$route.query.billstatus)
  },
  beforeMount () {
  },
  mounted () {
  }
}
</script>

<style scoped>
@import "static/css/userInfo.css";
.order_main {
  min-height: calc(100% - .68rem);
  padding-top: .68rem;
}
.loading {
  height: calc(100vh - 1.58rem);
}
.nodata {
  height: calc(100vh - 1.58rem);
}
</style>
