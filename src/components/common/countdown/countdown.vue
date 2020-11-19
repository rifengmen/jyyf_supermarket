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
      this.countdown = setInterval(this.timeTodate, 1000)
    },
    // 格式化时间
    timeTodate () {
      let _t = this.times
      _t = _t.replace(/-/g, '/')
      let times = new Date(_t).getTime()
      this.time = (times - new Date().getTime()) / 1000
      if (this.time !== null && this.time !== '' && this.time > 0) {
        let h = parseInt(this.time / (60 * 60))
        let m = parseInt(this.time / 60 % 60)
        let s = parseInt(this.time % 60)
        this.hours = this.checkTime(h)
        this.minutes = this.checkTime(m)
        this.second = this.checkTime(s)
      } else if (this.time <= 0) {
        // 关闭定时器
        clearInterval(this.countdown)
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
    // 初始化倒计时
    this.initTimes()
  },
  beforeMount () {
  },
  mounted () {
  },
  destroyed () {
    // 关闭定时器
    clearInterval(this.countdown)
  }
}
</script>

<style scoped>
@import 'static/css/countdown.css';
</style>
