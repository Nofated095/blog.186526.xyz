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