<template>
    <div class="countdown_time">
      <div class="font24 colorffffff bg2c2c2c border_r4">{{hours}}</div>:
      <div class="font24 colorffffff bg2c2c2c border_r4">{{minutes}}</div>:
      <div class="font24 colorffffff bg2c2c2c border_r4">{{second}}</div>
    </div>
</template>

<script>
export default {
  name: 'countdown',
  props: {
    times: {
      type: String,
      default: function () {
        return ''
      }
    }
  },
  data () {
    return {
      // 剩余时长
      time: 1,
      // 小时
      hours: '00',
      // 分钟
      minutes: '00',
      // 秒
      second: '00'

    }
  },
  computed: {},
  components: {},
  methods: {
    // 换算时间写入页面
    initTimes () {
      let self = this
      self.countdown = setInterval(self.timeTodate, 1000)
    },
    // 格式化时间
    timeTodate () {
      let self = this
      let _t = self.times
      _t = _t.replace(/-/g, '/')
      let times = new Date(_t).getTime()
      self.time = (times - new Date().getTime()) / 1000
      if (self.time !== null && self.time !== '' && self.time > 0) {
        let h = parseInt(self.time / (60 * 60))
        let m = parseInt(self.time / 60 % 60)
        let s = parseInt(self.time % 60)
        self.hours = self.checkTime(h)
        self.minutes = self.checkTime(m)
        self.second = self.checkTime(s)
      } else if (self.time <= 0) {
        // 关闭定时器
        clearInterval(self.countdown)
      }
    },
    // 一位时间加零
    checkTime (i) {
      if (i < 10) {
        i = '0' + i
      }
      return i
    }
  },
  watch: {
  },
  beforeCreate () {
  },
  created () {
    let self = this
    // 初始化倒计时
    self.initTimes()
  },
  beforeMount () {
  },
  mounted () {
  },
  destroyed () {
    let self = this
    // 关闭定时器
    clearInterval(self.countdown)
  }
}
</script>

<style scoped>
@import 'static/css/countdown.css';
</style>
