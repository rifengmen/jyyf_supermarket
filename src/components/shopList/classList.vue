<template>
  <div class="container_pt110 bgeeeeee" v-title :data-title="$store.state.userInfo.deptname">
    <!-- 头部 start -->
    <my-header>
      <template v-slot:backs>
        <i class="el-icon-arrow-left"></i>
      </template>
      <template v-slot:header>{{classname}}</template>
    </my-header>
    <!-- 头部 end -->
    <!-- 内容盒子 start -->
    <div class="shop_list">
      <!-- 加载中动画 start -->
      <loading v-if="isShowLoading"></loading>
      <!-- 加载中动画 end -->
      <!-- 商品列表 start -->
      <div class="goods_list bgeeeeee" v-if="goodsList.length">
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
          <van-list
            v-model="loading"
            :finished="finished"
            :offset="offset"
            finished-text="没有更多了"
            @load="onLoad">
            <div v-for="(item, index) in goodsList" :key="index" class="goods_li bgffffff">
              <div class="goods_item" @click="goodsdetail(item)">
                <div class="goods_item_img">
                  <img :src="(item.picture1 ? (imgurl + 'image/' + item.picture1.replace('.', '-zip-300.')) : ('static/img/goods.png'))">
                  <div v-if="item.promotemode !== 0" class="goods_age ellipsis font24 font_normal colorffffff">{{item.modenote}}</div>
                </div>
                <div class="goods_item_cont">
                  <div class="goods_item_name ellipsis2 font26">{{item.cusgoodsname}}</div>
                  <div class="goods_item_name ellipsis2 font22 colorfa2a2a">{{item.remark}}</div>
                  <div class="goods_item_editnum">
                    <div class="goods_item_price goods_item_prices">
                      <div class="ellipsis font32 font_blod colorf84242" v-if="item.promotevalue">￥{{item.promotevalue}}</div>
                      <div class="ellipsis font32 font_blod colorf84242" v-else>￥{{item.saleprice}}</div>
                      <del class="ellipsis font26 color999999" v-if="item.promotevalue && item.promotevalue !== item.saleprice">￥{{item.saleprice}}</del>
                    </div>
                    <div class="goods_item_cart" v-if="item.promotemode < 6 || item.promotemode > 9">
                      <addcart
                              :goodsid="item.goodsid"
                              :amount="1">
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
      <!-- 商品列表 end -->
      <!-- 无信息提示 start -->
      <nodata v-else class="bgeeeeee"></nodata>
      <!-- 无信息提示 end -->
    </div>
    <!-- 内容盒子 end -->
  </div>
</template>

<script>
import MyHeader from '@/components/common/header/myheader'
import loading from '@/components/common/loading/loading'
import addcart from '@/components/common/addcart/addcart'
import nodata from '@/components/common/nodata/nodata'
import tip from '@/utils/tip'

export default {
  name: 'classList',
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
      // 推荐商品列表
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
    // 推荐主题商品id
    classcode () {
      let self = this
      return self.$route.query.classcode
    },
    // 推荐主题商品标题
    classname () {
      let self = this
      return self.$route.query.classname
    }
  },
  components: {
    MyHeader,
    loading,
    addcart,
    nodata
  },
  methods: {
    onLoad () {
      let self = this
      self.page++
      self.getGoodsList()
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
      self.goodsList = []
      self.onLoad()
    },
    // 获取商品列表公共方法
    getGoodsList () {
      let self = this
      let data = {
        classcode: self.classcode,
        page: self.page,
        pageSize: self.pageSize,
        // 区分微会员和百货，wemember：微会员；generalMerchandise：百货
        flag: 'wemember'
      }
      self.$api.api.listGoodsForCategory(data).then(result => {
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
              self.goodsList = res.data.content
              self.refreshing = false
            } else {
              self.goodsList.push(...res.data.content)
            }
            self.loading = false
          }
        } else {
          tip(res.msg)
        }
      })
    },
    // 商品详情
    goodsdetail (goodsdetail) {
      let self = this
      self.$store.commit('setGoodsdetail', goodsdetail)
      self.$router.push({name: 'goodsdetail', query: {goodsid: goodsdetail.goodsid, goodsname: goodsdetail.cusgoodsname}})
    }
  },
  watch: {},
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.$store.commit('removeExcludeComponent', 'classList')
      next()
    })
  },
  beforeRouteLeave (to, from, next) {
    let self = this
    let reg = /goodsdetail/
    if (reg.test(to.name)) {
      self.$store.commit('removeExcludeComponent', 'classList')
    } else {
      self.$store.commit('addExcludeComponent', 'classList')
    }
    next()
  },
  beforeCreate () {
  },
  created () {
    let self = this
    self.onLoad()
  },
  beforeMount () {
  },
  mounted () {
  }
}
</script>

<style scoped>
@import 'static/css/shopList.css';
.nodata {
  height: calc(100vh - 1.1rem);
}
</style>
