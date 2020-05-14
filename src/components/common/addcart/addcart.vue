<template>
    <div class="addcart_btn" @click="addcart">
      <slot></slot>
    </div>
</template>

<script>
export default {
  name: 'addcart',
  props: {
    // 商品id
    goodsid: {
      type: Number,
      // require: true,
      default: function () {
        return 0
      }
    },
    // 商品数量
    amount: {
      type: Number,
      default: function () {
        return 1
      }
    },
    // 调用父组件
    froms: {
      type: String,
      default: function () {
        return ''
      }
    }
  },
  data () {
    return {
    }
  },
  computed: {
    // 购物车详情
    cart () {
      return this.$store.state.cart
    },
    // 购物车商品数量
    cartnums () {
      return this.$store.state.cartnums
    }
  },
  components: {},
  methods: {
    // 加入购物车
    addcart (e) {
      e.stopPropagation()
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
          this.$message({
            message: '添加成功！',
            type: 'success'
          })
          this.getCart()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      }).catch(error => {
        throw error
      })
    },
    // 获取购物车商品
    getCart () {
      let data = new FormData()
      let requestData = {}
      requestData = JSON.stringify(requestData)
      data.append('requestData', requestData)
      this.$axios.post('api/car/getCar', data).then(result => {
        let res = result.data
        if (res.code === 200) {
          this.$store.commit('setCart', res.data)
          if (this.cart.length) {
            let numsList = this.cart.map(item => item.amount)
            let nums = 0
            numsList.forEach(item => {
              nums += parseInt(item)
            })
            this.$store.commit('setCartnums', nums)
          } else {
            this.$store.commit('setCartnums', 0)
          }
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
    if (this.froms) {
      // 获取购物车商品
      this.getCart()
    }
  },
  beforeMount () {
  },
  mounted () {
  }
}
</script>

<style scoped>
  .addcart_btn {
    width: 100%;
    height: 100%;
  }
  .addcart_btn img {
    width: 100%;
    height: 100%;
  }
</style>
