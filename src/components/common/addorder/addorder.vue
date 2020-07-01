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
    // 商品详情
    goods: {
      type: Object,
      // require: true,
      default: function () {
        return {}
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
    },
    pay: {
      type: Number,
      default: function () {
        return 0
      }
    },
    bargainno: {
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
  },
  components: {},
  methods: {
    // 添加购物车
    addorder () {
      // goodsdetail 标识是从详情页直接立即购买正常商品
      if (this.goodsdetail && this.goods.promotemode !== 6 && this.goods.promotemode !== 8) {
        let data = new FormData()
        let requestData = {
          goodsid: this.goods.goodsid.toString(),
          amount: this.amount,
          // 区分微会员和百货，wemember：微会员；generalMerchandise：百货
          flag: 'wemember'
        }
        requestData = JSON.stringify(requestData)
        data.append('requestData', requestData)
        this.$axios.post('api/car/addCar', data).then(result => {
          let res = result.data
          if (res.code === 200) {
            let noList = [res.data.no]
            this.setOrder(noList)
          } else {
            this.$toast({
              message: res.msg,
              type: 'fail'
            })
          }
        }).catch(error => {
          throw error
        })
      } else if (this.goodsdetail && this.goods.promotemode === 6) { // 判断拼团的立即购买
        this.setOrder(this.no, 'group')
      } else if (this.goodsdetail && this.goods.promotemode === 8) { // 判断砍价的立即购买
        this.setOrder(this.no, 'hack', this.pay)
      } else {
        this.setOrder(this.no, '')
      }
    },
    // 设置临时订单
    setOrder (no, otc, pay) {
      let requestData = {
        otc: '',
        isotc: '',
        amount: this.amount,
        // 区分微会员和百货，wemember：微会员；generalMerchandise：百货
        flag: 'wemember'
      }
      if (!otc && no) {
        requestData.no = no
      } else if (otc === 'group') { // 拼团的立即购买
        requestData.otc = 'group'
        requestData.isotc = 'otc'
        requestData.goodsid = this.goods.goodsid.toString()
      } else if (otc === 'hack' && pay === 0) { // 砍价的立即购买
        requestData.otc = 'hack'
        requestData.isotc = 'otc'
        requestData.goodsid = this.goods.goodsid.toString()
      } else if (otc === 'hack' && pay === 1) { // 砍价成功的立即购买
        requestData.otc = 'hack'
        requestData.isotc = 'hack'
        requestData.groupno = this.bargainno
        requestData.goodsid = this.goods.goodsid.toString()
      }
      let data = new FormData()
      requestData = JSON.stringify(requestData)
      data.append('requestData', requestData)
      this.$axios.post('invest/microFlow/buyEnd', data).then(result => {
        let res = result.data
        if (res.code === 200) {
          this.$store.commit('setOrder', res.data)
          if (!otc && no) {
            this.$router.push({name: 'editorder'})
          } else if (otc === 'group') {
            this.$router.push({name: 'editorder', query: {goodsid: this.goods.goodsid.toString(), otc: 'group'}})
          } else if (otc === 'hack' && pay === 0) {
            this.$router.push({name: 'editorder', query: {goodsid: this.goods.goodsid.toString(), otc: 'hack'}})
          } else if (otc === 'hack' && pay === 1) {
            this.$router.push({name: 'editorder', query: {goodsid: this.goods.goodsid.toString(), otc: 'hack', groupno: this.bargainno, group: 3}})
          }
        } else {
          this.$toast({
            message: res.msg,
            type: 'fail'
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
