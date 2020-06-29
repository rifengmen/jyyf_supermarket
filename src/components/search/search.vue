<template>
    <div class="container bgeeeeee" v-title :data-title="$store.state.userInfo.deptname">
      <!-- 获取微信凭证 start -->
      <wechat-config>
      </wechat-config>
      <!-- 获取微信凭证 end -->
      <!-- 搜索 start -->
      <div class="search_main">
        <div class="search_cont">
          <!-- 返回 start -->
          <div class="search_backs" @click="backs">
            <i class="el-icon-arrow-left font40"></i>
          </div>
          <!-- 返回 end -->
          <div class="search border_r6 bgffffff">
            <div class="search_input fl">
              <img src="static/img/search.png" class="fl">
              <form action="javascript:return true;" class="search_form">
                <input
                  type="search"
                  v-model="keyword"
                  placeholder="请输入您要搜索的商品"
                  class="colorff6400 fl font30"
                  autofocus="autofocus"
                  @keypress="sendSearch"
                />
              </form>
            </div>
            <!--<div class="search_btn border_r500 font28 tc fr bgff6400 colorffffff" @click="sendSearch">搜索</div>-->
          </div>
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

export default {
  name: 'search',
  data () {
    return {
      // 搜索关键词
      keyword: this.$store.state.keyword
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
      if (event.keyCode === 13) {
        if (!this.keyword) {
          this.$toast({
            message: '请输入搜索内容！',
            type: 'fail'
          })
        }
        let data = new FormData()
        let requestData = {
          keyword: this.keyword,
          // 区分微会员和百货，wemember：微会员；generalMerchandise：百货
          flag: 'wemember'
        }
        requestData = JSON.stringify(requestData)
        data.append('requestData', requestData)
        this.$axios.post('api/goods/searchGoodsRecord', data).then(result => {
          // let res = result.data
          // if (res.code === 200) {
          //   this.$store.commit('setKeyword', this.keyword)
          //   if (this.keyword !== '') {
          //     this.$router.push('/searchList')
          //   }
          // }
        }).catch(error => {
          throw error
        })
        this.$store.commit('setKeyword', this.keyword)
        if (this.keyword !== '') {
          this.$router.push('/searchList')
        }
      }
    },
    // 返回上一页
    backs () {
      this.$router.back()
    }
  },
  watch: {
  },
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
@import "static/css/search.css";
</style>
