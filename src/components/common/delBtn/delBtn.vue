<template>
  <div class="del_btn" @click="del">删除</div>
</template>

<script>
import tip from '@/utils/tip'

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
      let self = this
      e.stopPropagation()
      let data = {
        tradeno: self.tradeno
      }
      self.$dialog.confirm({
        message: '确认删除订单吗？'
      }).then(() => {
        self.$api.api.deleteOrder(data).then(result => {
          let res = result.data
          if (res.code === 200) {
            tip('删除成功！')
            if (self.$route.name === 'orderList') {
              self.$emit('onRefresh')
              return false
            }
            self.$router.back()
          } else {
            tip(res.msg)
          }
        })
      }).catch(() => {
        tip('操作已取消')
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
