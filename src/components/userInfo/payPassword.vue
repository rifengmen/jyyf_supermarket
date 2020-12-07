<template>
  <div class="container_pt110 bgeeeeee">
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
          <div class="send_btn register_btn borderff7e42 border_r6 bgff7e42 colorffffff font32 font_normal" @click="setCoflags">重置支付密码</div>
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
                onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^0-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
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
                onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^0-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
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
import tip from '@/utils/Toast'

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
      let self = this
      return self.$store.state.userInfo
    },
    // conflag 显示修改框
    coflag () {
      let self = this
      return self.$store.state.userInfo.coflag
    }
  },
  components: {
    MyHeader
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
        } else {
          tip(res.msg)
        }
      })
    },
    // 发送图片验证码请求短信验证码
    sendImgcode () {
      let self = this
      // if (self.mobilecode === '') {
      //   tip('请输入图形验证码！')
      //   return false
      // }
      self.count = setInterval(self.countDown, 1000)
      let data = {
        mobile: self.userInfo.mobile,
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
    // 关闭支付密码
    payPasswordClose () {
      let self = this
      let data = {}
      self.$api.bill.cardpayclose(data).then(result => {
        let res = result.data
        if (res.code === 200) {
          tip('关闭成功！')
          self.coflags = false
        } else {
          tip(res.msg)
        }
      })
    },
    // 显示重置页面
    setCoflags () {
      let self = this
      self.coflags = !self.coflags
    },
    // 设置支付密码/修改支付密码内容校验
    payPasswordEdit () {
      let self = this
      if (self.password === '' || self.password.length < 4) {
        tip('请输入四位支付密码！')
        return false
      }
      if (self.password1 === '' || self.password1.length < 4) {
        tip({
          message: '请再次输入四位支付密码！',
          type: 'error'
        })
        return false
      }
      if (self.password !== self.password1) {
        tip({
          message: '两次输入密码不一致，请重新输入！',
          type: 'error'
        })
        return false
      }
      if (self.Checkno === '') {
        tip({
          message: '请输入短信验证码！',
          type: 'error'
        })
        return false
      }
      if (self.btnFlag) {
        self.btnFlag = false
        let data = {
          Checkno: self.Checkno,
          Cpassword: self.password
        }
        // coflag 0：未开通；1：已开通
        if (self.coflag) {
          // 重置支付密码
          self.payPasswordReset(data)
        } else {
          // 开通支付密码
          self.cardpayopen(data)
        }
      }
    },
    // 开通支付密码
    cardpayopen (data) {
      let self = this
      self.$api.bill.cardpayopen(data).then(result => {
        self.btnFlag = true
        let res = result.data
        if (res.code === 200) {
          tip('开通成功！')
          self.coflags = true
        } else {
          tip(res.msg)
        }
      })
    },
    // 重置支付密码
    payPasswordReset (data) {
      let self = this
      self.$api.bill.payPasswordReset(data).then(result => {
        self.btnFlag = true
        let res = result.data
        if (res.code === 200) {
          tip('重置成功！')
          self.coflags = true
        } else {
          tip(res.msg)
        }
      })
    }
  },
  watch: {},
  beforeCreate () {
  },
  created () {
    let self = this
    // 页面加载时获取图形验证码
    self.getImgcode()
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
