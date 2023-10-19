/****************************************
 *
 * * XOR (eXtra Octopus Resistor) MC 
 * Netease Archive Encrypt & Decrypt 
 * Helper
 * 
 * * By HTMonkeyG
 *
****************************************/


/* Imports */
const fs = require('fs'),
      fmt = require('./includes/tFormat.js'),
      rl = require('readline'),
      pathLib = require('path'),
      texts = require('./includes/text.js'),
      XOR = require('./includes/XOREncryptHelper.js');

/* Folder Copy Function */
function copyFolderSync(source, target, a){
  if (!fs.existsSync(target))
    fs.mkdirSync(target);
  const ls = fs.readdirSync(source);
  ls.forEach((file) => {
    const sP = pathLib.join(source, file);
    const tP = pathLib.join(target, file);
    const st = fs.statSync(sP);
    if (st.isFile()) {
      a(sP),
      fs.copyFileSync(sP, tP);
    } else if (st.isDirectory()) {
      copyFolderSync(sP, tP, a);
    }
  });
}

function delFolderSync(target){
  if(fs.existsSync(target)){
    var ls = fs.readdirSync(target);
    ls.forEach((a) => {
      var p = pathLib.join(target, a);
      if(fs.statSync(p).isDirectory())
        delFolderSync(p);
      else
        fs.unlinkSync(p);
    });
    fs.rmdirSync(target);
  }
}

/* Welcome Text */
console.log(texts.log.welcome);
console.log(texts.log.tip1);

var state = 0,
    path = '';

var UI = rl.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '\x1b[0m> ',
});

UI.prompt();

UI.on('line', function(e){
  switch(state){
    case 0:
      path = e.trim();
      path = pathLib.resolve('', path);
      fmt.printF(texts.log.targetPath, [ path ]);
      try{
        if(!fs.statSync(path).isDirectory()){
          fmt.printF(texts.log.notDir);
        } else {
          fmt.printF(texts.log.test);
          if(!avalTest(path, function(a){
            fmt.printF(texts.log.missing, [ a ])
          }))
            fmt.printF(texts.log.testFail);
          else 
            state = 1,
            fmt.printF(texts.log.testSucc);
        }
      } catch(e){
        fmt.printF(texts.log.targetNotExist)
      }
    break;
    case 1:
      var op = e.trim();
      op = Number(op);
      switch(op){
        case 0:
          defaultDecrypt(),
          state = 0;
          console.log(texts.log.tip1);
        break;
        default:
          fmt.printF(texts.log.invalidOp);
        break;
      }
    break;
  }
  UI.prompt();
}).on('close', function(){
  fmt.printF(texts.log.exit);
  process.exit(0);
});

function defaultDecrypt(){
  fmt.printF(texts.log.tip2)
  var lPath = pathLib.join(path, 'db'),
      ls = fs.readdirSync(lPath),
      encrypted = [];

  ls.forEach(function(a){
    var tempBuf = fs.readFileSync(pathLib.join(lPath, a));
    XOR.checkFileIsEncrypt(tempBuf) ? encrypted.push(a) : 0;
  });

  if(!encrypted.length){
    fmt.printF(texts.log.noEncFile);
    return
  }
  if(encrypted.length <= 3)
    fmt.printF(texts.log.le3EncFile, [ encrypted.join(', ') ]);
  else
    fmt.printF(texts.log.gt3EncFile, [ encrypted.slice(0, 3).join(', '), encrypted.length ]);

  fmt.printF(texts.log.createFolder);
  var name = pathLib.basename(path) + '_Dec',
      resultPath = pathLib.join(path, '..', name);
  try {
    fmt.printF(texts.log.cpFile);
    copyFolderSync(path, resultPath, (a) => {
      fmt.printF(texts.log.cping, [ pathLib.relative(path, a) ])
    })
    encrypted.forEach((a)=>{
      fmt.printF(texts.log.decrypting, [a]);

      var buf = XOR.decryptFile(fs.readFileSync(pathLib.join(path, 'db', a)));
      if(buf)
        fs.writeFileSync(pathLib.join(resultPath, 'db', a), buf);
      else
        throw new Error('Unknown Decrypt Error');
    });
    fmt.printF(texts.log.decSucc1, [ resultPath ]);
  } catch(e) {
    fmt.printF(texts.log.error, [ e.message ]);
    delFolderSync(resultPath)
  }
}

function avalTest(path, log){
  var ls = fs.readdirSync(path),
      pass = !0;

  if(ls.indexOf('level.dat') == -1)
    pass = !1,
    log('level.dat');

  if(ls.indexOf('db') == -1 || !fs.statSync(path + '/db').isDirectory())
    pass = !1,
    log('db/');
  else {
    ls = fs.readdirSync(path + '/db');
    var flag = 0x3;
    for(var i = 0;i < ls.length;i++){
      if(/^MANIFEST/.test(ls[i])) flag &= 0x6;
      if(/^CURRENT/.test(ls[i])) flag &= 0x5;
      if(!flag) break;
    }
    (flag & 0x1) ? (log('db/MANIFEST-*'), pass = !1) : 0;
    (flag & 0x2) ? (log('db/CURRENT'), pass = !1) : 0;
  }
  
  return pass;
}
