<template>
  <div class="container register" v-title data-title="欢迎注册">
    <!-- 用户信息 start -->
    <div class="register_cont bgffffff border_r6">
      <div class="font36 font_normal tc color2c2c2c">欢迎注册</div>
      <!-- 手机号 start -->
      <div class="section font28 color333333">
        <div class="section_tit">
          <span>手机号</span>
          <span class="colorf14c4c">*</span>
        </div>
        <div class="section_input">
          <div class="section_inputall border_r6">
            <input type="text" name="mobile" v-model="mobile" placeholder="请输入手机号码">
          </div>
        </div>
      </div>
      <!-- 手机号 end -->
      <!-- 生日 start -->
      <div class="section font28 color333333">
        <div class="section_tit">
          <span>生日</span>
        </div>
        <div class="section_input">
          <div class="section_inputall border_r6">
            <input type="text" name="birthday" v-model="birthday" placeholder="请输入生日（月日）四位数字" maxLength="4" minLength="4" onkeyup="this.value=this.value.replace(/\D/g,'')">
          </div>
        </div>
      </div>
      <!-- 生日 end -->
      <!-- 图形验证码 start -->
      <div class="section font28 color333333">
        <div class="section_tit">
          <span>图形验证码</span>
          <span class="colorf14c4c">*</span>
        </div>
        <div class="section_input">
          <div class="section_input_l border_r6">
            <input type="text" name="mobilecode" v-model="mobilecode">
          </div>
          <div class="section_input_r border_r6 bgffae43" @click="getImgcode">
            <img :src="imgCode">
          </div>
        </div>
      </div>
      <!-- 图形验证码 end -->
      <!-- 短信验证码 start -->
      <div class="section font28 color333333">
        <div class="section_tit">
          <span>短信验证码</span>
          <span class="colorf14c4c">*</span>
        </div>
        <div class="section_input">
          <div class="section_input_l border_r6">
            <input type="text" name="Checkno" v-model="Checkno">
          </div>
          <div class="section_input_r border_r6 tc font_normal colorffffff bgffae43" v-show="msgFlag" @click="sendImgcode">获取验证码</div>
          <div class="section_input_r disabled tc font_normal colorffffff bgd9d9d9" v-show="!msgFlag">剩余{{num}}s</div>
        </div>
      </div>
      <!-- 短信验证码 end -->
      <!-- 按钮部分 start -->
      <div class="btn_box section">
        <!-- 注册按钮 start -->
        <div class="send_btn register_btn border_r6 bgff7e42 colorffffff font32 font_normal" @click="sendRegister">注册</div>
        <!-- 注册按钮 end -->
      </div>
      <!-- 按钮部分 end -->
    </div>
    <!-- 用户信息 end -->
  </div>
</template>

<script>
import tip from '@/utils/Toast'

export default {
  name: 'register',
  data () {
    return {
      // 图片验证token
      token: '',
      // 注册手机号码
      mobile: '',
      // 生日
      birthday: '',
      // 图形验证码
      imgCode: '',
      // 图形验证码号码
      mobilecode: '',
      // 短信验证码发送按钮开关
      msgFlag: true,
      // 短信验证码发送按钮倒计时
      num: 90,
      // 重置时间
      nums: 90,
      // 短信验证码
      Checkno: '',
      // 倒计时
      count: '',
      // 注册按钮开关
      btnFlag: true
    }
  },
  computed: {
    // 验证手机号码格式是否正确
    flag () {
      let self = this
      if (self.mobile && /^(13[0-9]|14[0-9]|15[0-9]|16[0-9]|17[0-9]|18[0-9]|19[0-9])\d{8}$/.test(self.mobile)) {
        return true
      }
      return false
    },
    // msgType
    msgType () {
      let self = this
      let str = self.$route.query.msgType || ''
      if (str && (str.indexOf('=') === str.length - 1)) {
        str = str.substr(0, str.length - 1)
      }
      return str
    },
    // card_id
    card_id () {
      let self = this
      return self.$route.query.card_id || ''
    },
    // encrypt_code
    encrypt_code () {
      let self = this
      let str = self.$route.query.encrypt_code || ''
      return str
    },
    // openid
    openid () {
      let self = this
      return self.$route.query.openid || ''
    },
    // wechatIDget
    wechatIDget () {
      let self = this
      return self.$route.query.dianpu || ''
    }
  },
  methods: {
    // 获取图形验证码
    getImgcode () {
      let self = this
      let data = {}
      self.$api.system.getVerifyCodeGraphic(data).then(result => {
        let res = result.data
        if (res.code === 200) {
          self.imgCode = self.IMGURL + res.data.GraphicFileName
          self.token = res.data.token
        }
      })
    },
    // 发送图片验证码请求短信验证码
    sendImgcode () {
      let self = this
      if (self.mobile === '') {
        tip('请输入手机号码！')
        return false
      }
      if (!self.flag) {
        tip('手机号码格式有误，请重新输入！')
        return false
      }
      if (self.mobilecode === '') {
        tip('请输入图形验证码！')
        return false
      }
      self.count = setInterval(self.countDown, 1000)
      let data = {
        mobile: self.mobile,
        mobilecode: self.mobilecode,
        token: self.token
      }
      self.$api.system.getCheckCode(data).then(result => {
        let res = result.data
        if (res.code === 200) {
          // 关闭发送按钮，开始倒计时
          self.msgFlag = false
          tip('发送验证码成功，请查收短信!')
        } else {
          tip(res.msg)
        }
      })
    },
    // 倒计时
    countDown () {
      let self = this
      let num = self.num
      num--
      self.num = num
      if (self.num === 0) {
        self.msgFlag = true
        self.num = self.nums
        clearInterval(self.count)
      }
    },
    // 发送注册信息
    sendRegister () {
      let self = this
      if (self.mobile === '') {
        tip('请输入手机号码！')
        return false
      }
      if (!self.flag) {
        tip('手机号码格式有误，请重新输入！')
        return false
      }
      if (self.mobilecode === '') {
        tip('请输入图形验证码！')
        return false
      }
      if (self.Checkno === '') {
        tip('请输入短信验证码！')
        return false
      }
      if (self.btnFlag) {
        self.btnFlag = false
        let data = {
          msgType: self.msgType,
          card_id: self.card_id,
          encrypt_code: self.encrypt_code,
          openid: self.openid,
          wechatIDget: self.wechatIDget,
          wechatID: self.$store.state.wechatID,
          wexinID: self.$store.state.openid,
          mobile: self.mobile,
          birthday: self.birthday,
          isMember: 0,
          Checkno: self.Checkno
        }
        self.$api.system.registerAndLogin(data).then(result => {
          self.btnFlag = true
          let res = result.data
          if (res.code === 200) {
            // 卡包执行
            if (self.card_id && self.encrypt_code) {
              tip('激活成功！')
              // 卡包设置用户信息
              self.setUserInfo()
              return false
            }
            tip('注册成功!')
            // 设置用户信息
            self.setUserInfo()
          } else {
            tip(res.msg)
          }
        })
      }
    },
    // 设置用户信息
    setUserInfo () {
      let self = this
      let data = {
        wechatID: self.wechatIDget || self.$store.state.wechatID,
        wexinID: self.$store.state.openid
      }
      self.$api.system.login(data).then(result => {
        let res = result.data
        if (res.code === 200) {
          self.$store.commit('setUserInfo', res.data)
          self.$store.commit('setToken', res.data.token)
          sessionStorage.setItem('jyyf_token', res.data.token)
          self.$axios.defaults.headers.common.Authorization = res.data.token
          if (self.card_id && self.encrypt_code) {
            self.$router.push('/')
          } else {
            let url = sessionStorage.getItem('jyyf_beforeLoginUrl').replace(/"/g, '')
            self.$router.push(url)
          }
        } else {
          tip('登陆失败，请重新登陆！')
        }
      })
    }
    // // 卡包设置用户信息
    // cardSetUserInfo () {
    //   let self = this
    //   let data = {
    //     wechatID: self.wechatIDget,
    //     wexinID: self.openid
    //   }
    //   self.$api.system.login(data).then(result => {
    //     let res = result.data
    //     if (res.code === 200) {
    //       self.$store.commit('setUserInfo', res.data)
    //       self.$store.commit('setToken', res.data.token)
    //       sessionStorage.setItem('jyyf_token', res.data.token)
    //       self.$axios.defaults.headers.common.Authorization = res.data.token
    //       self.$router.push('/')
    //     } else {
    //       tip('登陆失败，请重新登陆！')
    //     }
    //   })
    // }
  },
  created () {
    let self = this
    // 页面加载时获取图形验证码
    self.getImgcode()
  }
}
</script>

<style scoped>
@import "static/css/register.css";
</style>
