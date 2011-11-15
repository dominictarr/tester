#! /usr/bin/env node

var connect = require('connect')
  , fs = require ('fs')
  , index = require('connect-index')
  , indexer =   index(__dirname + '/results')
  , spawn = require('child_process').spawn
  , Stream = require('stream').Stream
  , gStream = mkStream()
  , emitter = new (require('events').EventEmitter)()
  
  function mkStream() {
    var stream = new Stream()
  
    stream.writable = true
    stream.readable = true
    stream.end = function () {} //never want this stream to end.
    return stream
  }


//{"pusher":{"name":"none"},"repository":{"name":"tester","created_at":"2011/11/14 17:45:59 -0800","size":140,"has_wiki":true,"private":false,"watchers":1,"language":"JavaScript","url":"https://github.com/dominictarr/tester","fork":false,"pushed_at":"2011/11/14 18:09:09 -0800","has_downloads":true,"open_issues":0,"has_issues":true,"description":"","forks":1,"owner":{"name":"dominictarr","email":"dominic.tarr@gmail.com"}},"forced":false,"after":"f1d0822b38df6c856e1b2a48bca72cfdb9ca6730","deleted":false,"commits":[{"added":["results/ooo"],"modified":["package.json","server.js"],"removed":[],"author":{"name":"Dominic Tarr","username":"dominictarr","email":"dominic.tarr@gmail.com"},"timestamp":"2011-11-14T18:08:55-08:00","url":"https://github.com/dominictarr/tester/commit/f1d0822b38df6c856e1b2a48bca72cfdb9ca6730","id":"f1d0822b38df6c856e1b2a48bca72cfdb9ca6730","distinct":true,"message":"initial"}],"ref":"refs/heads/master","before":"90163709f0be7513fdfbc5c6c21dcc26dbf83717","compare":"https://github.com/dominictarr/tester/compare/9016370...f1d0822","created":false}

connect(
  function (req, res, next) {
    console.error(req.method, req.url)
    if(req.method == 'GET')
      return indexer(req, res, next)
    next()
  },
  connect.bodyParser(),
  connect.static(__dirname + '/results', {maxAge: 0}),
  connect.router(function (app) {
    app.get('/tail/:project?', function (req, res) {
      res.writeHead(200)
      function tail (cp) {
        cp.stdout.pipe(res, {end: false})
        cp.stderr.pipe(res, {end: false})
      }
      emitter.on(req.params.project || 'child_process', tail)
      res.write('**************\n')
      res.write('tailing ' + (req.params.project || '*') + '\n')
      res.write('**************\n')
    })
  }),
  function (req, res) {
    if(req.method != 'POST') {
      res.writeHead(400)
      res.end('EXPECT A POST')
      return
    }
  var push = JSON.parse(req.body.payload)
  var owner = push.repository.owner.name
    , project = push.repository.name
    ;
    
    var gurl = ['git://github.com/', owner,'/', project, '.git'].join('')
    console.error(gurl)

    //we'll also make a tail path so that you can watch the tests running
    var cp = spawn('./install_and_test.bash', [gurl, project])
    
    emitter.emit('child_process',cp)
    emitter.emit(project, cp)
  
    cp.stdout.pipe(process.stdout, {end: false})
    cp.stderr.pipe(process.stderr, {end: false})
    
    res.writeHead(200)
    res.end('OK')
  }
).listen(80, function () {
  console.error('listening on port:', 80)
})