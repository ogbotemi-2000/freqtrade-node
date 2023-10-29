let fs	       = require('fs'),
    subProcess = require('child_process'),
    run	       = require('./utils/runProcess');


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
