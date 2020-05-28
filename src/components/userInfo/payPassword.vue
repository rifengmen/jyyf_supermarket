<template>
  <div class="container bgeeeeee">
    <!-- 头部 start -->
    <my-header>
      <template v-slot:backs>
        <i class="el-icon-arrow-left"></i>
      </template>
      <template v-slot:header>支付密码</template>
    </my-header>
    <!-- 头部 end -->
    <!-- 内容部分盒子 start -->
    <div class="userinfo_main bgffffff">
      <!-- 已开通 start -->
      <div class="userinfo_password border_r6" v-show="coflags">
        <!-- 状态 卡号 start -->
        <div class="section">
          <div>状态：开通</div>
        </div>
        <div class="section">
          <div>卡号：{{userInfo.memcode}}</div>
        </div>
        <!-- 状态 卡号 end -->
        <!-- 按钮部分 start -->
        <div class="btn_box section">
          <!-- 保存按钮 start -->
          <div class="send_btn register_btn borderff7e42 border_r6 bgff7e42 colorffffff font32 font_normal" @click="payPasswordReset">重置支付密码</div>
          <!-- 保存按钮 end -->
          <!-- 取消按钮 start -->
          <div class="send_btn register_btn borderc7c7c7 border_r6 bgffffff color666666 font32 font_normal" @click="payPasswordClose">关闭支付密码</div>
          <!-- 取消按钮 end -->
        </div>
        <!-- 按钮部分 end -->
      </div>
      <!-- 已开通 end -->
      <!-- 未开通支付密码 start -->
      <div class="userinfo_password border_r6" v-show="!coflags">
        <!-- 手机号 start -->
        <div class="section font28 color333333">
          <div class="section_tit">
            <span>手机号</span>
            <span class="colorf14c4c">*</span>
          </div>
          <div class="section_input">
            <div class="section_inputall border_r6">
              <input type="text" name="mobile" v-model="userInfo.mobile" disabled>
            </div>
          </div>
        </div>
        <!-- 手机号 end -->
        <!-- 支付密码 start -->
        <div class="section font28 color333333">
          <div class="section_tit">
            <span>支付密码</span>
            <span class="colorf14c4c">*</span>
          </div>
          <div class="section_input">
            <div class="section_inputall border_r6">
              <input
                type="password"
                name="password"
                v-model="password"
                maxlength="4"
                onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
                placeholder="请输入四位支付密码">
            </div>
          </div>
        </div>
        <!-- 支付密码 end -->
        <!-- 再次输入 start -->
        <div class="section font28 color333333">
          <div class="section_tit">
            <span>再次输入</span>
            <span class="colorf14c4c">*</span>
          </div>
          <div class="section_input">
            <div class="section_inputall border_r6">
              <input
                type="password"
                name="password1"
                v-model="password1"
                maxlength="4"
                onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
                placeholder="请再次输入四位支付密码">
            </div>
          </div>
        </div>
        <!-- 再次输入 end -->
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
          <!-- 保存按钮 start -->
          <div class="send_btn register_btn borderff7e42 border_r6 bgff7e42 colorffffff font32 font_normal" @click="payPasswordEdit">保存</div>
          <!-- 保存按钮 end -->
        </div>
        <!-- 按钮部分 end -->
      </div>
      <!-- 未开通支付密码 end -->
    </div>
    <!-- 内容部分盒子 end -->
  </div>
</template>

<script>
import MyHeader from '@/components/common/header/myheader'

export default {
  name: 'payPassword',
  data () {
    return {
      // 图片验证token
      token: '',
      // 密码
      password: '',
      // 再次密码
      password1: '',
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
      // 保存按钮开关
      btnFlag: true,
      coflags: this.$store.state.userInfo.coflag
    }
  },
  computed: {
    // 获取用户信息
    userInfo () {
      return this.$store.state.userInfo
    },
    // conflag 显示修改框
    coflag () {
      return this.$store.state.userInfo.coflag
    }
  },
  components: {
    MyHeader
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
    // 发送图片验证码请求短信验证码
    sendImgcode () {
      // if (this.mobilecode === '') {
      //   this.$toast({
      //     message: '请输入图形验证码！',
      //     type: 'fail'
      //   })
      //   return false
      // }
      this.count = setInterval(this.countDown, 1000)
      let data = new FormData()
      let requestData = {
        mobile: this.userInfo.mobile,
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
    // 关闭支付密码
    payPasswordClose () {
      let data = new FormData()
      let requestData = {}
      requestData = JSON.stringify(requestData)
      data.append('requestData', requestData)
      this.$axios.post('bill/pay/cardpayclose', data).then(result => {
        let res = result.data
        if (res.code === 200) {
          this.$toast({
            message: '关闭成功！',
            type: 'success'
          })
          this.coflags = false
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
    // 重置支付密码
    payPasswordReset () {
      this.coflags = !this.coflags
    },
    // 设置支付密码 修改支付密码
    payPasswordEdit () {
      if (this.password === '' || this.password.length < 4) {
        this.$toast({
          message: '请输入四位支付密码！',
          type: 'fail'
        })
        return false
      }
      if (this.password1 === '' || this.password1.length < 4) {
        this.$toast({
          message: '请再次输入四位支付密码！',
          type: 'error'
        })
        return false
      }
      if (this.password !== this.password1) {
        this.$toast({
          message: '两次输入密码不一致，请重新输入！',
          type: 'error'
        })
        return false
      }
      if (this.Checkno === '') {
        this.$toast({
          message: '请输入短信验证码！',
          type: 'error'
        })
        return false
      }
      if (this.btnFlag) {
        this.btnFlag = false
        let data = new FormData()
        let requestData = {
          Checkno: this.Checkno,
          Cpassword: this.password
        }
        requestData = JSON.stringify(requestData)
        data.append('requestData', requestData)
        // coflag 0：未开通；1：已开通
        if (this.coflag) {
          this.$axios.post('bill/pay/payPasswordReset', data).then(result => {
            this.btnFlag = true
            let res = result.data
            if (res.code === 200) {
              this.$toast({
                message: '重置成功！',
                type: 'success'
              })
              this.coflags = true
            } else {
              this.$toast({
                message: res.msg,
                type: 'error'
              })
            }
          }).catch(error => {
            throw error
          })
          return false
        }
        this.$axios.post('bill/pay/cardpayopen', data).then(result => {
          this.btnFlag = true
          let res = result.data
          if (res.code === 200) {
            this.$toast({
              message: '开通成功！',
              type: 'success'
            })
            this.coflags = true
          } else {
            this.$toast({
              message: res.msg,
              type: 'error'
            })
          }
        }).catch(error => {
          throw error
        })
      }
    }
  },
  watch: {},
  beforeCreate () {
  },
  created () {
    // 页面加载时获取图形验证码
    this.getImgcode()
  },
  beforeMount () {
  },
  mounted () {
  }
}
</script>

<style scoped>
@import "static/css/userInfo.css";

</style>
