<template>
  <div class="wrapper" ref="myscroll">
    <!-- 订单列表 start -->
    <ul class="orderList bgeeeeee" v-if="orderList.length">
      <!-- 订单简介 start -->
      <li v-for="(item, index) in orderList" :key="index">
        <div class="order_item bgffffff" @click="orderdetail(item.tradeno)">
          <div class="item_desc">
            <div>订单编号：{{item.tradeno}}</div>
            <div class="font24">应付：<span class="colorfa2a2a">{{(item.actualmoney + item.freight).toFixed(2)}}</span></div>
            <div class="font24 color666666">{{item.Recordtime}}</div>
          </div>
          <div class="item_status">
            <div class="font24 colorf84242">{{item.stausdescribe}}</div>
            <div class="item_btn">
              <div class="pay_btn border_r4 bgff6400 colorffffff borderff6400" v-if="item.payflag">
                <div @click="againPay(item.tradeno)">付款</div>
              </div>
              <div class="cancel_btn border_r4 bgffffff color666666 borderc7c7c7" v-if="item.cancelflag">
                <cancel-btn :tradeno="item.tradeno" @getOrderList="getOrderList"></cancel-btn>
              </div>
              <div class="del_btn border_r4 bgffffff color666666 borderc7c7c7" v-if="item.deleflag">
                <del-btn :tradeno="item.tradeno" @getOrderList="getOrderList"></del-btn>
              </div>
            </div>
          </div>
        </div>
      </li>
      <!-- 订单简介 end -->
      <!-- 上拉加载提示 start -->
      <div class="loading tc font22 color999999" v-if="loading">{{loadText}}</div>
      <!-- 上拉加载提示 end -->
    </ul>
    <!-- 订单列表 end -->
    <!-- 无信息提示 start -->
    <nodata v-else></nodata>
    <!-- 无信息提示 end -->
  </div>
</template>

<script>
import BScroll from 'better-scroll'
import nodata from '@/components/common/nodata/nodata'
import payBtn from '@/components/common/payBtn/payBtn'
import delBtn from '@/components/common/delBtn/delBtn'
import cancelBtn from '@/components/common/cancelBtn/cancelBtn'

export default {
  name: 'myscrollOrder',
  props: {
    orderList: {
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
    nodata,
    payBtn,
    delBtn,
    cancelBtn
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
    },
    // 订单详情
    orderdetail (tradeno) {
      this.$store.commit('setTradeno', tradeno)
      this.$router.push({name: 'orderdetail'})
    },
    // 触发父组件方法
    getOrderList () {
      this.$emit('getOrderList')
    },
    // 再支付
    againPay (tradeno) {
      window.event.stopPropagation()
      this.$router.push({name: 'againPay', params: {tradeno: tradeno}})
    }
  },
  watch: {
    // 监听列表变化，重置滚动
    orderList: {
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
@import 'static/css/myscrollOrder.css';

.loading {
  width: 100%;
  line-height: 0.8rem;
  height: 0.8rem;
  font-size: 0.5rem;
  align-items: center;
}
</style>
