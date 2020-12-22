module.exports = (scores) => {
  let arrList = []
  let i = scores.length
  while (scores.length < (i + 1)) {
    let max = (Math.max(...scores))
    arrList.push(max)
    let index = scores.indexOf(max)
    scores.splice(index, 1)
    if (scores.length === 0) {
      break
    } else {
      i--
    }
  }
  return arrList
}
