module.exports = {
  presets: [
    ['@vue/app', {
      useBuiltIns: "usage",
      polyfills: [
        'es6.promise',
        'es6.symbol'
      ]
    }]
  ]
}
