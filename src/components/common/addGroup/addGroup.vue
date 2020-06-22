<template>
  <div class="addGroup" @click="addGroup">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'addGroup',
  props: {
    // 商品ID
    goodsid: {
      type: Number,
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
    addGroup () {
      let data = new FormData()
      let requestData = {
        goodsid: this.goodsid.toString(),
        amount: this.amount,
        otc: 'group',
        isotc: 'group',
        // 区分微会员和百货，wemember：微会员；generalMerchandise：百货
        flag: 'wemember'
      }
      requestData = JSON.stringify(requestData)
      data.append('requestData', requestData)
      this.$axios.post('invest/microFlow/buyEnd', data).then(result => {
        let res = result.data
        if (res.code === 200) {
          this.$store.commit('setOrder', res.data)
          this.$router.push({name: 'editorder', query: {goodsid: this.goodsid.toString(), group: 1}})
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
  }
}
</script>

<style scoped>
.addGroup {
  width: 100%;
  height: 100%;
}
</style>
