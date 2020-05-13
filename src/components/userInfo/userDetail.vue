<template>
  <div class="container bgeeeeee">
    <!-- 头部 start -->
    <my-header :froms="'userinfo'">
      <template v-slot:userinfo>
        <i class="el-icon-arrow-left"></i>
      </template>
      <template v-slot:header>我的资料</template>
    </my-header>
    <!-- 内容部分盒子 start -->
    <div class="order_main bgffffff">
      <!-- 用户资料部分 start -->
      <div class="user_detail">
        <div class="user_section">
          <div>微信头像</div>
          <div class="user_desc bgffffff">
            <img :src="headimgurl || 'static/img/userimg.png'" class="border_r500">
          </div>
        </div>
        <div class="user_section">
          <div>昵称</div>
          <div class="user_desc bgffffff border_r500">
            <input type="text" v-model="myInfo.nickname" class="tr" placeholder="请输入您的昵称">
          </div>
        </div>
        <div class="user_section">
          <div>手机号</div>
          <div class="user_desc bgffffff border_r500">
            <input type="text" v-model="myInfo.mobile" class="tr" disabled>
          </div>
        </div>
        <div class="user_section">
          <el-radio v-model="radio" label="birthday">公历生日</el-radio>
          <el-radio v-model="radio" label="lunarbirthday">农历生日</el-radio>
        </div>
        <div class="user_section" v-if="radio === 'birthday'">
          <div>公历生日</div>
          <div class="user_desc bgffffff border_r500">
            <input type="text" v-model="myInfo.birthday" placeholder="请输入生日（月日）四位数字" maxLength="4" minLength="4" onkeyup="this.value=this.value.replace(/\D/g,'')" class="tr">
          </div>
        </div>
        <div class="user_section" v-if="radio === 'lunarbirthday'">
          <div>农历生日</div>
          <div class="user_desc bgffffff border_r500">
            <input type="text" v-model="myInfo.lunarbirthday" placeholder="请输入生日（月日）四位数字" maxLength="4" minLength="4" onkeyup="this.value=this.value.replace(/\D/g,'')" class="tr">
          </div>
        </div>
      </div>
      <!-- 用户资料部分 end -->
      <!-- 按钮部分 start -->
      <div class="btn_box section">
        <!-- 注册按钮 start -->
        <div class="send_btn border_r6 bgff7e42 colorffffff font32 font_normal" @click="sendMyInfo">保存资料</div>
        <!-- 注册按钮 end -->
      </div>
      <!-- 按钮部分 end -->
    </div>
    <!-- 内容部分盒子 -->
  </div>
</template>

<script>
import MyHeader from '@/components/common/header/myheader'

export default {
  name: 'userDetail',
  data () {
    return {
      // 用户资料
      myInfo: '',
      // 昵称
      memName: '',
      // 农历生日
      lunarbirthday: '',
      // 公历生日
      birthday: '',
      radio: ''
    }
  },
  computed: {
    // 用户头像
    headimgurl () {
      return this.$store.state.headimgurl
    }
  },
  components: {
    MyHeader
  },
  methods: {
    // 获取用户资料
    getMyInfo () {
      let data = new FormData()
      let requestData = {
      }
      requestData = JSON.stringify(requestData)
      data.append('requestData', requestData)
      this.$axios.post('mem/member/getMyInfo', data).then(result => {
        let res = result.data
        if (res.code === 200) {
          this.myInfo = res.data
          this.radio = res.data.birthday ? 'birthday' : 'lunarbirthday'
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      }).catch(error => {
        throw error
      })
    },
    // 完善资料
    sendMyInfo () {
      let data = new FormData()
      let requestData
      if (this.radio === 'birthday') {
        requestData = {
          mobile: this.myInfo.mobile,
          memName: this.myInfo.nickname,
          lunarbirthday: '',
          birthday: this.myInfo.birthday
        }
      } else if (this.radio === 'lunarbirthday') {
        requestData = {
          mobile: this.myInfo.mobile,
          memName: this.myInfo.nickname,
          lunarbirthday: this.myInfo.lunarbirthday,
          birthday: ''
        }
      }
      requestData = JSON.stringify(requestData)
      data.append('requestData', requestData)
      this.$axios.post('system/customlogin/modifyname', data).then(result => {
        let res = result.data
        if (res.code === 200) {
          this.$message({
            message: '资料修改成功！',
            type: 'success'
          })
          // 更新用户资料
          this.setUserInfo()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      }).catch(error => {
        throw error
      })
    },
    // 设置用户信息
    setUserInfo () {
      let data = new FormData()
      let requestData = {
        wechatID: this.$store.state.wechatID,
        wexinID: this.$store.state.openid
      }
      requestData = JSON.stringify(requestData)
      data.append('requestData', requestData)
      this.$axios.post('system/customlogin/login', data).then(result => {
        let res = result.data
        if (res.code === 200) {
          this.$store.commit('setUserInfo', res.data)
          this.$store.commit('setMoneyDetail', res.data.moneyDetail)
          sessionStorage.setItem('jyyf_token', res.data.token)
          this.$axios.defaults.headers.common.Authorization = res.data.token
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
    // 获取用户资料
    this.getMyInfo()
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
