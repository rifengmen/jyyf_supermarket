<template>
    <div class="addorder" @click="addorder">
      <slot></slot>
    </div>
</template>

<script>
import tip from '@/utils/Toast'

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
      let self = this
      // goodsdetail 标识是从详情页直接立即购买正常商品
      if (self.goodsdetail && self.goods.promotemode !== 6 && self.goods.promotemode !== 8 && self.goods.promotemode !== 9) { // 普通商品立即购买
        let data = {
          goodsid: self.goods.goodsid.toString(),
          standardid: self.standardid,
          amount: self.amount,
          otc: 'voucher',
          // 区分微会员和百货，wemember：微会员；generalMerchandise：百货
          flag: 'wemember'
        }
        self.setOrder(data, 'voucher', 0)
      } else if (self.goodsdetail && self.goods.promotemode === 9) { // 预售商品立即购买
        let data = {
          goodsid: self.goods.goodsid.toString(),
          standardid: self.standardid,
          amount: self.amount,
          otc: 'voucher',
          // 区分微会员和百货，wemember：微会员；generalMerchandise：百货
          flag: 'wemember'
        }
        self.setOrder(data, 'voucher', 5)
      } else if (self.goodsdetail && self.goods.promotemode === 6) { // 拼团的立即购买
        let data = {
          goodsid: self.goods.goodsid.toString(),
          amount: self.amount,
          otc: 'group',
          isotc: 'otc',
          // 区分微会员和百货，wemember：微会员；generalMerchandise：百货
          flag: 'wemember'
        }
        self.setOrder(data, 'group')
      } else if (self.goodsdetail && self.goods.promotemode === 8) { // 砍价的立即购买
        let data = {
          amount: self.amount,
          goodsid: self.goods.goodsid.toString(),
          otc: 'hack',
          isotc: 'otc',
          // 区分微会员和百货，wemember：微会员；generalMerchandise：百货
          flag: 'wemember'
        }
        let ordertype = ''
        if (self.pay) { // 砍价成功
          data.isotc = 'hack'
          data.groupno = self.bargainno
          ordertype = 3
        }
        self.setOrder(data, 'hack', ordertype)
      } else { // 购物车页面去结算
        let data = {
          no: self.no,
          // 区分微会员和百货，wemember：微会员；generalMerchandise：百货
          flag: 'wemember'
        }
        self.setOrder(data)
      }
    },
    // 设置临时订单
    setOrder (data, otc, ordertype) {
      let self = this
      self.$api.invest.buyEnd(data).then(result => {
        let res = result.data
        if (res.code === 200) {
          let goodsid = (self.goods.goodsid || '').toString()
          self.$store.commit('setOrder', res.data)
          self.$router.push({name: 'editorder', query: {goodsid: goodsid, otc: otc, groupno: self.bargainno, orderType: ordertype}})
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
.addorder {
  width: 100%;
  height: 100%;
}
</style>
