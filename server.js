#! /usr/bin/env node

var connect = require('connect')
  , fs = require ('fs')
  , index = require('connect-index')
  , indexer =   index(__dirname + '/results')

connect(
  function (req, res, next) {
    if(req.method == 'GET')
      return indexer(req, res, next)
    next()
  },
  connect.static(__dirname + '/results'),
  function (req, res) {
    if(req.method != 'POST') {
      res.writeHead(400)
      res.end('EXPECT A POST')
      return
    }
    req.pipe(fs.createWriteStream(__dirname + '/results/post.log'))
    req.on('end', function () {
      res.writeHead(200)
      res.end('OK')
    })
  }
).listen(8642)