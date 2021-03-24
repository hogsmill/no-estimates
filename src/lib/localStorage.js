
import { v4 as uuidv4 } from 'uuid'

const LocalStorage = {

  check: function() {
    let check
    const uuid = uuidv4()
    try {
      localStorage.setItem('agile-simulations-test', uuid)
      check = localStorage.getItem('agile-simulations-test') == uuid
      localStorage.removeItem('agile-simulations-test')
    }
    catch(e) {
      check = false
    }
    return check
  }

}

export default LocalStorage
