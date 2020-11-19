/**
 * api接口的统一出口
 */

import system from './system'
import api from './api'
import pay from './pay'
import info from './info'
import invest from './invest'
import bill from './bill'

// 导出接口
export default {
  system,
  api,
  pay,
  info,
  invest,
  bill
}
