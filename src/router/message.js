const messageList = () => import(/* webpackChunkName: 'message' */ '@/components/message/messageList')
const messagedetail = () => import(/* webpackChunkName: 'message' */ '@/components/message/messagedetail')
const noticeList = () => import(/* webpackChunkName: 'message' */ '@/components/message/noticeList')
const noticedetail = () => import(/* webpackChunkName: 'message' */ '@/components/message/noticedetail')

export default [
  // 消息中心
  {path: '/messageList', name: 'messageList', component: messageList, meta: {keepAlive: true}},
  // 消息详情
  {path: '/messagedetail', name: 'messagedetail', component: messagedetail},
  // 通知中心
  {path: '/noticeList', name: 'noticeList', component: noticeList, meta: {keepAlive: true}},
  // 通知详情
  {path: '/noticedetail', name: 'noticedetail', component: noticedetail}
]
