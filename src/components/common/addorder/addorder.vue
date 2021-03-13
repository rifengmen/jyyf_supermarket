<template>
    <div class="addorder" @click="addorder">
        <slot></slot>
        <div class="" v-if="goods.promotemode === 7">
            <pay-btn
                    ref="paybtn"
                    :amount="amount"></pay-btn>
        </div>
    </div>
</template>

<script>
import payBtn from '@/components/common/payBtn/payBtn'
import tip from '@/utils/tip'

export default {
  name: 'addorder',
  props: {
    // 是否商品详情页面调用，判断是立即购买还是购物车结算
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
    // 单品购买数量
    amount: {
      type: Number,
      default: function () {
        return 0
      }
    },
    // 购物车商品序号
    no: {
      type: Array,
      default: function () {
        return []
      }
    },
    // 砍价是否能够支付标志
    pay: {
      type: Number,
      default: function () {
        return 0
      }
    },
    // 活动号
    groupno: {
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
    // 商品相关订单类型信息
    orderTypeDesc () {
      let self = this
      let orderType = self.$store.state.orderType
      let orderTypeDesc = ''
      orderType.forEach(item => {
        if (item.promotemode === self.goodsdetail.promotemode) {
          orderTypeDesc = item
        }
      })
      return orderTypeDesc
    }

  },
  components: {
    payBtn
  },
  methods: {
    // 添加购物车
    addorder () {
      let self = this
      // 校验选择数量/样式
      if (!self.amount) {
        self.$emit('isSetStandard')
        return false
      }
      // goodsdetail 标识是从详情页直接立即购买正常商品
      if (self.goodsdetail && (self.goods.promotemode < 6 || self.goods.promotemode > 9)) { // 商品详情页立即购买
        let data = {
          goodsid: self.goods.goodsid.toString(),
          standardid: self.standardid,
          amount: self.amount,
          otc: 'voucher',
          // 区分微会员和百货，wemember：微会员；generalMerchandise：百货
          flag: 'wemember'
        }
        self.setOrder(data, 'voucher', 0)
      } else if (self.goodsdetail && self.goods.promotemode === 7) { // 秒杀的立即购买
        // 直接调用秒杀结算
        self.$refs.paybtn.panicPay()
        return false
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
    setOrder (data, otc, orderType) {
      let self = this
      self.$api.invest.buyEnd(data).then(result => {
        let res = result.data
        if (res.code === 200) {
          let goodsid = (self.goods.goodsid || '').toString()
          self.$store.commit('setOrder', res.data)
          self.$router.push({name: 'editorder', query: {goodsid: goodsid, otc: otc, groupno: self.groupno, ordertype: orderType, amount: self.amount}})
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
