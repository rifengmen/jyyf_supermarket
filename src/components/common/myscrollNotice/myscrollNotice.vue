<template>
  <div class="wrapper" ref="myscroll">
    <!-- 商品列表 start -->
    <ul class="messageList bgeeeeee" v-if="noticeList.length">
      <!-- 商品简介 start -->
      <li v-for="(item, index) in noticeList" :key="index">
        <router-link :to="{name: 'noticedetail', params: {id: item.id}}" tag="div" class="message_item bgffffff">
          <div class="bgffae43 border_r500"></div>
          <div class="message_title ellipsis">{{item.title}}</div>
          <div class="font22 color999999">{{item.pubdate}}</div>
        </router-link>
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

export default {
  name: 'myscrollNotice',
  props: {
    noticeList: {
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
      loading: false
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
      }
    }
  },
  watch: {
    // 监听列表变化，重置滚动
    messageList: {
      handler (nval, oval) {
        if (oval.length) {
          this.scroll.refresh()
        }
      },
      deep: true
    }
  },
  beforeCreate () {
  },
  created () {
    setTimeout(() => {
      this.$nextTick(() => {
        this.initScroll()
      })
    }, 3000)
  },
  beforeMount () {
  },
  mounted () {
  }
}
</script>

<style scoped>
@import 'static/css/myscrollNotice.css';

.loading {
  width: 100%;
  line-height: 0.8rem;
  height: 0.8rem;
  font-size: 0.5rem;
  align-items: center;
}
</style>
