
const Maths = {

  maxOfKey: function(arr, key) {
    let max = 0
    for (let i = 0; i < arr.length; i++) {
      max = Math.max(max, arr[i][key])
    }
    return max
  }
}

export default Maths
