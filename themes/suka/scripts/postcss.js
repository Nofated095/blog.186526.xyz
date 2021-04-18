'use strict'

var postcss = require('postcss');
var postcssrc = require('postcss-load-config');
var sass = require('node-sass')

const dosass = (ext) => function (data) {

  var config = {
    includePaths: ["node_modules"],
    data: data.text,
    file: data.path,
    outputStyle: 'nested',
    sourceComments: false,
    indentedSyntax: (ext === 'sass')
  };

  try {
        // node-sass result object:
        // https://github.com/sass/node-sass#result-object
    var result = sass.renderSync(config)
        // result is now Buffer instead of String
        // https://github.com/sass/node-sass/issues/711
    return result.css.toString()
  } catch (error) {
    console.error(error.toString())
    throw error
  }
}

function postcssdo(ext) {
  return async(data)=>{
    const css = dosass(ext)(data);
    const { plugins, options } = await postcssrc();
    const result = await postcss(plugins).process(css, options);
    return result.css;  
  }
}

hexo.extend.renderer.register('scss', 'css', postcssdo('scss'))
hexo.extend.renderer.register('sass', 'css', postcssdo('sass'))
hexo.extend.renderer.register('css', 'css', postcssdo('css'))