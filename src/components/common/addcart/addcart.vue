<template>
    <div class="addcart_btn" @click="addcart">
      <slot></slot>
    </div>
</template>

<script>
import tip from '@/utils/tip'

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
        return 0
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
      let self = this
      return self.$store.state.cart
    },
    // 购物车商品数量
    cartnums () {
      let self = this
      return self.$store.state.cartnums
    }
  },
  components: {},
  methods: {
    // 加入购物车
    addcart (e) {
      e.stopPropagation()
      let self = this
      // 校验选择数量/样式
      if (!self.amount) {
        self.$emit('isSetStandard')
        return false
      }
      let data = {
        goodsid: self.goodsid.toString(),
        amount: self.amount,
        // 区分微会员和百货，wemember：微会员；generalMerchandise：百货
        flag: 'wemember'
      }
      self.$api.api.addCar(data).then(result => {
        let res = result.data
        if (res.code === 200) {
          tip('添加成功！')
          // 关闭弹框
          self.$emit('setStandardflag')
          // 获取购物车列表
          self.getCart()
        } else {
          tip(res.msg)
        }
      })
    },
    // 获取购物车商品
    getCart () {
      let self = this
      let data = {
        // 区分微会员和百货，wemember：微会员；generalMerchandise：百货
        flag: 'wemember'
      }
      self.$api.api.getCar(data).then(result => {
        let res = result.data
        if (res.code === 200) {
          self.$store.commit('setCart', res.data)
          if (self.cart.length) {
            let numsList = self.cart.map(item => item.amount)
            let nums = 0
            numsList.forEach(item => {
              nums += parseFloat(item)
            })
            self.$store.commit('setCartnums', nums)
          } else {
            self.$store.commit('setCartnums', 0)
          }
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
    let self = this
    if (self.froms) {
      // 获取购物车商品
      self.getCart()
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
      width: .5rem;
      height: .5rem;
  }
</style>
