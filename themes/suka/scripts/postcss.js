'use strict'

var postcss = require('postcss');
var postcssrc = require('postcss-load-config');
//const config = require('./.postcssrc.js');

async function postcssdo(data) {
  return await postcssrc()
    .then(({ plugins, options }) => {
      return postcss(plugins).process(data.text, options)
    })
    .then((result) => result.css)
}

hexo.extend.renderer.register('css', 'css', postcssdo)