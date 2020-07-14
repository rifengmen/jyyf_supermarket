<template>
  <div class="container bgeeeeee">
    <!-- 头部 start -->
    <my-header :froms="'userinfo'">
      <template v-slot:userinfo>
        <i class="el-icon-arrow-left"></i>
      </template>
      <template v-slot:header>取货</template>
    </my-header>
    <!-- 内容部分盒子 start -->
    <div class="order_main bgffffff">
      <!-- 用户资料部分 start -->
      <div class="user_detail">
        <div class="user_section">
          <div>操作人员</div>
          <div class="user_desc bgffffff">
            <input type="text" v-model="userInfo.mobile" class="tr" disabled>
          </div>
        </div>
        <div class="user_section">
          <div>取货</div>
          <div class="user_desc bgffffff border_r500">
            <input type="text" value="取货" class="tr" disabled v-if="userInfo.role.indexOf(3) >= 0">
          </div>
        </div>
        <div class="user_section">
          <div></div>
          <div class="user_desc bgffffff border_r500">
            <input type="text" v-model="pickoutcode" class="tr" placeholder="请输入取货码">
          </div>
        </div>
      </div>
      <!-- 用户资料部分 end -->
      <!-- 按钮部分 start -->
      <div class="btn_box scan_section">
        <!-- 确认按钮 start -->
        <div class="send_btn border_r6 borderff7e42 bgff7e42 colorffffff font32 font_normal" @click="sendPickoutcode">确认</div>
        <!-- 确认按钮 end -->
        <!-- 重置按钮 start -->
        <div class="send_btn border_r6 borderff7e42 bgffffff colorff7e42 font32 font_normal" @click="resetPickoutcode">重置</div>
        <!-- 重置按钮 end -->
      </div>
      <!-- 按钮部分 end -->
    </div>
    <!-- 内容部分盒子 -->
  </div>
</template>

<script>
import MyHeader from '@/components/common/header/myheader'

export default {
  name: 'pick',
  data () {
    return {
      // 取货码
      pickoutcode: ''
    }
  },
  computed: {
    // 用户信息
    userInfo () {
      return this.$store.state.userInfo
    }
  },
  components: {
    MyHeader
  },
  methods: {
    // 发送订单编号
    sendPickoutcode () {
      if (this.pickoutcode) {
        let data = new FormData()
        let requestData = {
          role: this.userInfo.role,
          phone: this.userInfo.mobile,
          pickoutcode: this.pickoutcode,
          // 区分微会员和百货，wemember：微会员；generalMerchandise：百货
          flag: 'wemember'
        }
        requestData = JSON.stringify(requestData)
        data.append('requestData', requestData)
        this.$axios.post('api/order/pickOutOrder', data).then(result => {
          let res = result.data
          if (res.code === 200) {
            this.$toast({
              message: '取货成功!',
              type: 'success'
            })
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
    // 重置订单编号
    resetPickoutcode () {
      this.pickoutcode = ''
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
@import "./static/css/userInfo.css";
</style>
