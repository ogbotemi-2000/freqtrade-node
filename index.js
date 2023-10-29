const run  = require('./utils/runProcess'),
      fs   		            = require("fs"),
      http 		            = require("http"),
      path 		            = require("path"),
      {getEnvs, setEnvs}  = require('./utils/env')('./.env'),
      subProcess 	  = require('child_process');

let PORT, exempt = '/health';

const MIME_TYPES = {
  default: "application/octet-stream",
  html: "text/html; charset=UTF-8",
  js: "application/javascript",
  css: "text/css",
  png: "image/png",
  jpg: "image/jpg",
  gif: "image/gif",
  ico: "image/x-icon",
  svg: "image/svg+xml",
};

let STATIC_PATH='/', getBody=(req, chunks='')=>new Promise((res, rej)=>{
  req.on('data', chunk=>chunks+=chunk),  
  req.on('end', _=>res(chunks))
});

const toBool = [() => true, () => false];

const prepareFile = async (url) => {
  const paths = [STATIC_PATH, url];
  if (url.endsWith("/")) paths.push("index.html");
  
  const filePath = path.join(...paths);
  const pathTraversal = !filePath.startsWith(STATIC_PATH);
  const exists = await fs.promises.access(filePath).then(...toBool);
  let found = !pathTraversal && exists;
  let streamPath = found ? filePath : STATIC_PATH + (url===exempt&&(found = !0, './health.html')||"./404.html");
console.log('streamPath', streamPath);
  const ext = path.extname(streamPath).substring(1).toLowerCase();
  
  const stream = fs.createReadStream(path.normalize(streamPath));
  return { found, ext, stream };
};


getEnvs().then(envs=>{
http
  .createServer(async (req, res, url) => {
      /*
      const statusCode = file.found ? 200 : 404;
      const mimeType = MIME_TYPES[file.ext] || MIME_TYPES.default;
      res.writeHead(statusCode, { "Content-Type": mimeType });
      file.stream.pipe(res);
      */
      console.log(`${req.method} ${req.url}`, STATIC_PATH);
      res.end(JSON.stringify(req.headers))
  })
  .listen(PORT = envs.PORT),
  console.log(`Server running at http://127.0.0.1:${PORT}/`);

})

function install(repo) {
  if(!fs.existsSync('freqtrade')) {
    repo = 'https://github.com/freqtrade/freqtrade.git',
    console.log('Executing `git clone', repo, '--depth=1`'),
    run('git', ['clone', repo, '--depth=1'], function(err, out, spawn) {
      console.log(out),
      subProcess.exec('cd freqtrade && "./setup.sh" -i', console.log)
    })
  }
}

install()