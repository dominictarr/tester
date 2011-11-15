
var fs = require('fs')

console.error(decodeURI(fs.readFileSync('post.log', 'utf-8')))