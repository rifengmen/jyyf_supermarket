<template>
  <div class="container bgeeeeee" v-title :data-title="$store.state.userInfo.deptname">
    <!-- 头部 start -->
    <my-header>
      <template v-slot:backs>
        <i class="el-icon-arrow-left"></i>
      </template>
      <template v-slot:header>{{recommendName}}</template>
    </my-header>
    <!-- 头部 end -->
    <!-- 内容盒子 start -->
    <div class="recommend_list">
      <!-- 下拉刷新动画 start -->
      <loading v-if="isShowLoading"></loading>
      <!-- 下拉刷新动画 end -->
      <!-- 商品列表 start -->
      <div class="recommendlist">
        <my-scroll
          :goodsList="goodsList"
          :loadText="loadText"
          @pullingDown="_getShopsList"
          @pullingup="getMoreShopsList">
        </my-scroll>
      </div>
      <!-- 商品列表 end -->
    </div>
    <!-- 内容盒子 end -->
  </div>
</template>

<script>
import MyHeader from '@/components/common/header/myheader'
import MyScroll from '@/components/common/myscroll/myscroll'
import loading from '@/components/common/loading/loading'

export default {
  name: 'recommendlist',
  data () {
    return {
      // 搜索关键词
      keyword: this.$store.getters.getKeyword,
      // 推荐商品列表
      goodsList: [],
      // 重置当前页码
      resetpage: 1,
      // 当前页码
      page: 1,
      // 每页显示条数
      pageSize: 10,
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
    // 推荐主题商品id
    recommendid () {
      return this.$store.state.recommendid
    },
    // 推荐主题商品标题
    recommendName () {
      return this.$store.state.recommendName
    }
  },
  components: {
    MyHeader,
    MyScroll,
    loading
  },
  methods: {
    // 获取商品列表公共方法
    getGoodsList () {
      let data = new FormData()
      let requestData = {
        page: this.page,
        pageSize: this.pageSize,
        Id: this.recommendid
      }
      requestData = JSON.stringify(requestData)
      data.append('requestData', requestData)
      this.$axios.post('api/goods/getProductListByCate', data).then(result => {
        let res = result.data
        if (res.code === 200) {
          this.goodsList = res.content
          this.totalSize = res.totalSize
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
    _getShopsList () {
      this.page = this.resetpage
      this.getGoodsList()
    },
    // 上拉加载更多
    getMoreShopsList () {
      this.page++
      let currentpage = this.page
      let total = Math.ceil(this.totalSize / this.pageSize)
      let data = new FormData()
      let requestData = {
        page: this.page,
        pageSize: this.pageSize,
        Id: this.recommendid
      }
      requestData = JSON.stringify(requestData)
      data.append('requestData', requestData)
      if (currentpage > total) {
        this.loadText = '暂无更多数据'
      } else {
        this.$axios.post('api/goods/getProductListByCate', data).then(result => {
          this.$store.commit('setIsPullingUp', true)
          let res = result.data
          if (res.code === 200) {
            this.isShowLoading = false
            this.goodsList.push(...res.content)
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
    // 页面加载时获取推荐商品列表
    this.getGoodsList()
  },
  beforeMount () {
  },
  mounted () {
  }
}
</script>

<style scoped>
@import 'static/css/recommendList.css';
</style>
