<template>
  <div class="container bgeeeeee">
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
                  <div class="font24">应付：<span class="colorfa2a2a">{{(item.actualmoney + item.freight).toFixed(2)}}</span></div>
                  <div class="font24 color666666">{{item.Recordtime}}</div>
                </div>
                <div class="order_item_status">
                  <div class="font24 colorf84242">{{item.stausdescribe}}</div>
                  <div class="item_btn">
                    <div class="pay_btn border_r4 bgff6400 colorffffff borderff6400" v-if="item.payflag">
                      <div @click="againPay(item.tradeno)">付款</div>
                    </div>
                    <div class="cancel_btn border_r4 bgffffff color666666 borderc7c7c7" v-if="item.cancelflag">
                      <cancel-btn :tradeno="item.tradeno" @onRefresh="onRefresh"></cancel-btn>
                    </div>
                    <div class="del_btn border_r4 bgffffff color666666 borderc7c7c7" v-if="item.deleflag">
                      <del-btn :tradeno="item.tradeno" @onRefresh="onRefresh"></del-btn>
                    </div>
                  </div>
                </div>
              </router-link>
            </van-list>
          </van-pull-refresh>
        </div>
        <!-- 订单列表 end -->
        <!-- 无信息提示 start -->
        <nodata v-else></nodata>
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

export default {
  name: 'orderList',
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
      return this.ordernav.filter(item => item.billstatus === this.orderActive)[0].billstatus
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
      this.orderActive = billstatus
      this.onRefresh()
    },
    onLoad () {
      this.page++
      this.getOrderList()
    },
    onRefresh () {
      this.isShowLoading = true
      // 清空列表数据
      this.finished = false
      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true
      this.page = 0
      this.orderList = []
      this.onLoad()
    },
    // 获取商品列表公共方法
    getOrderList () {
      let data = new FormData()
      let requestData = {
        status: this.status,
        page: this.page,
        pageSize: this.pageSize
      }
      requestData = JSON.stringify(requestData)
      data.append('requestData', requestData)
      this.$axios.post('api/order/getOrder', data).then(result => {
        let res = result.data
        if (res.code === 200) {
          this.isShowLoading = false
          // 无数据时
          if (!res.data.totalSize) {
            this.finished = true
          }
          if (res.data.content && res.data.content.length) {
            let currentpage = this.page
            let total = Math.ceil(res.data.totalSize / this.pageSize)
            // 页码不足或者最后一页不足的情况
            if (currentpage > total || res.data.content.length < this.pageSize) {
              this.finished = true
            }
            // 刷新
            if (this.refreshing) {
              this.orderList = res.data.content
              this.refreshing = false
            } else {
              this.orderList.push(...res.data.content)
            }
            this.loading = false
          }
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
    // 再支付
    againPay (tradeno) {
      window.event.stopPropagation()
      this.$router.push({name: 'againPay', query: {tradeno: tradeno}})
    }
  },
  watch: {},
  beforeCreate () {
  },
  created () {
    this.addActive(this.$route.query.billstatus)
  },
  beforeMount () {
  },
  mounted () {
  }
}
</script>

<style scoped>
@import "static/css/userInfo.css";
.orderlist {
  position: relative;
}
</style>
