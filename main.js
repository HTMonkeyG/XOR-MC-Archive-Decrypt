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
<<<<<<< HEAD
  rl = require('readline'),
  pathLib = require('path'),
  fmt = require('./includes/tFormat.js'),
  texts = require('./includes/text.js'),
  XOR = require('./includes/XOREncryptHelper.js');

/* Globals */
var state = 0,
  path = '';

var UI = rl.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '\x1b[0m> ',
});

/* Folder Operation Function */
function copyFolderSync(source, target, disp) {
  if (!fs.existsSync(source))
    return !1;
  if (!fs.existsSync(target))
    fs.mkdirSync(target);
  var fileList = [];
  // This internal func is for progress bar lol
  (function prepareList(sourcePath, targetPath, fls) {
=======
      rl = require('readline'),
      pathLib = require('path'),
      fmt = require('./includes/tFormat.js'),
      texts = require('./includes/text.js'),
      XOR = require('./includes/XOREncryptHelper.js');

/* Globals */
var state = 0,
    path = '';

var UI = rl.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '\x1b[0m> ',
});

/* Folder Operation Function */
function copyFolderSync(source, target, disp){
  if(!fs.existsSync(source))
    return !1;
  if(!fs.existsSync(target))
    fs.mkdirSync(target);
  var fileList = [];
  // This internal func is for progress bar lol
  (function prepareList(sourcePath, targetPath, fls){
>>>>>>> 7a209b06e7e4446c60828323a3999e3249a2b4a9
    var ls = fs.readdirSync(sourcePath);
    ls.forEach((file) => {
      var sP = pathLib.join(sourcePath, file);
      var tP = pathLib.join(targetPath, file);
      var st = fs.statSync(sP);
      if (st.isFile())
        fls.push(sP);
      else if (st.isDirectory())
        fs.existsSync(tP) || fs.mkdirSync(tP),
<<<<<<< HEAD
          prepareList(sP, tP, fls)
=======
        prepareList(sP, tP, fls)
>>>>>>> 7a209b06e7e4446c60828323a3999e3249a2b4a9
    });
  })(source, target, fileList);
  fileList.forEach((file, i) => {
    var tP = pathLib.join(target, pathLib.relative(source, file));
    fs.copyFileSync(file, tP),
<<<<<<< HEAD
      disp(pathLib.relative(tP, file), fileList.length ? i / fileList.length : 0)
  })
}

function delFolderSync(target) {
  if (fs.existsSync(target)) {
    var ls = fs.readdirSync(target);
    ls.forEach((a) => {
      var p = pathLib.join(target, a);
      if (fs.statSync(p).isDirectory())
=======
    disp(pathLib.relative(tP, file), fileList.length ? i / fileList.length : 0)
  })
}

function delFolderSync(target){
  if(fs.existsSync(target)){
    var ls = fs.readdirSync(target);
    ls.forEach((a) => {
      var p = pathLib.join(target, a);
      if(fs.statSync(p).isDirectory())
>>>>>>> 7a209b06e7e4446c60828323a3999e3249a2b4a9
        delFolderSync(p);
      else
        fs.unlinkSync(p);
    });
    fs.rmdirSync(target);
  }
}

/* Welcome Text */
fmt.printF(texts.log.welcome);
fmt.printF(texts.log.tip1);

UI.prompt();

<<<<<<< HEAD
UI.on('line', function (e) {
  switch (state) {
=======
UI.on('line', function(e){
  switch(state){
>>>>>>> 7a209b06e7e4446c60828323a3999e3249a2b4a9
    /* Enter target path */
    case 0:
      path = e.trim();
      path = pathLib.resolve('', path);
<<<<<<< HEAD
      fmt.printF(texts.log.targetPath, [path]);
      try {
        if (!fs.statSync(path).isDirectory()) {
          fmt.printF(texts.log.notDir);
        } else {
          fmt.printF(texts.log.test);
          if (!integrityTest(path, function (a) {
            fmt.printF(texts.log.missing, [a])
          }))
            fmt.printF(texts.log.testFail);
          else
            state = 1,
              fmt.printF(texts.log.testSucc);
        }
      } catch (e) {
        fmt.printF(texts.log.targetNotExist)
      }
      break;
=======
      fmt.printF(texts.log.targetPath, [ path ]);
      try{
        if(!fs.statSync(path).isDirectory()){
          fmt.printF(texts.log.notDir);
        } else {
          fmt.printF(texts.log.test);
          if(!integrityTest(path, function(a){
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
>>>>>>> 7a209b06e7e4446c60828323a3999e3249a2b4a9
    /* Enter operation type */
    case 1:
      var op = e.trim();
      op = Number(op);
<<<<<<< HEAD
      switch (op) {
        case 0:
          defaultDecrypt(),
            state = 0;
          fmt.printF(texts.log.tip1);
          break;
        case 1:
          defaultEncrypt(),
            state = 0;
          fmt.printF(texts.log.tip1);
          break;
        case 2:
          fmt.printF(texts.log.tip3);
          state = 2;
          break;
        default:
          fmt.printF(texts.log.invalidOp);
          break;
      }
      break;
    /* Enter encryption key */
    case 2:
      var txt = e.trim(),
        key = fmt.hex2buf(txt),
        a;

      if (txt.length) {
        if (!key) {
=======
      switch(op){
        case 0:
          defaultDecrypt(),
          state = 0;
          fmt.printF(texts.log.tip1);
        break;
        case 1:
          defaultEncrypt(),
          state = 0;
          fmt.printF(texts.log.tip1);
        break;
        case 2:
          fmt.printF(texts.log.tip3);
          state = 2;
        break;
        default:
          fmt.printF(texts.log.invalidOp);
        break;
      }
    break;
    /* Enter encryption key */
    case 2:
      var txt = e.trim(),
          key = fmt.hex2buf(txt),
          a;

      if(txt.length){
        if(!key){
>>>>>>> 7a209b06e7e4446c60828323a3999e3249a2b4a9
          fmt.printF(texts.log.invalidKey);
          break
        }

        // Cut key into 8 bytes
        (key.length > 8) && (key = key.subarray(-8, 0));
        // Left align key
        (key.length < 8) && (a = Buffer.alloc(8), key.copy(a, 8 - key.length, a.length - 8), key = a);

        console.log(key)
        activeDecrypt(key);
        fmt.printF(texts.log.tip1);
        state = 0;
      } else {
        fmt.printF(texts.log.autoKey);
        activeDecrypt(!1);
        fmt.printF(texts.log.tip1);
        state = 0;
      }
<<<<<<< HEAD
      break;
  }
  UI.prompt();
}).on('close', function () {
=======
    break;
  }
  UI.prompt();
}).on('close', function(){
>>>>>>> 7a209b06e7e4446c60828323a3999e3249a2b4a9
  fmt.printF(texts.log.exit);
  process.exit(0);
});

<<<<<<< HEAD
function activeDecrypt(keyIn) {
  var lPath = pathLib.join(path, 'db'),
    ls = fs.readdirSync(lPath),
    encrypted = [],
    descFileName = '',
    curFileName = '',
    name = pathLib.basename(path) + '_Dec',
    resultPath = pathLib.join(path, '..', name),
    key;

  fmt.printF(texts.log.tip4);

  ls.forEach(function (a) {
    var tempBuf = fs.readFileSync(pathLib.join(lPath, a));
    XOR.checkFileIsEncrypt(tempBuf) ? encrypted.push(a) : 0;
    /^MANIFEST/.test(a) && (descFileName = a + '\n');
    /^CURRENT/.test(a) && (curFileName = a);
  });

  if (!encrypted.length) {
    fmt.printF(texts.log.noEncFile);
    return
  }
  if (encrypted.length <= 3)
    fmt.printF(texts.log.le3EncFile, [encrypted.join(', ')]);
  else
    fmt.printF(texts.log.gt3EncFile, [encrypted.slice(0, 3).join(', '), encrypted.length]);
=======
function activeDecrypt(keyIn){
  var lPath = pathLib.join(path, 'db'),
      ls = fs.readdirSync(lPath),
      encrypted = [],
      descFileName = '',
      curFileName = '',
      name = pathLib.basename(path) + '_Dec',
      resultPath = pathLib.join(path, '..', name),
      key;

  fmt.printF(texts.log.tip4);

  ls.forEach(function(a){
    var tempBuf = fs.readFileSync(pathLib.join(lPath, a));
    XOR.checkFileIsEncrypt(tempBuf) ? encrypted.push(a) : 0;
    /^MANIFEST/.test(a) && (descFileName = a + '\n'); 
    /^CURRENT/.test(a) && (curFileName = a);
  });

  if(!encrypted.length){
    fmt.printF(texts.log.noEncFile);
    return
  }
  if(encrypted.length <= 3)
    fmt.printF(texts.log.le3EncFile, [ encrypted.join(', ') ]);
  else
    fmt.printF(texts.log.gt3EncFile, [ encrypted.slice(0, 3).join(', '), encrypted.length ]);
>>>>>>> 7a209b06e7e4446c60828323a3999e3249a2b4a9

  fmt.printF(texts.log.createFolder);
  // Delete the existing folder
  fs.existsSync(resultPath) && (fmt.printF(texts.log.delExistFolder), delFolderSync(resultPath));
  try {
    fmt.printF(texts.log.cpFile);
    console.log('\n');
    copyFolderSync(path, resultPath, (a, b) => {
      fmt.limPrgBar('§6' + a, b)
    });
    fmt.limPrgBar('§bDone.', 1);

<<<<<<< HEAD
    if (!keyIn) {
      // No key input
=======
    if(!keyIn){
    // No key input
>>>>>>> 7a209b06e7e4446c60828323a3999e3249a2b4a9
      fmt.printF(texts.log.tryGetKey);

      var buf1 = Buffer.from(descFileName);
      var buf2 = fs.readFileSync(pathLib.join(lPath, curFileName)).subarray(4);
<<<<<<< HEAD

      if (buf1.length != buf2.length) {
=======
    
      if(buf1.length != buf2.length){
>>>>>>> 7a209b06e7e4446c60828323a3999e3249a2b4a9
        fmt.printF(texts.log.getKeyFail);
        delFolderSync(resultPath);
        return
      }

<<<<<<< HEAD
      for (var i = 0; i < buf1.length; i++)
        buf1[i] ^= buf2[i];

      if (Buffer.compare(buf1.subarray(0, 8), buf1.subarray(8))) {
=======
      for(var i = 0;i < buf1.length;i++)
        buf1[i] ^= buf2[i];

      if(Buffer.compare(buf1.subarray(0,8), buf1.subarray(8))){
>>>>>>> 7a209b06e7e4446c60828323a3999e3249a2b4a9
        fmt.printF(texts.log.getKeyFail);
        delFolderSync(resultPath);
        return
      }
<<<<<<< HEAD
      key = buf1.subarray(0, 8);
      fmt.printF(texts.log.getKeySucc, ['0x' + key.toString('hex')])
=======
      key = buf1.subarray(0,8);
      fmt.printF(texts.log.getKeySucc, [ '0x' + key.toString('hex') ])
>>>>>>> 7a209b06e7e4446c60828323a3999e3249a2b4a9
    } else
      key = keyIn;

    fmt.printF(texts.log.decrypting);
    console.log('\n');
<<<<<<< HEAD
    encrypted.forEach((a, b) => {
      fmt.limPrgBar('§6' + a, b / encrypted.length)
      var buf = XOR.decryptFile(fs.readFileSync(pathLib.join(path, 'db', a)), key);
      if (buf)
=======
    encrypted.forEach((a, b)=>{
      fmt.limPrgBar('§6' + a, b / encrypted.length)
      var buf = XOR.decryptFile(fs.readFileSync(pathLib.join(path, 'db', a)), key);
      if(buf)
>>>>>>> 7a209b06e7e4446c60828323a3999e3249a2b4a9
        fs.writeFileSync(pathLib.join(resultPath, 'db', a), buf);
      else
        throw new Error('Unknown Decrypt Error');
    });
    fmt.limPrgBar('§bDone.', 1);
    fmt.printF(texts.log.avalTest);
    avalTest(resultPath) ? fmt.printF(texts.log.avalTestSucc) : fmt.printF(texts.log.avalTestFail);
<<<<<<< HEAD
    fmt.printF(texts.log.decSucc1, [resultPath]);
  } catch (e) {
    fmt.printF(texts.log.error, [e.message]);
=======
    fmt.printF(texts.log.decSucc1, [ resultPath ]);
  } catch(e) {
    fmt.printF(texts.log.error, [ e.message ]);
>>>>>>> 7a209b06e7e4446c60828323a3999e3249a2b4a9
    delFolderSync(resultPath)
  }
}

<<<<<<< HEAD
function defaultEncrypt() {
  var lPath = pathLib.join(path, 'db'),
    ls = fs.readdirSync(lPath),
    preEnc = [],
    name = pathLib.basename(path) + '_Enc',
    resultPath = pathLib.join(path, '..', name);

  fmt.printF(texts.log.tip5);

  for (var i = 0; i < ls.length; i++) {
    var a = ls[i],
      tempBuf = fs.readFileSync(pathLib.join(lPath, a));
    if (XOR.checkFileIsEncrypt(tempBuf)) {
=======
function defaultEncrypt(){
  var lPath = pathLib.join(path, 'db'),
      ls = fs.readdirSync(lPath),
      preEnc = [],
      name = pathLib.basename(path) + '_Enc',
      resultPath = pathLib.join(path, '..', name);

  fmt.printF(texts.log.tip5);

  for(var i = 0;i < ls.length;i++){
    var a = ls[i],
        tempBuf = fs.readFileSync(pathLib.join(lPath, a));
    if(XOR.checkFileIsEncrypt(tempBuf)){
>>>>>>> 7a209b06e7e4446c60828323a3999e3249a2b4a9
      fmt.printF(texts.log.foundEncFile);
      return
    }
    (/^MANIFEST-[0-9]{6}$/.test(a) || /^CURRENT$/.test(a) || /^[0-9]{6}.ldb$/.test(a)) && preEnc.push(a);
  };

<<<<<<< HEAD
  if (!preEnc.length) {
=======
  if(!preEnc.length){
>>>>>>> 7a209b06e7e4446c60828323a3999e3249a2b4a9
    fmt.printF(texts.log.noToDecFile);
    return
  }
  fmt.printF(texts.log.readyToEnc);
  fmt.printF(texts.log.createFolder);
  // Delete the existing folder
  fs.existsSync(resultPath) && (fmt.printF(texts.log.delExistFolder), delFolderSync(resultPath));
  try {
    fmt.printF(texts.log.cpFile);
    console.log('\n');
    copyFolderSync(path, resultPath, (a, b) => {
      fmt.limPrgBar('§6' + a, b)
    });
    fmt.limPrgBar('§bDone.', 1);

    fmt.printF(texts.log.encrypting);
    console.log('\n');
    preEnc.forEach((a, b) => {
      fmt.limPrgBar('§6' + a, b / preEnc.length);
      var buf = XOR.encryptFile(fs.readFileSync(pathLib.join(path, 'db', a)));
<<<<<<< HEAD
      if (buf)
=======
      if(buf)
>>>>>>> 7a209b06e7e4446c60828323a3999e3249a2b4a9
        fs.writeFileSync(pathLib.join(resultPath, 'db', a), buf);
      else
        throw new Error('Unknown Decrypt Error');
    });
    fmt.limPrgBar('§bDone.', 1);
<<<<<<< HEAD
    fmt.printF(texts.log.encSucc1, [resultPath]);
  } catch (e) {
    fmt.printF(texts.log.error, [e.message]);
=======
    fmt.printF(texts.log.encSucc1, [ resultPath ]);
  } catch(e) {
    fmt.printF(texts.log.error, [ e.message ]);
>>>>>>> 7a209b06e7e4446c60828323a3999e3249a2b4a9
    delFolderSync(resultPath)
  }
}

<<<<<<< HEAD
function defaultDecrypt() {
  var lPath = pathLib.join(path, 'db'),
    ls = fs.readdirSync(lPath),
    encrypted = [],
    name = pathLib.basename(path) + '_Dec',
    resultPath = pathLib.join(path, '..', name);

  fmt.printF(texts.log.tip2);

  ls.forEach(function (a) {
=======
function defaultDecrypt(){
  var lPath = pathLib.join(path, 'db'),
      ls = fs.readdirSync(lPath),
      encrypted = [],
      name = pathLib.basename(path) + '_Dec',
      resultPath = pathLib.join(path, '..', name);

  fmt.printF(texts.log.tip2);

  ls.forEach(function(a){
>>>>>>> 7a209b06e7e4446c60828323a3999e3249a2b4a9
    var tempBuf = fs.readFileSync(pathLib.join(lPath, a));
    XOR.checkFileIsEncrypt(tempBuf) ? encrypted.push(a) : 0;
  });

<<<<<<< HEAD
  if (!encrypted.length) {
    fmt.printF(texts.log.noEncFile);
    return
  }
  if (encrypted.length <= 3)
    fmt.printF(texts.log.le3EncFile, [encrypted.join(', ')]);
  else
    fmt.printF(texts.log.gt3EncFile, [encrypted.slice(0, 3).join(', '), encrypted.length]);
=======
  if(!encrypted.length){
    fmt.printF(texts.log.noEncFile);
    return
  }
  if(encrypted.length <= 3)
    fmt.printF(texts.log.le3EncFile, [ encrypted.join(', ') ]);
  else
    fmt.printF(texts.log.gt3EncFile, [ encrypted.slice(0, 3).join(', '), encrypted.length ]);
>>>>>>> 7a209b06e7e4446c60828323a3999e3249a2b4a9

  fmt.printF(texts.log.createFolder);
  // Delete the existing folder
  fs.existsSync(resultPath) && (fmt.printF(texts.log.delExistFolder), delFolderSync(resultPath));
  try {
    fmt.printF(texts.log.cpFile);
    console.log('\n');
    copyFolderSync(path, resultPath, (a, b) => {
      fmt.limPrgBar('§6' + a, b)
    });
    fmt.limPrgBar('§bDone.', 1);

    fmt.printF(texts.log.decrypting);
    console.log('\n');
<<<<<<< HEAD
    encrypted.forEach((a, b) => {
      fmt.limPrgBar('§6' + a, b / encrypted.length);
      var buf = XOR.decryptFile(fs.readFileSync(pathLib.join(path, 'db', a)));
      if (buf)
=======
    encrypted.forEach((a, b)=>{
      fmt.limPrgBar('§6' + a, b / encrypted.length);
      var buf = XOR.decryptFile(fs.readFileSync(pathLib.join(path, 'db', a)));
      if(buf)
>>>>>>> 7a209b06e7e4446c60828323a3999e3249a2b4a9
        fs.writeFileSync(pathLib.join(resultPath, 'db', a), buf);
      else
        throw new Error('Unknown Decrypt Error');
    });
    fmt.limPrgBar('§bDone.', 1);
    fmt.printF(texts.log.avalTest);
    avalTest(resultPath) ? fmt.printF(texts.log.avalTestSucc) : fmt.printF(texts.log.avalTestFail);
<<<<<<< HEAD
    fmt.printF(texts.log.decSucc1, [resultPath]);
  } catch (e) {
    fmt.printF(texts.log.error, [e.message]);
=======
    fmt.printF(texts.log.decSucc1, [ resultPath ]);
  } catch(e) {
    fmt.printF(texts.log.error, [ e.message ]);
>>>>>>> 7a209b06e7e4446c60828323a3999e3249a2b4a9
    delFolderSync(resultPath)
  }
}

<<<<<<< HEAD
function integrityTest(tP, log) {
  var ls = fs.readdirSync(tP),
    pass = !0;

  if (ls.indexOf('level.dat') == -1)
    pass = !1,
      log('level.dat');

  if (ls.indexOf('db') == -1 || !fs.statSync(pathLib.join(tP, 'db')).isDirectory())
    pass = !1,
      log('db/');
  else {
    ls = fs.readdirSync(pathLib.join(tP, 'db'));
    var flag = 0x3;
    for (var i = 0; i < ls.length; i++) {
      if (/^MANIFEST-[0-9]{6}$/.test(ls[i])) flag &= 0x6;
      if (/^CURRENT$/.test(ls[i])) flag &= 0x5;
      if (!flag) break;
=======
function integrityTest(tP, log){
  var ls = fs.readdirSync(tP),
      pass = !0;

  if(ls.indexOf('level.dat') == -1)
    pass = !1,
    log('level.dat');

  if(ls.indexOf('db') == -1 || !fs.statSync(pathLib.join(tP, 'db')).isDirectory())
    pass = !1,
    log('db/');
  else {
    ls = fs.readdirSync(pathLib.join(tP, 'db'));
    var flag = 0x3;
    for(var i = 0;i < ls.length;i++){
      if(/^MANIFEST-[0-9]{6}$/.test(ls[i])) flag &= 0x6;
      if(/^CURRENT$/.test(ls[i])) flag &= 0x5;
      if(!flag) break;
>>>>>>> 7a209b06e7e4446c60828323a3999e3249a2b4a9
    }
    (flag & 0x1) ? (log('db/MANIFEST-*'), pass = !1) : 0;
    (flag & 0x2) ? (log('db/CURRENT'), pass = !1) : 0;
  }
<<<<<<< HEAD

  return pass;
}

function avalTest(tP) {
  var ls = fs.readdirSync(tP),
    pass = !0;

  if (ls.indexOf('db') == -1 || !fs.statSync(pathLib.join(tP, 'db')).isDirectory())
    pass = !1;
  else {
    ls = fs.readdirSync(pathLib.join(tP, 'db'));
    for (var i = 0; i < ls.length; i++) {
      if (/.ldb$/.test(ls[i])) {
        var tmp = fs.readFileSync(pathLib.join(tP, 'db', ls[i]));
        if (tmp.length < 8) pass = !1;
        if (tmp.readBigUInt64BE(tmp.length - 8) != 0x57FB808B247547DBn) pass = !1;
        if (!pass) break;
      }
    }
  }

=======
  
  return pass;
}

function avalTest(tP){
  var ls = fs.readdirSync(tP),
      pass = !0;

  if(ls.indexOf('db') == -1 || !fs.statSync(pathLib.join(tP, 'db')).isDirectory())
    pass = !1;
  else {
    ls = fs.readdirSync(pathLib.join(tP, 'db'));
    for(var i = 0;i < ls.length;i++){
      if(/.ldb$/.test(ls[i])){
        var tmp = fs.readFileSync(pathLib.join(tP, 'db', ls[i]));
        if(tmp.length < 8) pass = !1;
        if(tmp.readBigUInt64BE(tmp.length - 8) != 0x57FB808B247547DBn) pass = !1;
        if(!pass) break;
      }
    }
  }
  
>>>>>>> 7a209b06e7e4446c60828323a3999e3249a2b4a9
  return pass;
}
