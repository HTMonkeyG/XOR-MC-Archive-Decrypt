function checkFileIsEncrypt(buf){
  if(buf.readUInt32LE && (buf.readUInt32BE(0) == 0x801D3001 || buf.readUInt32BE(0) == 0x901D3001)) return !0;
  else return !1
}

function encryptFile(buf, key){
  if(key.length != 8) return !1;
  if(!key || !key.length)
    key = [ 0x31, 0x35, 0x38, 0x39, 0x32, 0x33, 0x38, 0x38 ];
  
  var ret = Buffer.from(buf),
      magicNum = Buffer.from([0x80, 0x1D, 0x30, 0x01]);

  for(var i = 0;i < ret.length;i++)
    ret[i] ^= key[i % 8];

  ret = Buffer.concat(magicNum, ret);

  return ret;
}

function decryptFile(buf, key){
  if(!key || !key.length)
    key = Buffer.from('88329851');
  else key = Buffer.from(key);
  
  var ret = Buffer.from(buf);

  if(!checkFileIsEncrypt(buf)) return !1;

  ret = ret.subarray(4);

  for(var i = 0;i < ret.length;i++)
    ret[i] ^= key[i % key.length];

  return ret;
}

exports.checkFileIsEncrypt = checkFileIsEncrypt,
exports.decryptFile = decryptFile,
exports.encryptFile = encryptFile;
