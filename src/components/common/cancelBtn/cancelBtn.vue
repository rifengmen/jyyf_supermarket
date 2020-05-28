<template>
  <div class="cancel_btn" @click="cancel">取消</div>
</template>

<script>
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
      e.stopPropagation()
      let data = new FormData()
      let requestData = {
        tradeno: this.tradeno
      }
      requestData = JSON.stringify(requestData)
      data.append('requestData', requestData)
      this.$dialog.confirm({
        message: '确认取消订单吗？'
      }).then(() => {
        this.$axios.post('api/order/cancleOrder', data).then(result => {
          let res = result.data
          if (res.code === 200) {
            this.$toast({
              message: '取消成功！',
              type: 'success'
            })
            if (this.$route.name === 'orderList') {
              this.$emit('onRefresh')
              return false
            }
            this.$router.push({name: 'orderList', query: {billstatus: '-2'}})
          } else {
            this.$toast({
              message: res.msg,
              type: 'fail'
            })
          }
        }).catch(error => {
          throw error
        })
      }).catch(() => {
        this.$toast({
          type: 'fail',
          message: '操作已取消'
        })
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
