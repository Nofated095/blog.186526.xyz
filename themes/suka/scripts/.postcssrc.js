const cssnano = require('cssnano')
const autoprefixer = require('autoprefixer')
module.exports = {
  plugins: [
    autoprefixer(),
    require('postcss-nested'),
    cssnano({
      preset: 'default',
    }),
    (()=>{
      console.log('POSTCSS Loading');
      return require('postcss-css-variables')({
        preserve:false,
      });
    })()
  ]
}