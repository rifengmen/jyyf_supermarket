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
      this.$confirm('确认删除订单吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.post('api/order/deleteOrder', data).then(result => {
          let res = result.data
          if (res.code === 200) {
            this.$message({
              message: '删除成功！',
              type: 'success'
            })
            if (this.$route.name === 'orderList') {
              this.$emit('getOrderList')
              return false
            }
            this.$router.push({name: 'orderList'})
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        }).catch(error => {
          throw error
        })
      }).catch(() => {
        this.$message({
          type: 'info',
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
