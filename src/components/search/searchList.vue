<template>
  <div class="container bgeeeeee" v-title :data-title="$store.state.userInfo.deptname">
    <!-- 搜索 start -->
    <div class="search_cont">
      <router-link :to="{name: 'search'}" tag="div" class="search border_r6 bgffffff">
        <div class="search_input fl">
          <img src="static/img/search.png" class="fl">
          <input type="text" v-model="keyword" placeholder="请输入您要搜索的商品" class="colorff6400 fl font30"/>
        </div>
      </router-link>
    </div>
    <!-- 搜索 end -->
    <div class="search_list">
      <!-- 加载中动画 start -->
      <loading v-if="isShowLoading"></loading>
      <!-- 加载中动画 end -->
      <!-- 商品列表 start -->
      <div class="goodslist">
        <my-scroll
          :goodsList="goodsList"
          :loadText="loadText"
          @pullingDown="_getShopsList"
          @pullingup="getMoreShopsList">
        </my-scroll>
      </div>
      <!-- 商品列表 end -->
    </div>
    <!-- 底部导航 start -->
    <my-footer></my-footer>
    <!-- 底部导航 end -->
  </div>
</template>

<script>
import MyScroll from '@/components/common/myscroll/myscroll'
import loading from '@/components/common/loading/loading'
import MyFooter from '@/components/common/footer/myfooter'

export default {
  name: 'searchList',
  data () {
    return {
      // 分类编码
      classcode: '',
      // 搜索关键词
      keyword: this.$store.getters.getKeyword,
      // 搜索结果
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
      // 加载中动画
      isShowLoading: true,
      // 加载提示语
      loadText: '加载更多...'
    }
  },
  computed: {
  },
  components: {
    MyScroll,
    loading,
    MyFooter
  },
  methods: {
    // 获取商品列表公共方法
    getGoodsList () {
      this.isShowLoading = true
      let data = new FormData()
      let requestData = {
        classcode: this.classcode,
        page: this.page,
        pageSize: this.pageSize,
        keyword: this.keyword
      }
      requestData = JSON.stringify(requestData)
      data.append('requestData', requestData)
      if (this.keyword) {
        this.$axios.post('api/goods/listGoodsForCategory', data).then(result => {
          let res = result.data
          if (res.code === 200) {
            this.isShowLoading = false
            this.goodsList = res.data.content
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
      }
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
        classcode: this.classcode,
        page: this.page,
        pageSize: this.pageSize,
        keyword: this.keyword
      }
      requestData = JSON.stringify(requestData)
      data.append('requestData', requestData)
      if (currentpage > total) {
        this.loadText = '暂无更多数据'
      } else {
        this.$axios.post('api/goods/listGoodsForCategory', data).then(result => {
          this.$store.commit('setIsPullingUp', true)
          let res = result.data
          if (res.code === 200) {
            this.isShowLoading = false
            this.goodsList.push(...res.data.content)
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
  watch: {
  },
  beforeCreate () {
  },
  created () {
    // 页面加载时获取搜索商品列表
    this.getGoodsList()
  },
  beforeMount () {
  },
  mounted () {
  }
}
</script>

<style scoped>
@import "./static/css/search.css";
.search_list {
  position: relative;
}
</style>
