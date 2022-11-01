if (process.env.NODE_ENV === 'production') {
  // 去掉打印
  console.log = function () {}
  console.warning = function () {}
  console.dir = function () {}
  console.error = function () {}
}
