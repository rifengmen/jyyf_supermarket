<template>
    <div class="addorder" @click="addorder">
      <slot></slot>
    </div>
</template>

<script>
export default {
  name: 'addorder',
  props: {
    goodsdetail: {
      type: Boolean,
      default: function () {
        return false
      }
    },
    goodsid: {
      type: Number,
      // require: true,
      default: function () {
        return 0
      }
    },
    amount: {
      type: Number,
      default: function () {
        return 1
      }
    },
    no: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  data () {
    return {
    }
  },
  computed: {
  },
  components: {},
  methods: {
    // 添加购物车
    addorder () {
      if (this.goodsdetail) {
        let data = new FormData()
        let requestData = {
          goodsid: this.goodsid.toString(),
          amount: this.amount
        }
        requestData = JSON.stringify(requestData)
        data.append('requestData', requestData)
        this.$axios.post('api/car/addCar', data).then(result => {
          let res = result.data
          if (res.code === 200) {
            let noList = [res.data.no]
            this.setOrder(noList)
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        }).catch(error => {
          throw error
        })
      } else {
        this.setOrder(this.no)
      }
    },
    // 设置临时订单
    setOrder (no) {
      let data = new FormData()
      let requestData = {
        no: no,
        otc: ''
      }
      requestData = JSON.stringify(requestData)
      data.append('requestData', requestData)
      this.$axios.post('invest/microFlow/buyEnd', data).then(result => {
        let res = result.data
        if (res.code === 200) {
          this.$store.commit('setOrder', res.data)
          this.$router.push({name: 'editorder'})
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      }).catch(error => {
        throw error
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
.addorder {
  width: 100%;
  height: 100%;
}
</style>
