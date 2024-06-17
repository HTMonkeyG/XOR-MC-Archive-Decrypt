/*
  MIT License

  Copyright (c) 2024 HTMonkeyG

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.
*/

const proc = require('process')
  , rl = require('readline');

/**
 * Turns given RGB value into terminal format code
 * @param {Number} r 
 * @param {Number} g 
 * @param {Number} b 
 * @returns {String}
 */
function rgb(r, g, b) { return `\x1b[38;2;${r};${g};${b};m` }

/**
 * Turns MCBE format code in given text to terminal format code,
 * and print it to console
 * @param {String} text - Input
 * @returns {String} Result
 */
function mcFmtLog(text) { var res = mcFmtCode(text); console.log(res); return res }

/**
 * Shortcut for using translateF() first and then call console.log()
 * @param {String} text - Input
 * @param {String[]} replace - Replacement array
 * @returns {String} Result
 */
function printF(text, replace) {
  var ret;
  console.log(ret = translateF(text, replace));
  return ret
}

/**
 * printF() with process.stdout.write() instead
 * @param {String} text - Input
 * @param {String[]} replace - Replacement array
 * @returns {String} Result
 */
function stdoutF(text, replace) {
  var ret;
  process.stdout.write(ret = '' + translateF(text, replace));
  return ret
}

/**
 * Format text with replacement
 * @param {String} text - Input
 * @param {String[]} replace - Replacement array
 * @returns {String} Result
 */
function translateF(txt, replace) {
  var ret = '';
  if (txt == void 0 || !txt.length) return '';
  for (var i = 0; i < txt.length; i++) {
    if (txt[i] == '%')
      (txt[i + 1] != void 0 && /[0-9]+/.test(txt[i + 1])) ? (ret += (replace[txt[i + 1]].toString() || ''), i++) : ret += '%';
    else
      ret += txt[i]
  }
  return mcFmtCode(ret);
}

function hex2buf(txt) {
  if (typeof (txt) !== 'string')
    return !1;
  txt = txt.replace(/^(0x|0X)/, '');
  (txt.length & 1) && (txt = '0' + txt);
  var ret = Buffer.from(txt, 'hex');
  if (!ret.length) return !1;
  if (ret.length != (txt.length >> 1))
    return !1;
  return ret
}

function mcFmtCode(txt) {
  function code2console(a) {
    var table = { '0': '\x1b[30m', '1': '\x1b[34m', '2': '\x1b[32m', '3': '\x1b[36m', '4': '\x1b[31m', '5': '\x1b[35m', '6': '\x1b[33m', '7': '\x1b[37m', '8': '\x1b[90m', '9': '\x1b[94m', 'a': '\x1b[92m', 'b': '\x1b[96m', 'c': '\x1b[91m', 'd': '\x1b[95m', 'e': '\x1b[93m', 'f': '\x1b[97m', 'g': '\x1b[38;2;221;214;5;m', 'l': '\x1b[1m', 'r': '\x1b[0m' };
    return table[a] || ''
  }
  var ret = '';
  if (!txt.length) return '';
  for (var i = 0; i < txt.length; i++) {
    if (txt[i] == '§')
      (txt[i + 1] == void 0) ? ret += '§' : (ret += code2console(txt[i + 1]), i++);
    else
      ret += txt[i]
  }
  return ret
}

function fmtDate(date) {
  var d = new Date(date);
  var Y = date.getFullYear();
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
  var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
  var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours());
  var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
  var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
  return '' + Y + M + D + h + m + s;
}

/**
 * Creates a progress bar
 * @param {String} title - Title text
 * @param {Number} percent - Percentage
 * @param {Number} [length] - Length limit
 */
function limPrgBar(title, percent, length) {
  var txt = '', a;
  typeof (length) == 'number' ? (length > proc.stdout.columns && (length = proc.stdout.columns)) : (length = proc.stdout.columns);
  typeof (percent) != 'number' && (percent = 0);
  percent > 1 && (percent = 1);
  rl.moveCursor(proc.stdout, 0, -2);
  rl.clearLine(proc.stdout)
  if (title.length > length)
    txt = '…' + title.slice(-length + 1)
  else
    txt = title;
  printF(txt);
  txt = '§9[§b';
  for (a = 0; a < (length - 10); a++) {
    if ((a / (length - 10)) < percent) txt += '=';
    else txt += ' '
  }
  txt += '§9] §1' + (Math.ceil(percent * 1000) / 10).toFixed(1) + '%';
  printF(txt)
}

exports.rgb = rgb,
  exports.fmtDate = fmtDate,
  exports.printF = printF,
  exports.stdoutF = stdoutF,
  exports.translateF = translateF,
  exports.mcFmtCode = mcFmtCode,
  exports.mcFmtLog = mcFmtLog,
  exports.hex2buf = hex2buf,
  exports.limPrgBar = limPrgBar;