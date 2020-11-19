import { Toast } from 'vant'

const tip = msg => {
  Toast({
    message: msg,
    duration: 3000,
    forbidClick: true
  })
}

export default tip
