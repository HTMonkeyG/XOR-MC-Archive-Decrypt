function rgb(r, g, b){
  return `\x1b[38;2;${r};${g};${b};m`
}

function mcFmtLog(txt){
  console.log(mcFmtCode(txt))
}

function printF(txt, arr){
  var ret = '';
  if(txt == void 0 || !txt.length) return '';
  for(var i = 0;i < txt.length;i++){
   if(txt[i] == '\\')
      (txt[i + 1] == void 0) ? ret += '\\' : (ret += txt[i+1], i++);
   else if(txt[i] == '%')
      (txt[i + 1] == void 0) ? ret += '%' : (ret += (arr[txt[i + 1]] || ''), i++); 
    else
      ret += txt[i]
  }
  ret = mcFmtCode(ret),
  console.log(ret);
}

function hex2buf(txt){
  if(typeof(txt) !== 'string')
    return !1;
  txt = txt.replace(/^(0x|0X)/, '');
  (txt.length & 1) && (txt = '0' + txt);
  var ret = Buffer.from(txt, 'hex');
  if(!ret.length) return !1;
  if(ret.length != (txt.length >> 1))
    return !1;
  return ret
}

function mcFmtCode(txt){
  function code2console(a){
    switch(a){
      case '0':
        return '\x1b[30m';
      case '1':
        return '\x1b[34m';
      case '2':
        return '\x1b[32m';
      case '3':
        return '\x1b[36m';
      case '4':
        return '\x1b[31m';
      case '5':
        return '\x1b[35m';
      case '6':
        return '\x1b[33m';
      case '7':
        return '\x1b[37m';
      case '8':
        return '\x1b[90m';
      case '9':
        return '\x1b[94m';
      case 'a':
        return '\x1b[92m';
      case 'b':
        return '\x1b[96m';
      case 'c':
        return '\x1b[91m';
      case 'd':
        return '\x1b[95m';
      case 'e':
        return '\x1b[93m';
      case 'f':
        return '\x1b[97m';
      case 'g':
        return '\x1b[38;2;221;214;5;m';
      default:
        return '';
    }
  }
  var ret = '';
  if(!txt.length) return '';
  for(var i = 0;i < txt.length;i++){
    if(txt[i] == '§')
      (txt[i + 1] == void 0) ? ret += '§' : (ret += code2console(txt[i + 1]), i++ );
    else
      ret += txt[i]
  }
  return ret
}

function fmtDate(date) {
  var d = new Date(date);
  var Y = date.getFullYear();
  var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1):date.getMonth()+1);
  var D = (date.getDate()<10 ? '0'+date.getDate():date.getDate());
  var h = (date.getHours()<10 ? '0'+date.getHours():date.getHours());
  var m = (date.getMinutes()<10 ? '0'+date.getMinutes():date.getMinutes());
  var s = date.getSeconds()<10 ? '0'+date.getSeconds():date.getSeconds();
  return ''+Y+M+D+h+m+s;
}

exports.rgb = rgb,
exports.fmtDate = fmtDate,
exports.printF = printF,
exports.mcFmtCode = mcFmtCode,
exports.mcFmtLog = mcFmtLog,
exports.hex2buf = hex2buf;
