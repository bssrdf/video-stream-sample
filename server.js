const express = require('express')
const fs = require('fs')
const path = require('path')
const app = express()
var ip = require('ip');

//var engine = require('consolidate');

//app.engine('html', engine.mustache);

app.engine('htm', require('ejs').renderFile);

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', function(req, res) {
  //res.sendFile(path.join(__dirname + '/index.htm'))
  res.render(path.join(__dirname + '/index.htm'))
})

app.get('/dev', function (req, res) {
  res.send('Hello, you are now on the Dev route!');
});

app.get('/video', function(req, res) {
  const path = 'assets/sample.mp4'
  const stat = fs.statSync(path)
  const fileSize = stat.size
  const range = req.headers.range
  console.log(range);

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-")
    const start = parseInt(parts[0], 10)
    const end = parts[1]
      ? parseInt(parts[1], 10)
      : fileSize-1

    const chunksize = (end-start)+1
    const file = fs.createReadStream(path, {start, end})
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    }
    console.log(head);

    res.writeHead(206, head)
    file.pipe(res)
  } else {
    console.log("first reuest");
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    }
    res.writeHead(200, head)
    fs.createReadStream(path).pipe(res)
  }
})

var server = app.listen(3000, function () {
   var host = ip.address()
  console.log('running at http://'+host+':'+'3000')
})