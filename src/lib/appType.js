
import params from './params.js'

const AppType = {

  get: function(appType) {
    if (process.env.VUE_APP_TYPE) {
      appType = process.env.VUE_APP_TYPE
    } else if (params.getParam('appType')) {
      // To allow appType switching in dev
      appType = params.getParam('appType')
    } else {
      appType = 'No Estimates'
    }
    return appType
  }

}

export default AppType
