<template>
    <div class="container bgeeeeee" v-title :data-title="$store.state.userInfo.deptname">
      <!-- 获取微信凭证 start -->
      <wechat-config>
      </wechat-config>
      <!-- 获取微信凭证 end -->
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
            <li :class="{tc: true, active: index === classifyActive, bgffffff:  index === classifyActive}" @click="addActive(index)" v-if="classify.length" v-for="(item, index) in classify" :key="index" :optionvalue="item.optionvalue">
              <div>{{item.optionname}}</div>
            </li>
          </ul>
        </div>
        <!-- 分类导航 end -->
        <div class="classify_cont">
          <!-- 加载中动画 start -->
          <loading v-if="isShowLoading"></loading>
          <!-- 加载中动画 end -->
          <!-- 分类列表 start -->
          <div class="goods_list" v-if="goodsList.length">
            <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
              <van-list
                v-model="loading"
                :finished="finished"
                :offset="offset"
                finished-text="没有更多了"
                @load="onLoad">
                <div v-for="(item, index) in goodsList" :key="index" class="goods_li">
                  <div class="goods_item bgffffff ellipsis" @click="goodsdetail(item)">
                    <div class="goods_item_img">
                      <img :src="(item.picture1 ? (imgurl + 'image/' + item.picture1.replace('.', '-zip-300.')) : ('static/img/goods.png'))">
                      <div v-if="item.promotemode !== 0" class="goods_age font24 font_normal colorffffff">{{item.modenote}}</div>
                    </div>
                    <div class="goods_item_cont">
                      <div class="goods_item_name ellipsis font26">{{item.cusgoodsname}}</div>
                      <div class="goods_item_name ellipsis font24 colorfa2a2a">{{item.remark}}</div>
                      <div class="goods_item_editnum">
                        <div class="goods_item_price" v-if="item.promotemode === 0 || item.promotemode === 2 || item.promotemode === 3 || item.promotemode === 8">
                          <div class="font32 font_blod colorf84242">￥{{item.saleprice}}</div>
                        </div>
                        <div class="goods_item_price" v-if="item.promotemode === 1 || item.promotemode === 7">
                          <div class="font32 font_blod colorf84242">￥{{item.promotevalue}}</div>
                          <del class="font26 color999999">￥{{item.saleprice}}</del>
                        </div>
                        <div class="goods_item_price" v-if="item.promotemode === 6">
                          <div class="font32 font_blod colorf84242">￥{{item.groupprice}}</div>
                          <del class="font26 color999999">￥{{item.saleprice}}</del>
                        </div>
                        <div class="goods_item_cart" v-if="item.Promotemode !== 7">
                          <addcart :goodsid="item.goodsid">
                            <img src="static/img/gwc.png">
                          </addcart>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </van-list>
            </van-pull-refresh>
          </div>
          <!-- 分类列表 end -->
          <!-- 无信息提示 start -->
          <nodata v-else></nodata>
          <!-- 无信息提示 end -->
        </div>
      </div>
      <!-- 分类内容 send -->
      <!-- 底部导航 start -->
      <my-footer></my-footer>
      <!-- 底部导航 end -->
    </div>
</template>

<script>
import WechatConfig from '@/components/common/wechatConfig/wechatConfig'
import MyFooter from '@/components/common/footer/myfooter'
import loading from '@/components/common/loading/loading'
import addcart from '@/components/common/addcart/addcart'
import nodata from '@/components/common/nodata/nodata'

export default {
  name: 'classify',
  data () {
    return {
      // 图片路径
      imgurl: this.IMGURL,
      // 是否处在加载状态
      loading: false,
      // 是否已加载完成
      finished: false,
      // 下拉刷新
      refreshing: false,
      // 滚动条与底部距离小于 offset 时触发load事件
      offset: 100,
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
      // 当前页码
      page: 0,
      // 每页显示条数
      pageSize: 10,
      // 目前总共多少条
      totalSize: '',
      // 目前总共多少页
      totalPages: '',
      // 加载中动画
      isShowLoading: true
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
    WechatConfig,
    MyFooter,
    loading,
    addcart,
    nodata
  },
  methods: {
    onLoad () {
      this.page++
      this.getGoodsList()
    },
    onRefresh () {
      this.isShowLoading = true
      // 清空列表数据
      this.finished = false
      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true
      this.page = 0
      this.goodsList = []
      this.onLoad()
    },
    // 获取商品列表公共方法
    getGoodsList () {
      let data = new FormData()
      let requestData = {
        classcode: this.classcode,
        page: this.page,
        pageSize: this.pageSize,
        // 区分微会员和百货，wemember：微会员；generalMerchandise：百货
        flag: 'wemember'
      }
      requestData = JSON.stringify(requestData)
      data.append('requestData', requestData)
      this.$axios.post('api/goods/listGoodsForCategory', data).then(result => {
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
              this.goodsList = res.data.content
              this.refreshing = false
            } else {
              this.goodsList.push(...res.data.content)
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
    // 添加分类选中状态
    addActive (index) {
      this.classifyActive = index
      this.onRefresh()
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
      this.onLoad()
    },
    // 商品详情
    goodsdetail (goodsdetail) {
      this.$store.commit('setGoodsdetail', goodsdetail)
      this.$router.push({name: 'goodsdetail', query: {goodsid: goodsdetail.goodsid}})
    }
  },
  watch: {
  },
  beforeCreate () {
  },
  created () {
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
  overflow: auto;
}
</style>
