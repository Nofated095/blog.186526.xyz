function main(){getos((e,os)=>{
    if(e) throw new Error(e);
    if(os.os === "linux"){
        if(os.release == undefined){
            globalThis.buildEnvironment = `${os.dist} @ Node.js ${process.version}`
        }else{
            globalThis.buildEnvironment = `${os.dist} ${os.release} @ Node.js ${process.version}`
        }    
    }else{
        globalThis.buildEnvironment = `${os.os} @ Node.js ${process.version}`;
    }
    console.log(`Running in ${globalThis.buildEnvironment}`);
    return globalThis.buildEnvironment;
})}

main();

/* global hexo */


// Welcome Message
require('../includes/tasks/welcome');
// Check Hexo Version
require('../includes/tasks/check_hexo')(hexo);
// Check required dependencies
require('../includes/tasks/check_deps');

const logger = require('hexo-log')();
logger.info('Loading Suka Theme Plugins');

// Helper
require('../includes/helpers/page')(hexo);
require('../includes/helpers/tags')(hexo);
require('../includes/helpers/favicon')(hexo);
require('../includes/helpers/qrcode')(hexo);

// Generator
require('../includes/generator/search')(hexo);

// Filter
require('../includes/filter/prism')(hexo);
const getos = require('getos');
const { exec } = require('child_process');
globalThis.exec = exec;
exec('git rev-parse --short HEAD', (err, stdout, stderr) => {
    globalThis.commitID = stdout;
    console.log(`CommitID: ${stdout}`);
})
exec('git log --pretty=format:"%ct" HEAD -1',(err,stdout, stderr)=>{
    globalThis.commitTime = stdout;
    console.log(`CommitTime: ${stdout}`);
})

// Debug helper
hexo.extend.helper.register('console', function () {
    console.log(arguments);
});

if ((/3.[89]/).test(hexo.version)) {
    hexo.extend.filter.unregister('after_render:html', require('../../../node_modules/hexo/lib/plugins/filter/meta_generator'));
}

/**
 * note.js | https://theme-next.org/docs/tag-plugins/note/
 */

function postNote(args, content) {
  return `<div class="note ${args.join(" ")}">
            ${hexo.render.renderSync({text: content, engine: "markdown"}).split("\n").join("")}
          </div>`;
}

hexo.extend.tag.register("note", postNote, {ends: true});
hexo.extend.tag.register("subnote", postNote, {ends: true});