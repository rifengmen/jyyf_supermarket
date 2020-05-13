<template>
  <div class="container bgeeeeee">
    <!-- 头部 start -->
    <my-header :froms="'userinfo'">
      <template v-slot:userinfo>
        <i class="el-icon-arrow-left"></i>
      </template>
      <template v-slot:header>我的订单</template>
    </my-header>
    <!-- 头部 end -->
    <!--&lt;!&ndash; 订单分类 start &ndash;&gt;-->
    <!--<div class="order_nav bgffffff">-->
      <!--<ul>-->
        <!--<li :class="{order_nav_item: true, active: index === orderActive}" @click="addActive(index)" v-if="ordernav.length" v-for="(item, index) in ordernav" :key="index" :optionvalue="item.optionvalue">{{item.optionname}}</li>-->
      <!--</ul>-->
    <!--</div>-->
    <!--&lt;!&ndash; 订单分类 end &ndash;&gt;-->
    <!-- 内容部分盒子 start -->
    <div class="order_main bgffffff">
      <!-- 下拉刷新动画 start -->
      <loading v-if="isShowLoading"></loading>
      <!-- 下拉刷新动画 end -->
      <!-- 订单列表 start -->
      <div class="order_list">
        <my-scroll-order
          :orderList="orderList"
          :loadText="loadText"
          @getOrderList="getOrderList"
          @pullingDown="_getOrderList"
          @pullingup="getMoreOrderList">
        </my-scroll-order>
      </div>
      <!-- 订单列表 end -->
    </div>
    <!-- 内容部分盒子 -->
  </div>
</template>

<script>
import MyHeader from '@/components/common/header/myheader'
import MyScrollOrder from '@/components/common/myscrollOrder/myscrollOrder'
import nodata from '@/components/common/nodata/nodata'
import loading from '@/components/common/loading/loading'

export default {
  name: 'orderList',
  data () {
    return {
      // 订单列表
      orderList: [],
      // 状态列表
      ordernav: [
        {
          optionname: '全部',
          optionvalue: '-1'
        }
      ],
      // 分类选中状态
      orderActive: 0,
      // 重置当前页码
      resetpage: 1,
      // 当前页码
      page: 1,
      // 每页显示条数
      pageSize: 15,
      // 目前总共多少条
      totalSize: '',
      // 目前总共多少页
      totalPages: '',
      // 下拉刷新
      isShowLoading: true,
      // 加载提示语
      loadText: '加载更多...'
    }
  },
  computed: {
    status () {
      if (this.ordernav.length) {
        return this.ordernav[this.orderActive].optionvalue
      }
    }
  },
  components: {
    MyHeader,
    MyScrollOrder,
    nodata,
    loading
  },
  methods: {
    // 获取订单列表
    getOrderList () {
      this.orderList = []
      this.isShowLoading = true
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
          if (res.data.content.length) {
            this.orderList = res.data.content
          } else {
            this.orderList = []
          }
          this.totalSize = res.data.totalSize
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
    // 下拉刷新
    _getOrderList () {
      this.page = this.resetpage
      this.getOrderList()
    },
    // 上拉加载更多
    getMoreOrderList () {
      this.page++
      let currentpage = this.page
      let total = Math.ceil(this.totalSize / this.pageSize)
      let data = new FormData()
      let requestData = {
        status: this.status,
        page: this.page,
        pageSize: this.pageSize
      }
      requestData = JSON.stringify(requestData)
      data.append('requestData', requestData)
      if (currentpage > total) {
        this.loadText = '暂无更多数据'
      } else {
        this.$axios.post('api/order/getOrder', data).then(result => {
          this.$store.commit('setIsPullingUp', true)
          let res = result.data
          if (res.code === 200) {
            this.isShowLoading = false
            this.orderList.push(...res.data.content)
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        }).catch(error => {
          throw error
        })
      }
      this.$store.commit('setIsPullingUp', false)
    }
  },
  watch: {},
  beforeCreate () {
  },
  created () {
    // 页面加载时获取订单列表
    this.getOrderList()
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
