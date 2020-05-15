<template>
    <div class="container bgeeeeee" v-title :data-title="$store.state.userInfo.deptname">
      <!-- 搜索 start -->
      <router-link :to="{name: 'search'}" tag="div" class="search_cont">
        <div class="search border_r6 bgffffff">
          <div class="search_input fl">
            <img src="static/img/search.png" class="fl">
            <input type="text" v-model="keyword" placeholder="请输入您要搜索的商品" class="fl color333333"/>
          </div>
          <!--<div class="search_btn border_r500 font28 tc fr bgff6400 colorffffff">搜索</div>-->
        </div>
      </router-link>
      <!-- 搜索 end -->
      <!-- 分类内容 start -->
      <div class="classify">
        <!-- 分类导航 start -->
        <div class="classify_nav">
          <ul>
            <li :class="{tc: true, active: index === classifyActive, bgffffff:  index === classifyActive}" @click="addActive(index)" v-if="classify.length" v-for="(item, index) in classify" :key="index" :optionvalue="item.optionvalue">{{item.optionname}}</li>
          </ul>
        </div>
        <!-- 分类导航 end -->
        <div class="classify_cont">
          <!-- 加载中动画 start -->
          <loading v-if="isShowLoading"></loading>
          <!-- 加载中动画 end -->
          <!-- 分类列表 start -->
          <div class="classify_list">
            <my-scroll
              :goodsList="goodsList"
              :loadText="loadText"
              @pullingDown="_getGoodsList"
              @pullingup="getMoreGoodsList">
            </my-scroll>
          </div>
          <!-- 分类列表 end -->
        </div>
      </div>
      <!-- 分类内容 send -->
      <!-- 底部导航 start -->
      <my-footer></my-footer>
      <!-- 底部导航 end -->
    </div>
</template>

<script>
import MyFooter from '@/components/common/footer/myfooter'
import MyScroll from '@/components/common/myscroll/myscroll'
import loading from '@/components/common/loading/loading'

export default {
  name: 'classify',
  data () {
    return {
      // 搜索关键字
      keyword: this.$store.getters.getKeyword,
      // 商品分类
      classify: [
        {
          optionname: '推荐',
          optionvalue: '-2',
          optionsearch: null,
          referLabel: null,
          referValue: null,
          classcode: null,
          salercode: null,
          salername: null,
          classname: null
        }
      ],
      // 全部
      all: {
        optionname: '全部',
        optionvalue: '-1',
        optionsearch: null,
        referLabel: null,
        referValue: null,
        classcode: null,
        salercode: null,
        salername: null,
        classname: null
      },
      // 分类选中状态
      classifyActive: 0,
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
    classcode () {
      if (this.classify.length) {
        return this.classify[this.classifyActive].optionvalue
      }
    }
  },
  components: {
    MyFooter,
    MyScroll,
    loading
  },
  methods: {
    // 添加分类选中状态
    addActive (index) {
      this.classifyActive = index
    },
    // 获取商品分类
    getClassify () {
      let data = new FormData()
      let requestData = {}
      requestData = JSON.stringify(requestData)
      data.append('requestData', requestData)
      this.$axios.post('system/globaldata/getCusClassOption2', data).then(result => {
        let res = result.data
        if (res.code === 200) {
          this.classify.push(...res.data, this.all)
        }
      }).catch(error => {
        throw error
      })
      // 页面加载时获取商品列表
      // this.getGoodsList()
    },
    // 获取商品列表公共方法
    getGoodsList () {
      this.isShowLoading = true
      let data = new FormData()
      let requestData = {
        classcode: this.classcode,
        page: this.page,
        pageSize: this.pageSize
      }
      requestData = JSON.stringify(requestData)
      data.append('requestData', requestData)
      this.$axios.post('api/goods/listGoodsForCategory', data).then(result => {
        this.$store.commit('setIsPullingDown', true)
        let res = result.data
        if (res.code === 200) {
          this.isShowLoading = false
          if (res.data.content && res.data.content.length) {
            this.goodsList = res.data.content
          } else {
            this.goodsList = []
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
    _getGoodsList () {
      this.page = this.resetpage
      this.getGoodsList()
    },
    // 上拉加载更多
    getMoreGoodsList () {
      this.page++
      let currentpage = this.page
      let total = Math.ceil(this.totalSize / this.pageSize)
      // console.log(total, '总页数')
      // console.log(currentpage, '当前页码')
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
    classcode (nval, oval) {
      this.page = this.resetpage
      // this.goodsList = []
      // 分类编号变化时获取商品列表
      this.getGoodsList()
    }
  },
  beforeCreate () {
  },
  created () {
    // 页面加载时获取商品列表
    this.getGoodsList()
    // 页面加载时获取商品分类
    this.getClassify()
  },
  beforeMount () {
  },
  mounted () {
  }
}
</script>

<style scoped>
@import "static/css/classify.css";
.classify_cont {
  position: relative;
}
</style>
