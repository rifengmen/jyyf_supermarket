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
      // require: true,
      default: function () {
        return ''
      }
    }
  },
  data () {
    return {
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
      setInterval(this.timeTodate, 1000)
    },
    // 格式化时间
    timeTodate () {
      let _t = this.times
      _t = _t.replace(/-/g, '/')
      let times = new Date(_t).getTime()
      let time = (times - new Date().getTime()) / 1000
      if (time !== null && time !== '') {
        let h = parseInt(time / (60 * 60))
        let m = parseInt(time / 60 % 60)
        let s = parseInt(time % 60)
        this.hours = this.checkTime(h)
        this.minutes = this.checkTime(m)
        this.second = this.checkTime(s)
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
    times () {
      // 初始化倒计时
      this.initTimes()
    }
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
  }
}
</script>

<style scoped>
@import 'static/css/countdown.css';
</style>
