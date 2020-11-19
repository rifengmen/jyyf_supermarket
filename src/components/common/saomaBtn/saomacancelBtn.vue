<template>
  <div class="cancel_btn" @click="cancel">取消</div>
</template>

<script>
import tip from '@/utils/Toast'

export default {
  name: 'saomacancelBtn',
  props: {
    flowno: {
      type: String,
      default: function () {
        return ''
      }
    },
    deptcode: {
      type: String,
      default: function () {
        return ''
      }
    }
  },
  data () {
    return {}
  },
  computed: {},
  components: {},
  methods: {
    // 取消
    cancel (e) {
      let self = this
      e.stopPropagation()
      self.$dialog.confirm({
        message: '确认取消订单吗？'
      }).then(() => {
        // 扫码购取消订单
        self.cancelSaleOrder()
      }).catch(() => {
        tip('操作已取消！')
      })
    },
    // 扫码购取消订单
    cancelSaleOrder () {
      let self = this
      let data = {
        flowno: self.flowno,
        deptcode: self.deptcode
      }
      self.$api.invest.cancelSaleOrder(data).then(result => {
        let res = result.data
        if (res.code === 200) {
          tip('取消成功！')
          if (self.$route.name === 'saomaorderList') {
            self.$emit('onRefresh')
            return false
          }
          self.$router.back()
        } else {
          tip(res.msg)
        }
      })
    }
  },
  watch: {},
  beforeCreate () {
  },
  created () {
  },
  beforeMount () {
  },
  mounted () {
  }
}
</script>

<style scoped>

</style>
