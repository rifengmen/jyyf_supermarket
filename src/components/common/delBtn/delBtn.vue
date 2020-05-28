<template>
  <div class="del_btn" @click="del">删除</div>
</template>

<script>
export default {
  name: 'delBtn',
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
    // 删除
    del (e) {
      e.stopPropagation()
      let data = new FormData()
      let requestData = {
        tradeno: this.tradeno
      }
      requestData = JSON.stringify(requestData)
      data.append('requestData', requestData)
      this.$dialog.confirm({
        message: '确认删除订单吗？'
      }).then(() => {
        this.$axios.post('api/order/deleteOrder', data).then(result => {
          let res = result.data
          if (res.code === 200) {
            this.$toast({
              message: '删除成功！',
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
  .del_btn {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
