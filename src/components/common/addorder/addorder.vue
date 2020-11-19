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
      let data = new FormData()
      // goodsdetail 标识是从详情页直接立即购买正常商品
      if (this.goodsdetail && this.goods.promotemode !== 6 && this.goods.promotemode !== 8 && this.goods.promotemode !== 9) { // 普通商品立即购买
        let requestData = {
          goodsid: this.goods.goodsid.toString(),
          standardid: this.standardid,
          amount: this.amount,
          otc: 'voucher',
          // 区分微会员和百货，wemember：微会员；generalMerchandise：百货
          flag: 'wemember'
        }
        requestData = JSON.stringify(requestData)
        data.append('requestData', requestData)
        this.setOrder(data, 'voucher', 0)
      } else if (this.goodsdetail && this.goods.promotemode === 9) { // 预售商品立即购买
        let requestData = {
          goodsid: this.goods.goodsid.toString(),
          standardid: this.standardid,
          amount: this.amount,
          otc: 'voucher',
          // 区分微会员和百货，wemember：微会员；generalMerchandise：百货
          flag: 'wemember'
        }
        requestData = JSON.stringify(requestData)
        data.append('requestData', requestData)
        this.setOrder(data, 'voucher', 5)
      } else if (this.goodsdetail && this.goods.promotemode === 6) { // 拼团的立即购买
        let requestData = {
          goodsid: this.goods.goodsid.toString(),
          amount: this.amount,
          otc: 'group',
          isotc: 'otc',
          // 区分微会员和百货，wemember：微会员；generalMerchandise：百货
          flag: 'wemember'
        }
        requestData = JSON.stringify(requestData)
        data.append('requestData', requestData)
        this.setOrder(data, 'group')
      } else if (this.goodsdetail && this.goods.promotemode === 8) { // 砍价的立即购买
        let requestData = {
          amount: this.amount,
          goodsid: this.goods.goodsid.toString(),
          otc: 'hack',
          isotc: 'otc',
          // 区分微会员和百货，wemember：微会员；generalMerchandise：百货
          flag: 'wemember'
        }
        let ordertype = ''
        if (this.pay) { // 砍价成功
          requestData.isotc = 'hack'
          requestData.groupno = this.bargainno
          ordertype = 3
        }
        requestData = JSON.stringify(requestData)
        data.append('requestData', requestData)
        this.setOrder(data, 'hack', ordertype)
      } else { // 购物车页面去结算
        let requestData = {
          no: this.no,
          // 区分微会员和百货，wemember：微会员；generalMerchandise：百货
          flag: 'wemember'
        }
        requestData = JSON.stringify(requestData)
        data.append('requestData', requestData)
        this.setOrder(data)
      }
    },
    // 设置临时订单
    setOrder (data, otc, ordertype) {
      this.$axios.post('invest/microFlow/buyEnd', data).then(result => {
        let res = result.data
        if (res.code === 200) {
          let goodsid = (this.goods.goodsid || '').toString()
          this.$store.commit('setOrder', res.data)
          this.$router.push({name: 'editorder', query: {goodsid: goodsid, otc: otc, groupno: this.bargainno, orderType: ordertype}})
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
