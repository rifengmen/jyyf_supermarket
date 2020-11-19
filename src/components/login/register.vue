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
      if (this.mobile && /^(13[0-9]|14[0-9]|15[0-9]|16[0-9]|17[0-9]|18[0-9]|19[0-9])\d{8}$/.test(this.mobile)) {
        return true
      }
      return false
    },
    // msgType
    msgType () {
      let str = this.$route.query.msgType || ''
      if (str && (str.indexOf('=') === str.length - 1)) {
        str = str.substr(0, str.length - 1)
      }
      return str
    },
    // card_id
    card_id () {
      return this.$route.query.card_id || ''
    },
    // encrypt_code
    encrypt_code () {
      let str = this.$route.query.encrypt_code || ''
      return str
    },
    // openid
    openid () {
      return this.$route.query.openid || ''
    },
    // wechatIDget
    wechatIDget () {
      return this.$route.query.dianpu || ''
    }
  },
  methods: {
    // 获取图形验证码
    getImgcode () {
      let data = new FormData()
      let requestData = {}
      requestData = JSON.stringify(requestData)
      data.append('requestData', requestData)
      this.$axios.post('system/customlogin/getVerifyCodeGraphic', data).then(result => {
        let res = result.data
        if (res.code === 200) {
          this.imgCode = this.IMGURL + res.data.GraphicFileName
          this.token = res.data.token
        }
      }).catch(error => {
        throw error
      })
    },
    // 发送图片验证码请求短信验证码
    sendImgcode () {
      if (this.mobile === '') {
        this.$toast({
          message: '请输入手机号码！',
          type: 'fail'
        })
        return false
      }
      if (!this.flag) {
        this.$toast({
          message: '手机号码格式有误，请重新输入！',
          type: 'fail'
        })
        return false
      }
      if (this.mobilecode === '') {
        this.$toast({
          message: '请输入图形验证码！',
          type: 'fail'
        })
        return false
      }
      this.count = setInterval(this.countDown, 1000)
      let data = new FormData()
      let requestData = {
        mobile: this.mobile,
        mobilecode: this.mobilecode,
        token: this.token
      }
      requestData = JSON.stringify(requestData)
      data.append('requestData', requestData)
      this.$axios.post('system/customlogin/getCheckCode', data).then(result => {
        let res = result.data
        if (res.code === 200) {
          // 关闭发送按钮，开始倒计时
          this.msgFlag = false
          this.$toast({
            message: '发送验证码成功，请查收短信!',
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
    },
    // 倒计时
    countDown () {
      let num = this.num
      num--
      this.num = num
      if (this.num === 0) {
        this.msgFlag = true
        this.num = this.nums
        clearInterval(this.count)
      }
    },
    // 发送注册信息
    sendRegister () {
      if (this.mobile === '') {
        this.$toast({
          message: '请输入手机号码！',
          type: 'fail'
        })
        return false
      }
      if (!this.flag) {
        this.$toast({
          message: '手机号码格式有误，请重新输入！',
          type: 'fail'
        })
        return false
      }
      if (this.mobilecode === '') {
        this.$toast({
          message: '请输入图形验证码！',
          type: 'fail'
        })
        return false
      }
      if (this.Checkno === '') {
        this.$toast({
          message: '请输入短信验证码！',
          type: 'fail'
        })
        return false
      }
      if (this.btnFlag) {
        this.btnFlag = false
        let data = new FormData()
        let requestData = {
          msgType: this.msgType,
          card_id: this.card_id,
          encrypt_code: this.encrypt_code,
          openid: this.openid,
          wechatIDget: this.wechatIDget,
          wechatID: this.$store.state.wechatID,
          wexinID: this.$store.state.openid,
          mobile: this.mobile,
          birthday: this.birthday,
          isMember: 0,
          Checkno: this.Checkno
        }
        requestData = JSON.stringify(requestData)
        data.append('requestData', requestData)
        this.$axios.post('system/customlogin/registerAndLogin', data).then(result => {
          this.btnFlag = true
          let res = result.data
          if (res.code === 200) {
            // 卡包执行
            if (this.card_id && this.encrypt_code) {
              this.$toast({
                message: '激活成功！',
                type: 'success'
              })
              // 卡包设置用户信息
              this.cardSetUserInfo()
              return false
            }
            this.$toast({
              message: '注册成功!',
              type: 'success'
            })
            // 设置用户信息
            this.setUserInfo()
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
          this.$store.commit('setToken', res.data.token)
          sessionStorage.setItem('jyyf_token', res.data.token)
          this.$axios.defaults.headers.common.Authorization = res.data.token
          let url = sessionStorage.getItem('jyyf_beforeLoginUrl').replace(/"/g, '')
          this.$router.push(url)
        } else {
          this.$toast({
            message: '登陆失败，请重新登陆！',
            type: 'fail'
          })
        }
      }).catch(error => {
        throw error
      })
    },
    // 卡包设置用户信息
    cardSetUserInfo () {
      let data = new FormData()
      let requestData = {
        wechatID: this.wechatIDget,
        wexinID: this.openid
      }
      requestData = JSON.stringify(requestData)
      data.append('requestData', requestData)
      this.$axios.post('system/customlogin/login', data).then(result => {
        let res = result.data
        if (res.code === 200) {
          this.$store.commit('setUserInfo', res.data)
          this.$store.commit('setToken', res.data.token)
          sessionStorage.setItem('jyyf_token', res.data.token)
          this.$axios.defaults.headers.common.Authorization = res.data.token
          this.$router.push('/')
        } else {
          this.$toast({
            message: '登陆失败，请重新登陆！',
            type: 'fail'
          })
        }
      }).catch(error => {
        throw error
      })
    }
  },
  created () {
    // 页面加载时获取图形验证码
    this.getImgcode()
  }
}
</script>

<style scoped>
@import "static/css/register.css";
</style>
