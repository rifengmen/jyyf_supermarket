<template>
  <div class="cancel_btn" @click="cancel">取消</div>
</template>

<script>
import tip from '@/utils/Toast'

export default {
  name: 'cancelBtn',
  props: {
    tradeno: {
      type: String,
      // require: true,
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
      let data = {
        tradeno: self.tradeno
      }
      self.$dialog.confirm({
        message: '确认取消订单吗？'
      }).then(() => {
        self.$api.api.cancleOrder(data).then(result => {
          let res = result.data
          if (res.code === 200) {
            tip('取消成功！')
            if (self.$route.name === 'orderList') {
              self.$emit('onRefresh')
              return false
            }
            self.$router.back()
          } else {
            tip(res.msg)
          }
        })
      }).catch(() => {
        tip('操作已取消')
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
