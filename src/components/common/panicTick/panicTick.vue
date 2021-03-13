<template>
    <div :class="{panic_tick_btn: true, font26: from === 'tickList', font30: from === 'ticketdetail'}" @click.stop="isScore">{{tick.gettype === 2 ? '积分兑换' : '立即领取'}}</div>
</template>

<script>
import tip from '@/utils/tip'

export default {
  /**
   * 组件名称
   */
  name: 'panicTick',

  /**
   * 传入参数
   */
  props: {
    // 调用的父组件
    from: {
      type: String,
      default () {
        return 'tickList'
      }
    },
    // 券信息
    tick: {
      type: Object,
      default () {
        return {}
      }
    }
  },

  /**
   * 组件属性
   */
  data () {
    return {}
  },

  /**
   * 组件计算属性
   */
  computed: {},

  /**
   * 组件子组件
   */
  components: {},

  /**
   * 组件方法
   */
  methods: {
    // 判断是否积分兑换
    isScore () {
      let self = this
      let tick = self.tick
      // 判断积分兑换券
      if (tick.gettype === 2) {
        self.$dialog.confirm({
          message: '确认使用' + tick.score + '积分兑换吗？'
        }).then(() => {
          // 领取优惠券
          self.panicTick()
        }).catch(() => {
          tip('操作已取消')
        })
      } else {
        // 领取优惠券
        self.panicTick()
      }
    },
    // 领取优惠券
    panicTick () {
      let self = this
      let tick = self.tick
      let data = {
        tickid: tick.tickid
      }
      if (!tick.residuecount) {
        tip('此券已领完!')
        return false
      }
      self.$api.mem.panicCoupon(data).then(result => {
        let res = result.data
        if (res.code === 200) {
          tip(res.msg)
        } else {
          tip(res.msg)
        }
      })
    }
  },

  /**
   * 路由进入前
   */
  beforeRouteEnter (to, from, next) {
    next()
  },

  /**
   * 路由离开前
   */
  beforeRouteLeave (to, from, next) {
    next()
  },

  /**
   * 组件创建之前
   */
  beforeCreate () {
  },

  /**
   * 组件创建之后
   */
  created () {
  },

  /**
   * 组件模版编译挂载之前
   */
  beforeMount () {
  },

  /**
   * 组件模版编译挂载之后
   */
  mounted () {
  },

  /**
   * 组件更新之前
   */
  beforeUpdate () {
  },

  /**
   * 组件更新之后
   */
  updated () {
  },

  /**
   * 缓存组件激活时
   */
  activated () {
  },

  /**
   * 缓存组件移除时
   */
  deactivated () {
  },

  /**
   * 组件被销毁之前
   */
  beforeDestroy () {
  },

  /**
   * 组件被销毁之后
   */
  destroyed () {
  }
}
</script>

<style scoped>

</style>
