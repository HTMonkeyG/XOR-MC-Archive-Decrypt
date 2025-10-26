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
const fs = require('fs')
  , rl = require('readline')
  , ps = require('process')
  , pl = require('path')
  , fmt = require('./includes/tFormat.js')
  , texts = require('./includes/text.js')
  , XOR = require('./includes/XOREncryptHelper.js')
  , printf = fmt.printF;

/* 全局变量 */
var path = ''
  , argv = ps.argv.slice(2)
  , UI = rl.promises.createInterface({
    input: ps.stdin,
    output: ps.stdout,
    prompt: '\x1b[0m> ',
  });

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
      var sP = pl.join(sourcePath, file);
      var tP = pl.join(targetPath, file);
      var st = fs.statSync(sP);
      if (st.isFile())
        fls.push(sP);
      else if (st.isDirectory())
        fs.existsSync(tP) || fs.mkdirSync(tP),
          prepareList(sP, tP, fls)
    });
  })(source, target, fileList);
  fileList.forEach((file, i) => {
    var tP = pl.join(target, pl.relative(source, file));
    fs.copyFileSync(file, tP);
    disp(pl.relative(source, file), fileList.length ? i / fileList.length : 0)
  })
}

function delFolderSync(target) {
  if (fs.existsSync(target)) {
    var ls = fs.readdirSync(target);
    ls.forEach((a) => {
      var p = pl.join(target, a);
      if (fs.statSync(p).isDirectory())
        delFolderSync(p);
      else
        fs.unlinkSync(p);
    });
    fs.rmdirSync(target);
  }
}

function parseArgv(arg) {
  var result = {}, next = false, name;
  for (var a of arg) {
    if (/^\-/.test(a.trim())) {
      next = true, name = a.trim();
      result[name] = '';
      continue
    }
    if (next)
      result[name] = a;
  }

  return result
}

function parseHexKeyInput(input) {
  if (typeof input != 'string')
    return null;
  var normalized = input.trim();
  if (!normalized.length)
    return null;
  var key = fmt.hex2buf(normalized);
  if (!key || !key.length)
    return null;
  if (key.length > 8)
    key = key.subarray(key.length - 8);
  if (key.length < 8) {
    var padded = Buffer.alloc(8);
    key.copy(padded, 0);
    key = padded;
  }
  return Buffer.from(key);
}

printf(texts.log.welcome);

UI.on('close', function () { printf(texts.log.exit) });

async function main() {
  while (1) {
    // 获取路径输入
    printf(texts.log.tip1);
    if (!argv[0]) {
      path = await UI.question(UI.getPrompt());
    } else
      path = argv[0], argv[0] = null, printf(UI.getPrompt() + path);

    // 解析路径
    path = pl.resolve('', path.trim());
    printf(texts.log.targetPath, [path]);

    // 测试存档完整性
    if (fs.existsSync(path) && fs.statSync(path).isDirectory()) {
      printf(texts.log.test);
      if (!integrityTest(path)) {
        printf(texts.log.testFail);
        continue;
      } else
        printf(texts.log.testSucc), printf(texts.log.selectOperation);
    } else {
      printf(texts.log.targetInvalid);
      continue;
    }

    // 获取操作类型
    var op;
    if (typeof argv[1] != 'string')
      op = await UI.question(UI.getPrompt());
    else
      op = argv[1], argv[1] = null, printf(UI.getPrompt() + op);
    op = Number(op.trim());

    // 执行对应操作
    switch (op) {
      case 0:
        await defaultDecrypt();
        break;
      case 1:
        await defaultEncrypt();
        break;
      case 2: {
        printf(texts.log.tip3);

        var txt;
        if (!argv[2])
          txt = await UI.question(UI.getPrompt());
        else
          txt = argv[2], printf(UI.getPrompt() + argv[2]), argv[2] = null;

        txt = (typeof txt == 'string') ? txt.trim() : '';

        if (txt.length) {
          var key = parseHexKeyInput(txt);
          if (!key) {
            printf(texts.log.invalidKey);
            continue;
          }
          printf(texts.log.tip4);
          await activeDecrypt(key);
          break;
        } else {
          printf(texts.log.autoKey);
          printf(texts.log.tip4);
          await activeDecrypt(!1);
          break;
        }
      }
      case 3: {
        printf(texts.log.tip6);

        var keyInput;
        if (!argv[2])
          keyInput = await UI.question(UI.getPrompt());
        else
          keyInput = argv[2], printf(UI.getPrompt() + argv[2]), argv[2] = null;

        keyInput = (typeof keyInput == 'string') ? keyInput.trim() : '';
        var encKey = parseHexKeyInput(keyInput);
        if (!encKey) {
          printf(texts.log.invalidKey);
          continue;
        }

        printf(texts.log.tip7);
        await activeEncrypt(encKey);
        break;
      }
      default:
        printf(texts.log.invalidOp);
        continue;
    }

    if (argv[4]) {
      UI.question(fmt.translateF(texts.log.finish));
      UI.close();
      break;
    } else
      await UI.question(fmt.translateF(texts.log.finish));
  }
}

main();

/**
 * 使用给定的key解密$path/db中的所有文件
 * @param {Buffer} keyIn - 给定的key
 */
async function activeDecrypt(keyIn) {
  var preprocess = await preprocessDir(path, 1)
    , encrypted = preprocess.encrypted
    , resultPath = preprocess.dstPath
    , key = null;

  if (!encrypted.length) {
    printf(texts.log.noEncFile);
    return
  }

  if (encrypted.length <= 3)
    printf(texts.log.le3EncFile, [encrypted.join(', ')]);
  else
    printf(texts.log.gt3EncFile, [encrypted.slice(0, 3).join(', '), encrypted.length]);

  // 删除已存在文件夹
  if (!await createTargetFolder(resultPath)) return;

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
      fmt.limPrgBar('§6' + a, b / encrypted.length, Math.floor(ps.stdout.columns * 0.75));
      var filePath = pl.join(resultPath, 'db', a)
        , buf = XOR.decryptFile(fs.readFileSync(filePath), key);
      if (buf)
        fs.writeFileSync(filePath, buf);
      else
        throw new Error('Unknown Decrypt Error');
    });
    fmt.limPrgBar('§bDone.', 1, Math.floor(ps.stdout.columns * 0.75));
    printf(texts.log.avalTest);
    avalTest(resultPath) ? printf(texts.log.avalTestSucc) : printf(texts.log.avalTestFail);
    printf(texts.log.decSucc1, [resultPath]);
  } catch (e) {
    printf(texts.log.error, [e.message]);
    delFolderSync(resultPath)
  }
}

/** 使用自定义密钥加密文件夹 */
async function activeEncrypt(key) {
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
      fmt.limPrgBar('§6' + a, b / preEnc.length, Math.floor(ps.stdout.columns * 0.75));
      var filePath = pl.join(resultPath, 'db', a)
        , buf = XOR.encryptFile(fs.readFileSync(filePath), key);
      if (buf)
        fs.writeFileSync(filePath, buf);
      else
        throw new Error('Unknown Encrypt Error');
    });
    fmt.limPrgBar('§bDone.', 1, Math.floor(ps.stdout.columns * 0.75));
    printf(texts.log.encSucc1, [resultPath]);
  } catch (e) {
    printf(texts.log.error, [e.message]);
    delFolderSync(resultPath)
  }
}

/** 使用默认密钥加密文件夹 */
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
      fmt.limPrgBar('§6' + a, b / preEnc.length, Math.floor(ps.stdout.columns * 0.75));
      var filePath = pl.join(resultPath, 'db', a)
        , buf = XOR.encryptFile(fs.readFileSync(filePath));
      if (buf)
        fs.writeFileSync(filePath, buf);
      else
        throw new Error('Unknown Decrypt Error');
    });
    fmt.limPrgBar('§bDone.', 1, Math.floor(ps.stdout.columns * 0.75));
    printf(texts.log.encSucc1, [resultPath]);
  } catch (e) {
    printf(texts.log.error, [e.message]);
    delFolderSync(resultPath)
  }
}

/** 使用默认密钥解密文件夹 */
async function defaultDecrypt() {
  printf(texts.log.tip2);

  var preprocess = await preprocessDir(path, 1)
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
      fmt.limPrgBar('§6' + a, b / encrypted.length, Math.floor(ps.stdout.columns * 0.75));
      var filePath = pl.join(resultPath, 'db', a)
        , buf = XOR.decryptFile(fs.readFileSync(filePath));
      if (buf)
        fs.writeFileSync(pl.join(resultPath, 'db', a), buf);
      else
        throw new Error('Unknown Decrypt Error');
    });
    fmt.limPrgBar('§bDone.', 1, Math.floor(ps.stdout.columns * 0.75));

    printf(texts.log.avalTest);
    avalTest(resultPath) ? printf(texts.log.avalTestSucc) : printf(texts.log.avalTestFail);
    printf(texts.log.decSucc1, [resultPath]);
  } catch (e) {
    printf(texts.log.error, [e.message]);
    delFolderSync(resultPath)
  }
}

/** 检测存档完整性 */
function integrityTest(targetPath) {
  var ls = fs.readdirSync(targetPath),
    pass = !0;

  if (ls.indexOf('level.dat') == -1) {
    printf(texts.log.missing, ['level.dat']);
    return false
  } else if (ls.indexOf('db') == -1 || !fs.statSync(pl.join(targetPath, 'db')).isDirectory()) {
    printf(texts.log.missing, ['db/']);
    return false
  } else {
    ls = fs.readdirSync(pl.join(targetPath, 'db'));
    var flag = 0b11;
    for (var file of ls) {
      if (/^MANIFEST-[0-9]{6}$/.test(file)) flag &= 0b10;
      if (/^CURRENT$/.test(file)) flag &= 0b01;
      if (!flag) break;
    }
    (flag & 0x1) && (printf(texts.log.missing, ['db/MANIFEST-*']), pass = !1);
    (flag & 0x2) && (printf(texts.log.missing, ['db/CURRENT']), pass = !1);
  }

  return pass;
}

function avalTest(targetPath) {
  var ls = fs.readdirSync(targetPath);

  if (ls.indexOf('db') == -1 || !fs.statSync(pl.join(targetPath, 'db')).isDirectory())
    return false
  else {
    ls = fs.readdirSync(pl.join(targetPath, 'db'));
    for (var file of ls) {
      if (/.ldb$/.test(file)) {
        var tmp = fs.readFileSync(pl.join(targetPath, 'db', file));
        if (tmp.length < 8) return false;
        if (tmp.readBigUInt64BE(tmp.length - 8) != 0x57FB808B247547DBn) return false;
      }
    }
  }

  return true;
}

async function preprocessDir(path, mode) {
  var lPath = pl.join(path, 'db')
    , ls = fs.readdirSync(lPath)
    , encrypted = []
    , decrypted = []
    , descFileName = ''
    , curFileContent = null
    , targetPath = pl.join(path, '..', pl.basename(path) + (mode ? '_Dec' : '_Enc'));

  printf(texts.log.scanning);

  for (var file of ls) {
    // Files except these wont be proccessed
    if (!/^MANIFEST-[0-9]{6}$/.test(file) && !/^CURRENT$/.test(file) && !/^[0-9]{6}.ldb$/.test(file)) continue;
    var filePath = pl.join(lPath, file);
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
  // 删除已存在文件夹
  if (fs.existsSync(path)) {
    printf(texts.log.delExistFolder);
    if (argv[3]) {
      printf(UI.getPrompt() + argv[3]);
      if (argv[3].trim().toLocaleLowerCase() != "y")
        return false;
    } else
      if ((await UI.question(UI.getPrompt())).trim().toLocaleLowerCase() != "y")
        return false;
    delFolderSync(path);
    return true
  }
  return true
}

function cloneFolder(path, resultPath) {
  printf(texts.log.cpFile);
  console.log('\n');
  copyFolderSync(path, resultPath, (a, b) => fmt.limPrgBar('§6' + a, b, Math.floor(ps.stdout.columns * 0.75)));
  fmt.limPrgBar('§bDone.', 1, Math.floor(ps.stdout.columns * 0.75));
}