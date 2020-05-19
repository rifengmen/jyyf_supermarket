<template>
  <div class="wrapper" ref="myscroll">
    <!-- 商品列表 start -->
    <ul class="goodsList bgeeeeee" v-if="goodsList && goodsList.length">
      <!-- 商品简介 start -->
      <li v-for="(item, index) in goodsList" :key="index" class="goods_li">
        <div class="goods_item bgffffff ellipsis" @click="goodsdetail(item.goodsid)">
          <div class="goods_item_img">
            <img :src="(item.picture1 ? (imgurl + 'image/' + item.picture1.replace('.', '-zip-300.')) : ('static/img/goods.png'))">
            <div v-if="item.promotemode !== 0" class="goods_age font24 font_normal colorffffff">{{item.modenote}}</div>
          </div>
          <div class="goods_item_cont">
            <div class="goods_item_name ellipsis font26">{{item.cusgoodsname}}</div>
            <div class="goods_item_name ellipsis font24 colorfa2a2a">{{item.remark}}</div>
            <div class="goods_item_price" v-if="item.promotemode === 0 || item.promotemode === 2 || item.promotemode === 3 || item.promotemode === 8">
              <div class="font30 font_blod colorf84242">￥{{item.saleprice}}</div>
            </div>
            <div class="goods_item_price" v-if="item.promotemode === 1 || item.promotemode === 7">
              <div class="font30 font_blod colorf84242">￥{{item.promotevalue}}</div>
              <del class="font24 color999999">￥{{item.saleprice}}</del>
            </div>
            <div class="goods_item_price" v-if="item.promotemode === 6">
              <div class="font30 font_blod colorf84242">￥{{item.groupprice}}</div>
              <del class="font24 color999999">￥{{item.saleprice}}</del>
            </div>
            <div class="goods_item_editnum">
              <div class="goods_item_cart" v-if="item.Promotemode !== 7">
                <addcart :goodsid="item.goodsid">
                  <img src="static/img/gwc.png">
                </addcart>
              </div>
            </div>
          </div>
        </div>
      </li>
      <!-- 商品简介 end -->
      <!-- 上拉加载提示 start -->
      <div class="loading tc font22 color999999" v-if="loading">{{loadText}}</div>
      <!-- 上拉加载提示 end -->
    </ul>
    <!-- 商品列表 end -->
    <!-- 无信息提示 start -->
    <nodata v-else></nodata>
    <!-- 无信息提示 end -->
  </div>
</template>

<script>
import BScroll from 'better-scroll'
import nodata from '@/components/common/nodata/nodata'
import addcart from '@/components/common/addcart/addcart'

export default {
  name: 'myscroll',
  props: {
    goodsList: {
      type: Array,
      // require: true,
      default: function () {
        return []
      }
    },
    loadText: {
      type: String,
      default: function () {
        return '加载更多...'
      }
    }
  },
  data () {
    return {
      // 上拉加载提示
      loading: false,
      // 图片路径
      imgurl: this.IMGURL,
      // 促销类型
      Promotemode: this.$store.state.Promotemode
    }
  },
  computed: {
    // 下拉刷新请求开关
    isPullingDown () {
      return this.$store.state.isPullingDown
    },
    // 上拉加载请求开关
    isPullingUp () {
      return this.$store.state.isPullingUp
    }
  },
  components: {
    addcart,
    nodata
  },
  methods: {
    // better-scroll初始化
    initScroll () {
      if (this.$refs.myscroll) {
        this.scroll = new BScroll(this.$refs.myscroll, {
          probeType: 3,
          click: true,
          // 下拉刷新配置项
          pullDownRefresh: {
            threshold: 50,
            stop: 20
          },
          // 上啦加载配置项
          pullUpLoad: {
            threshold: -50
          }
        })
        // 是否触发下拉刷新
        if (this.isPullingDown) {
          this.scroll.on('pullingDown', () => {
            // console.log('下拉')
            this.$store.commit('setIsPullingDown', false)
            this.$emit('pullingDown')
            this.scroll.finishPullDown()
            setTimeout(() => {
              this.scroll.refresh()
            }, 2000)
          })
        }
        // 是否触发上拉加载
        if (this.isPullingUp) {
          this.scroll.on('pullingUp', () => {
            // console.log('上拉')
            this.loading = true
            this.$store.commit('setIsPullingUp', false)
            this.$emit('pullingup')
            this.scroll.finishPullUp()
            setTimeout(() => {
              this.scroll.refresh()
              this.loading = false
            }, 2000)
          })
        }
        // this.scroll.on('pullingUp', () => {
        //   this.loading = true
        //   this.$store.commit('setIsPullingUp', false)
        //   this.$emit('pullingup')
        //   this.scroll.finishPullUp()
        //   setTimeout(() => {
        //     this.scroll.refresh()
        //     this.loading = false
        //   }, 2000)
        // })
      }
    },
    // 商品详情
    goodsdetail (goodsid) {
      this.$store.commit('setGoodsid', goodsid)
      this.$router.push({name: 'goodsdetail', query: {dianpu: this.$store.state.wechatID}})
    }
  },
  watch: {
    // 监听列表变化，重置滚动
    goodsList: {
      handler (nval, oval) {
        this.$nextTick(() => {
          if (oval.length) {
            this.scroll.refresh()
          }
        })
      },
      deep: true
    }
  },
  created () {
    setTimeout(() => {
      this.$nextTick(() => {
        this.initScroll()
      })
    }, 3000)
  }
}
</script>

<style scoped>
  @import "static/css/myscroll.css";

  .loading {
    width: 100%;
    line-height: 0.8rem;
    height: 0.8rem;
    font-size: 0.5rem;
    align-items: center;
  }
</style>
