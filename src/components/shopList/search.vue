<template>
    <div class="container_pt110 bgeeeeee" v-title :data-title="$store.state.userInfo.deptname">
      <!-- 获取微信凭证 start -->
      <wechat-config>
      </wechat-config>
      <!-- 获取微信凭证 end -->
      <!-- 搜索 start -->
      <div class="search_cont">
        <div class="search">
          <!-- 返回 start -->
          <div class="search_backs" @click="backs">
            <i class="el-icon-arrow-left font40"></i>
          </div>
          <!-- 返回 end -->
          <div class="search_input border_r6 bgffffff fl">
            <img src="static/img/search.png" class="fl">
            <form action="javascript: return true;" class="search_form">
              <input
                ref="searchInput"
                type="search"
                v-model="keyword"
                placeholder="请输入您要搜索的商品"
                class="colorff6400 fl font30"
                @keypress="sendSearch"
              />
            </form>
          </div>
          <!--<div class="search_btn border_r6 font28 tc fr bgff6400 colorffffff" @click="sendSearch">搜索</div>-->
        </div>
      </div>
      <!-- 搜索 end -->
      <!-- 遮罩 start -->
      <div class="search_shade" @click="backs"></div>
      <!-- 遮罩 end -->
    </div>
</template>

<script>
import WechatConfig from '@/components/common/wechatConfig/wechatConfig'
import tip from '@/utils/tip'

export default {
  name: 'search',
  data () {
    return {
      // 搜索关键词
      keyword: ''
    }
  },
  computed: {
  },
  components: {
    WechatConfig
  },
  methods: {
    // 设置搜索关键字
    sendSearch (event) {
      let self = this
      if (event.keyCode === 13) {
        if (!self.keyword) {
          tip('请输入搜索内容！')
        }
        let data = {
          keyword: self.keyword,
          // 区分微会员和百货，wemember：微会员；generalMerchandise：百货
          flag: 'wemember'
        }
        self.$api.api.searchGoodsRecord(data).then(result => {
          let res = result.data
          if (res.code === 200) {
            if (self.keyword !== '') {
              self.$router.push('/searchList?keyword=' + self.keyword)
            }
          } else {
            tip(res.msg)
          }
        })
      }
    },
    // 输入框获取焦点
    setFocus () {
      let self = this
      self.$refs.searchInput.focus()
    },
    // 返回上一页
    backs () {
      let self = this
      self.$router.back()
    }
  },
  watch: {
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.$store.commit('removeExcludeComponent', 'search')
      next()
    })
  },
  beforeRouteLeave (to, from, next) {
    let self = this
    let reg = /searchList/
    if (reg.test(to.name)) {
      self.$store.commit('removeExcludeComponent', 'search')
    } else {
      self.$store.commit('addExcludeComponent', 'search')
    }
    next()
  },
  beforeCreate () {
  },
  created () {
  },
  beforeMount () {
  },
  mounted () {
    let self = this
    // 输入框获取焦点
    self.setFocus()
  }
}
</script>

<style scoped>
@import "static/css/shopList.css";
</style>
