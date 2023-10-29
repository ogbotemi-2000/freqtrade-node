      let basePath,
      fs = require('fs');
      const getEnvs = (envs={})=>new Promise((res, rej)=>{
        !getEnvs.__envs
	? fs.readFile(basePath, function(err, bf){
  	  if(!err) bf+='', bf.split('\n').forEach(e=>{
    	    if(e) envs[(e = e.split('=').map(e=>e.trim()))[0]] = e[1];
  	  }), res(getEnvs.__envs = envs);
	  else rej(err);
	}) : res(getEnvs.__envs);
  }),
  setEnvs = (line, cb)=>line&&fs.appendFile(basePath, line, cb||=_=>_);

module.exports = relPath =>{
  basePath = fs.existsSync(relPath)&&relPath;
  if(!basePath) throw Error(`Path specified for .env file - "${relPath}" doesn't exist`);

  return {getEnvs, setEnvs};
};
