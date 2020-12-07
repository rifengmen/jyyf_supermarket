<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div class="container_pt110 bgeeeeee">
    <!-- 头部 start -->
    <my-header>
      <template v-slot:backs>
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
          <div></div>
          <van-radio-group
            direction="horizontal"
            v-model="radio">
            <van-radio
              name="birthday"
              checked-color="#ff6400">
              公历生日
            </van-radio>
            <van-radio
              name="lunarbirthday"
              checked-color="#ff6400">
              农历生日
            </van-radio>
          </van-radio-group>
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
import tip from '@/utils/Toast'

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
      let self = this
      return self.$store.state.headimgurl
    }
  },
  components: {
    MyHeader
  },
  methods: {
    // 获取用户账户资料
    getMyInfo () {
      let self = this
      let data = {}
      self.$api.mem.getMyInfo(data).then(result => {
        let res = result.data
        if (res.code === 200) {
          self.myInfo = res.data
          self.radio = res.data.birthday ? 'birthday' : 'lunarbirthday'
        } else {
          tip(res.msg)
        }
      })
    },
    // 完善资料
    sendMyInfo () {
      let self = this
      let data
      if (self.radio === 'birthday') {
        data = {
          mobile: self.myInfo.mobile,
          memName: self.myInfo.nickname,
          lunarbirthday: '',
          birthday: self.myInfo.birthday
        }
      } else if (self.radio === 'lunarbirthday') {
        data = {
          mobile: self.myInfo.mobile,
          memName: self.myInfo.nickname,
          lunarbirthday: self.myInfo.lunarbirthday,
          birthday: ''
        }
      }
      self.$api.system.modifyname(data).then(result => {
        let res = result.data
        if (res.code === 200) {
          tip('资料修改成功！')
          // 更新用户资料
          self.setUserInfo()
        } else {
          tip(res.msg)
        }
      })
    },
    // 设置用户信息
    setUserInfo () {
      let self = this
      let data = {
        wechatID: self.$store.state.wechatID,
        wexinID: self.$store.state.openid
      }
      self.$api.system.login(data).then(result => {
        let res = result.data
        if (res.code === 200) {
          self.$store.commit('setUserInfo', res.data)
          self.$store.commit('setToken', res.data.token)
          sessionStorage.setItem('jyyf_token', res.data.token)
          self.$axios.defaults.headers.common.Authorization = res.data.token
        }
      })
    }
  },
  watch: {},
  beforeCreate () {
  },
  created () {
    let self = this
    // 获取用户资料
    self.getMyInfo()
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
