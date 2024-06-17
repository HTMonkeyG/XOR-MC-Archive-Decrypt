/****************************************
 *
 * XOR (eXtra Octopus Resistor) MCNE存档加解密工具 
 * - 叙事者工具包
 * 
 * By HTMonkeyG
 *
****************************************/

"use strict";

/* 导入模块 */
const fs = require('fs'),
  rl = require('readline'),
  process = require('process'),
  pathLib = require('path'),
  fmt = require('./includes/tFormat.js'),
  texts = require('./includes/text.js'),
  XOR = require('./includes/XOREncryptHelper.js');

/* 全局变量 */
var path = '';

var UI = rl.promises.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '\x1b[0m> ',
});
const printf = fmt.printF;

/* 文件夹操作 */
function copyFolderSync(source, target, disp) {
  if (!fs.existsSync(source))
    return !1;
  if (!fs.existsSync(target))
    fs.mkdirSync(target);
  var fileList = [];
  // This function  is for progress bar lol
  (function prepareList(sourcePath, targetPath, fls) {
    var ls = fs.readdirSync(sourcePath);
    ls.forEach((file) => {
      var sP = pathLib.join(sourcePath, file);
      var tP = pathLib.join(targetPath, file);
      var st = fs.statSync(sP);
      if (st.isFile())
        fls.push(sP);
      else if (st.isDirectory())
        fs.existsSync(tP) || fs.mkdirSync(tP),
          prepareList(sP, tP, fls)
    });
  })(source, target, fileList);
  fileList.forEach((file, i) => {
    var tP = pathLib.join(target, pathLib.relative(source, file));
    fs.copyFileSync(file, tP),
      disp(pathLib.relative(tP, file), fileList.length ? i / fileList.length : 0)
  })
}

function delFolderSync(target) {
  if (fs.existsSync(target)) {
    var ls = fs.readdirSync(target);
    ls.forEach((a) => {
      var p = pathLib.join(target, a);
      if (fs.statSync(p).isDirectory())
        delFolderSync(p);
      else
        fs.unlinkSync(p);
    });
    fs.rmdirSync(target);
  }
}

printf(texts.log.welcome);

UI.on('close', function () { printf(texts.log.exit); process.exit(0); });

async function main() {
  while (1) {
    printf(texts.log.tip1);

    path = (await UI.question(UI.getPrompt())).trim();
    path = pathLib.resolve('', path);

    printf(texts.log.targetPath, [path]);

    if (fs.existsSync(path) && fs.statSync(path).isDirectory()) {
      printf(texts.log.test);
      if (!integrityTest(path, function (a) {
        printf(texts.log.missing, [a])
      })) {
        printf(texts.log.testFail);
        continue;
      }
      else
        printf(texts.log.testSucc);
    } else {
      printf(texts.log.targetInvalid);
      continue;
    }

    var op = await UI.question(UI.getPrompt());
    op = Number(op);

    switch (op) {
      case 0:
        await defaultDecrypt();
        break
      case 1:
        await defaultEncrypt();
        break
      case 2:
        printf(texts.log.tip3);

        var txt = await UI.question(UI.getPrompt())
          , key = fmt.hex2buf(txt)
          , a;

        if (txt.length) {
          if (!key) {
            printf(texts.log.invalidKey);
            break
          }

          // Cut key into 8 bytes
          (key.length > 8) && (key = key.subarray(-8, 0));
          // Left align key
          (key.length < 8) && (a = Buffer.alloc(8), key.copy(a, 8 - key.length, a.length - 8), key = a);

          console.log(key)
          await activeDecrypt(key);
          break
        } else {
          printf(texts.log.autoKey);
          await activeDecrypt(!1);
          break
        }
      default:
        printf(texts.log.invalidOp);
        break;
    }
    fmt.printF(texts.log.finish);
    await UI.question('');
  }
}

main();

/**
 * 使用给定的key解密$path/db中的所有文件
 * @param {Buffer} keyIn - 给定的key
 */
async function activeDecrypt(keyIn) {
  var preprocess = await preprocessDir(path, 0)
    , encrypted = preprocess.encrypted
    , resultPath = preprocess.dstPath;

  if (!encrypted.length) {
    printf(texts.log.noEncFile);
    return
  }
  if (encrypted.length <= 3)
    printf(texts.log.le3EncFile, [encrypted.join(', ')]);
  else
    printf(texts.log.gt3EncFile, [encrypted.slice(0, 3).join(', '), encrypted.length]);

  printf(texts.log.createFolder);
  // Delete the existing folder
  fs.existsSync(resultPath) && (printf(texts.log.delExistFolder), delFolderSync(resultPath));
  try {
    cloneFolder(path, resultPath);

    if (!keyIn) {
      // 主动获取密钥
      printf(texts.log.tryGetKey);

      // 使用CURRENT文件的后16字节(去除了32位魔数)
      // 和MANIFEST文件的文件名取异或
      var buf1 = preprocess.before
        , buf2 = preprocess.after.subarray(4);

      // 长度不等
      if (buf1.length != buf2.length) {
        printf(texts.log.getKeyFail);
        delFolderSync(resultPath);
        return
      }

      // 异或
      for (var i = 0; i < buf1.length; i++)
        buf1[i] ^= buf2[i];

      // 密钥只能为8字节，共16字节的文件应该重复两次
      if (Buffer.compare(buf1.subarray(0, 8), buf1.subarray(8))) {
        printf(texts.log.getKeyFail);
        delFolderSync(resultPath);
        return
      }
      key = buf1.subarray(0, 8);
      printf(texts.log.getKeySucc, ['0x' + key.toString('hex')])
    } else
      key = keyIn;

    printf(texts.log.decrypting);
    console.log('\n');
    encrypted.forEach((a, b) => {
      fmt.limPrgBar('§6' + a, b / encrypted.length);
      var filePath = pathLib.join(path, 'db', a)
        , buf = XOR.decryptFile(fs.readFileSync(filePath), key);
      if (buf)
        fs.writeFileSync(filePath, buf);
      else
        throw new Error('Unknown Decrypt Error');
    });
    fmt.limPrgBar('§bDone.', 1);
    printf(texts.log.avalTest);
    avalTest(resultPath) ? printf(texts.log.avalTestSucc) : printf(texts.log.avalTestFail);
    printf(texts.log.decSucc1, [resultPath]);
  } catch (e) {
    printf(texts.log.error, [e.message]);
    delFolderSync(resultPath)
  }
}

async function defaultEncrypt() {
  printf(texts.log.tip5);

  var preprocess = await preprocessDir(path, 0)
    , preEnc = preprocess.decrypted
    , resultPath = preprocess.dstPath;

  if (preprocess.encrypted.length) {
    printf(texts.log.foundEncFile);
    return
  }
  if (!preEnc.length) {
    printf(texts.log.noToEncFile);
    return
  }

  printf(texts.log.readyToEnc);
  if (!await createTargetFolder(resultPath)) return;

  try {
    cloneFolder(path, resultPath);

    printf(texts.log.encrypting);
    console.log('\n');
    preEnc.forEach((a, b) => {
      fmt.limPrgBar('§6' + a, b / preEnc.length);
      var buf = XOR.encryptFile(fs.readFileSync(pathLib.join(path, 'db', a)));
      if (buf)
        fs.writeFileSync(pathLib.join(resultPath, 'db', a), buf);
      else
        throw new Error('Unknown Decrypt Error');
    });
    fmt.limPrgBar('§bDone.', 1);
    printf(texts.log.encSucc1, [resultPath]);
  } catch (e) {
    printf(texts.log.error, [e.message]);
    delFolderSync(resultPath)
  }
}

async function defaultDecrypt() {
  printf(texts.log.tip2);

  var preprocess = await preprocessDir(path, 0)
    , encrypted = preprocess.encrypted
    , resultPath = preprocess.dstPath;

  if (!encrypted.length) {
    printf(texts.log.noEncFile);
    return
  } else if (encrypted.length <= 3)
    printf(texts.log.le3EncFile, [encrypted.join(', ')]);
  else
    printf(texts.log.gt3EncFile, [encrypted.slice(0, 3).join(', '), encrypted.length]);

  if (!await createTargetFolder(resultPath)) return;

  try {
    cloneFolder(path, resultPath);

    printf(texts.log.decrypting);

    console.log('\n');
    encrypted.forEach((a, b) => {
      fmt.limPrgBar('§6' + a, b / encrypted.length);
      var filePath = pathLib.join(resultPath, 'db', a)
        , buf = XOR.decryptFile(fs.readFileSync(filePath));
      if (buf)
        fs.writeFileSync(pathLib.join(resultPath, 'db', a), buf);
      else
        throw new Error('Unknown Decrypt Error');
    });
    fmt.limPrgBar('§bDone.', 1);

    printf(texts.log.avalTest);
    avalTest(resultPath) ? printf(texts.log.avalTestSucc) : printf(texts.log.avalTestFail);
    printf(texts.log.decSucc1, [resultPath]);
  } catch (e) {
    printf(texts.log.error, [e.message]);
    delFolderSync(resultPath)
  }
}

function integrityTest(tP, missing) {
  var ls = fs.readdirSync(tP),
    pass = !0;

  if (ls.indexOf('level.dat') == -1)
    pass = !1,
      missing('level.dat');

  if (ls.indexOf('db') == -1 || !fs.statSync(pathLib.join(tP, 'db')).isDirectory())
    pass = !1,
      missing('db/');
  else {
    ls = fs.readdirSync(pathLib.join(tP, 'db'));
    var flag = 0x3;
    for (var i = 0; i < ls.length; i++) {
      if (/^MANIFEST-[0-9]{6}$/.test(ls[i])) flag &= 0x6;
      if (/^CURRENT$/.test(ls[i])) flag &= 0x5;
      if (!flag) break;
    }
    (flag & 0x1) ? (missing('db/MANIFEST-*'), pass = !1) : 0;
    (flag & 0x2) ? (missing('db/CURRENT'), pass = !1) : 0;
  }

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

  return pass;
}

async function preprocessDir(path, mode) {
  var lPath = pathLib.join(path, 'db')
    , ls = fs.readdirSync(lPath)
    , encrypted = []
    , decrypted = []
    , descFileName = ''
    , curFileContent = null
    , targetPath = pathLib.join(path, '..', pathLib.basename(path) + (mode ? '_Dec' : '_Enc'));

  printf(texts.log.scanning);

  for (var file of ls) {
    // Files except these wont be proccessed
    if (!/^MANIFEST-[0-9]{6}$/.test(file) && !/^CURRENT$/.test(file) && !/^[0-9]{6}.ldb$/.test(file)) continue;
    var filePath = pathLib.join(lPath, file);
    if (fs.statSync(filePath).isFile()) {
      var tempBuf = fs.readFileSync(filePath);
      XOR.checkFileIsEncrypt(tempBuf) ? encrypted.push(file) : decrypted.push(file);
      /^MANIFEST/.test(file) && (descFileName = file + '\n');
      /^CURRENT/.test(file) && (curFileContent = tempBuf);
    }
  }

  return {
    encrypted: encrypted,
    decrypted: decrypted,
    srcPath: lPath,
    dstPath: targetPath,
    before: Buffer.from(descFileName),
    after: curFileContent
  }
}

async function createTargetFolder(path) {
  printf(texts.log.createFolder);
  // Delete the existing folder
  if (fs.existsSync(path)) {
    printf(texts.log.delExistFolder);
    if ((await UI.question(UI.getPrompt())).trim().toLocaleLowerCase() != "y") return false;
    delFolderSync(path);
    return true
  }
  return true
}

function cloneFolder(path, resultPath) {
  printf(texts.log.cpFile);
  console.log('\n');
  copyFolderSync(path, resultPath, (a, b) => fmt.limPrgBar('§6' + a, b));
  fmt.limPrgBar('§bDone.', 1);
}