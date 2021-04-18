const cssnano = require('cssnano')
const autoprefixer = require('autoprefixer')
module.exports = {
  plugins: [
    autoprefixer(
      {
        browsers: ['ie >= 11']
      }
    ),
    require('postcss-nested'),
    (()=>{
      console.log('PostCSS Running...');
      return require('postcss-css-variables')({
        preserve:false,
      });
    })(),
    cssnano({
      preset: 'default',
    }),
  ]
}