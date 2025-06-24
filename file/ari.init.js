$(document).ready(function() {
    /*
 * JavaScript MD5
 * https://github.com/blueimp/JavaScript-MD5
 *
 * Copyright 2011, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * https://opensource.org/licenses/MIT
 *
 * Based on
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 */

/* global define */

;(function ($) {
  'use strict'

  /*
  * Add integers, wrapping at 2^32. This uses 16-bit operations internally
  * to work around bugs in some JS interpreters.
  */
  function safeAdd (x, y) {
    var lsw = (x & 0xffff) + (y & 0xffff)
    var msw = (x >> 16) + (y >> 16) + (lsw >> 16)
    return (msw << 16) | (lsw & 0xffff)
  }

  /*
  * Bitwise rotate a 32-bit number to the left.
  */
  function bitRotateLeft (num, cnt) {
    return (num << cnt) | (num >>> (32 - cnt))
  }

  /*
  * These functions implement the four basic operations the algorithm uses.
  */
  function md5cmn (q, a, b, x, s, t) {
    return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b)
  }
  function md5ff (a, b, c, d, x, s, t) {
    return md5cmn((b & c) | (~b & d), a, b, x, s, t)
  }
  function md5gg (a, b, c, d, x, s, t) {
    return md5cmn((b & d) | (c & ~d), a, b, x, s, t)
  }
  function md5hh (a, b, c, d, x, s, t) {
    return md5cmn(b ^ c ^ d, a, b, x, s, t)
  }
  function md5ii (a, b, c, d, x, s, t) {
    return md5cmn(c ^ (b | ~d), a, b, x, s, t)
  }

  /*
  * Calculate the MD5 of an array of little-endian words, and a bit length.
  */
  function binlMD5 (x, len) {
    /* append padding */
    x[len >> 5] |= 0x80 << (len % 32)
    x[((len + 64) >>> 9 << 4) + 14] = len

    var i
    var olda
    var oldb
    var oldc
    var oldd
    var a = 1732584193
    var b = -271733879
    var c = -1732584194
    var d = 271733878

    for (i = 0; i < x.length; i += 16) {
      olda = a
      oldb = b
      oldc = c
      oldd = d

      a = md5ff(a, b, c, d, x[i], 7, -680876936)
      d = md5ff(d, a, b, c, x[i + 1], 12, -389564586)
      c = md5ff(c, d, a, b, x[i + 2], 17, 606105819)
      b = md5ff(b, c, d, a, x[i + 3], 22, -1044525330)
      a = md5ff(a, b, c, d, x[i + 4], 7, -176418897)
      d = md5ff(d, a, b, c, x[i + 5], 12, 1200080426)
      c = md5ff(c, d, a, b, x[i + 6], 17, -1473231341)
      b = md5ff(b, c, d, a, x[i + 7], 22, -45705983)
      a = md5ff(a, b, c, d, x[i + 8], 7, 1770035416)
      d = md5ff(d, a, b, c, x[i + 9], 12, -1958414417)
      c = md5ff(c, d, a, b, x[i + 10], 17, -42063)
      b = md5ff(b, c, d, a, x[i + 11], 22, -1990404162)
      a = md5ff(a, b, c, d, x[i + 12], 7, 1804603682)
      d = md5ff(d, a, b, c, x[i + 13], 12, -40341101)
      c = md5ff(c, d, a, b, x[i + 14], 17, -1502002290)
      b = md5ff(b, c, d, a, x[i + 15], 22, 1236535329)

      a = md5gg(a, b, c, d, x[i + 1], 5, -165796510)
      d = md5gg(d, a, b, c, x[i + 6], 9, -1069501632)
      c = md5gg(c, d, a, b, x[i + 11], 14, 643717713)
      b = md5gg(b, c, d, a, x[i], 20, -373897302)
      a = md5gg(a, b, c, d, x[i + 5], 5, -701558691)
      d = md5gg(d, a, b, c, x[i + 10], 9, 38016083)
      c = md5gg(c, d, a, b, x[i + 15], 14, -660478335)
      b = md5gg(b, c, d, a, x[i + 4], 20, -405537848)
      a = md5gg(a, b, c, d, x[i + 9], 5, 568446438)
      d = md5gg(d, a, b, c, x[i + 14], 9, -1019803690)
      c = md5gg(c, d, a, b, x[i + 3], 14, -187363961)
      b = md5gg(b, c, d, a, x[i + 8], 20, 1163531501)
      a = md5gg(a, b, c, d, x[i + 13], 5, -1444681467)
      d = md5gg(d, a, b, c, x[i + 2], 9, -51403784)
      c = md5gg(c, d, a, b, x[i + 7], 14, 1735328473)
      b = md5gg(b, c, d, a, x[i + 12], 20, -1926607734)

      a = md5hh(a, b, c, d, x[i + 5], 4, -378558)
      d = md5hh(d, a, b, c, x[i + 8], 11, -2022574463)
      c = md5hh(c, d, a, b, x[i + 11], 16, 1839030562)
      b = md5hh(b, c, d, a, x[i + 14], 23, -35309556)
      a = md5hh(a, b, c, d, x[i + 1], 4, -1530992060)
      d = md5hh(d, a, b, c, x[i + 4], 11, 1272893353)
      c = md5hh(c, d, a, b, x[i + 7], 16, -155497632)
      b = md5hh(b, c, d, a, x[i + 10], 23, -1094730640)
      a = md5hh(a, b, c, d, x[i + 13], 4, 681279174)
      d = md5hh(d, a, b, c, x[i], 11, -358537222)
      c = md5hh(c, d, a, b, x[i + 3], 16, -722521979)
      b = md5hh(b, c, d, a, x[i + 6], 23, 76029189)
      a = md5hh(a, b, c, d, x[i + 9], 4, -640364487)
      d = md5hh(d, a, b, c, x[i + 12], 11, -421815835)
      c = md5hh(c, d, a, b, x[i + 15], 16, 530742520)
      b = md5hh(b, c, d, a, x[i + 2], 23, -995338651)

      a = md5ii(a, b, c, d, x[i], 6, -198630844)
      d = md5ii(d, a, b, c, x[i + 7], 10, 1126891415)
      c = md5ii(c, d, a, b, x[i + 14], 15, -1416354905)
      b = md5ii(b, c, d, a, x[i + 5], 21, -57434055)
      a = md5ii(a, b, c, d, x[i + 12], 6, 1700485571)
      d = md5ii(d, a, b, c, x[i + 3], 10, -1894986606)
      c = md5ii(c, d, a, b, x[i + 10], 15, -1051523)
      b = md5ii(b, c, d, a, x[i + 1], 21, -2054922799)
      a = md5ii(a, b, c, d, x[i + 8], 6, 1873313359)
      d = md5ii(d, a, b, c, x[i + 15], 10, -30611744)
      c = md5ii(c, d, a, b, x[i + 6], 15, -1560198380)
      b = md5ii(b, c, d, a, x[i + 13], 21, 1309151649)
      a = md5ii(a, b, c, d, x[i + 4], 6, -145523070)
      d = md5ii(d, a, b, c, x[i + 11], 10, -1120210379)
      c = md5ii(c, d, a, b, x[i + 2], 15, 718787259)
      b = md5ii(b, c, d, a, x[i + 9], 21, -343485551)

      a = safeAdd(a, olda)
      b = safeAdd(b, oldb)
      c = safeAdd(c, oldc)
      d = safeAdd(d, oldd)
    }
    return [a, b, c, d]
  }

  /*
  * Convert an array of little-endian words to a string
  */
  function binl2rstr (input) {
    var i
    var output = ''
    var length32 = input.length * 32
    for (i = 0; i < length32; i += 8) {
      output += String.fromCharCode((input[i >> 5] >>> (i % 32)) & 0xff)
    }
    return output
  }

  /*
  * Convert a raw string to an array of little-endian words
  * Characters >255 have their high-byte silently ignored.
  */
  function rstr2binl (input) {
    var i
    var output = []
    output[(input.length >> 2) - 1] = undefined
    for (i = 0; i < output.length; i += 1) {
      output[i] = 0
    }
    var length8 = input.length * 8
    for (i = 0; i < length8; i += 8) {
      output[i >> 5] |= (input.charCodeAt(i / 8) & 0xff) << (i % 32)
    }
    return output
  }

  /*
  * Calculate the MD5 of a raw string
  */
  function rstrMD5 (s) {
    return binl2rstr(binlMD5(rstr2binl(s), s.length * 8))
  }

  /*
  * Calculate the HMAC-MD5, of a key and some data (raw strings)
  */
  function rstrHMACMD5 (key, data) {
    var i
    var bkey = rstr2binl(key)
    var ipad = []
    var opad = []
    var hash
    ipad[15] = opad[15] = undefined
    if (bkey.length > 16) {
      bkey = binlMD5(bkey, key.length * 8)
    }
    for (i = 0; i < 16; i += 1) {
      ipad[i] = bkey[i] ^ 0x36363636
      opad[i] = bkey[i] ^ 0x5c5c5c5c
    }
    hash = binlMD5(ipad.concat(rstr2binl(data)), 512 + data.length * 8)
    return binl2rstr(binlMD5(opad.concat(hash), 512 + 128))
  }

  /*
  * Convert a raw string to a hex string
  */
  function rstr2hex (input) {
    var hexTab = '0123456789abcdef'
    var output = ''
    var x
    var i
    for (i = 0; i < input.length; i += 1) {
      x = input.charCodeAt(i)
      output += hexTab.charAt((x >>> 4) & 0x0f) + hexTab.charAt(x & 0x0f)
    }
    return output
  }

  /*
  * Encode a string as utf-8
  */
  function str2rstrUTF8 (input) {
    return unescape(encodeURIComponent(input))
  }

  /*
  * Take string arguments and return either raw or hex encoded strings
  */
  function rawMD5 (s) {
    return rstrMD5(str2rstrUTF8(s))
  }
  function hexMD5 (s) {
    return rstr2hex(rawMD5(s))
  }
  function rawHMACMD5 (k, d) {
    return rstrHMACMD5(str2rstrUTF8(k), str2rstrUTF8(d))
  }
  function hexHMACMD5 (k, d) {
    return rstr2hex(rawHMACMD5(k, d))
  }

  function md5 (string, key, raw) {
    if (!key) {
      if (!raw) {
        return hexMD5(string)
      }
      return rawMD5(string)
    }
    if (!raw) {
      return hexHMACMD5(key, string)
    }
    return rawHMACMD5(key, string)
  }

  if (typeof define === 'function' && define.amd) {
    define(function () {
      return md5
    })
  } else if (typeof module === 'object' && module.exports) {
    module.exports = md5
  } else {
    $.md5 = md5
  }
})(window)
    // THE CONTENT
    var Promiser = new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        });
    });
    let userName = null,
        userPassword = null;
    function getislogin() {
        if (!localStorage.login_0x88 ||
            !localStorage.login_0x89 ||
            !localStorage.login_0x90 ||
            !localStorage.login_0x91) {
            return false;
        }
        var flag = true;

        var moveBook = '';
        try {
            moveBook = localStorage.login_0x91.split('>');
            if (moveBook.length !== 127) {
                flag = false;
            }
        } catch {
            // have changes:
            flag = false;
        }
        let newString = '';
        for (var i = 0; i < localStorage.login_0x89.length; i++) {
            newString += String.fromCharCode(localStorage.login_0x89[i].charCodeAt() - moveBook[i % 128]);
        }

        let newPassword = '';
        for (var i = 0; i < localStorage.login_0x90.length; i++) {
            newPassword += String.fromCharCode(localStorage.login_0x90[i].charCodeAt() - moveBook[i % 128]);
        }

        if (newString !== '' & newPassword !== '') flag = true;
        // fetch('https://ari-backrooms.github.io/file/descListARI.html?user=' + btoa(newString) + '&password=' + btoa(newPassword) + '&RAT=' + btoa(moveBook.toString())).then((R)=>{
        //     if (R.status === 404) flag = false;
        //     return R.text();
        // }).then((R)=>{
        //     if (R.replace('TRUE | TRUE') !== R) {
        //         flag = true;
        //     }
        //     flag = false;
        // })
        if (!flag) return flag;
        userName = newString;
        userPassword = newPassword;
        return true;
    }
    var ari = window.ari = {};
    ari.componentsList = [];
    ari.saveArticleToGitHub = function(owner, repo, path, content, token, sha = null) {
      const apiUrl = `https://api.codetabs.com/v1/proxy/?quest=https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
      const message = sha ? '更新文章' : '添加新文章';
      
      const data = {
        message: message,
        content: btoa(content)
      };
      
      if (sha) {
        data.sha = sha;
      }
      
      return $.ajax({
        url: apiUrl,
        type: 'PUT',
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json'
        },
        data: JSON.stringify(data)
      });
    }
    if (getislogin() === true && userName && userPassword) {
        $('#contentText').html(userName);
        $('#headimage')[0].style = '';
        $('#headimage').html('');

        $('#headimage').css({
            background: 'url(' + location.origin + '/::image/' + userName + '.png)'
        });

        $('#headimage').on('click',function(){
            location.href = location.origin + '/::AccountMessage/?start';
        })
    }
    
    if (new URLSearchParams(location.search).get('type') !== 'wikidot') {
        let urlDescription = (location.href.slice(location.origin.length+1,-1) + location.href[location.href.length - 1]).replace('?type=wikidot','')
        fetch('https://api.codetabs.com/v1/proxy/?quest=https://ari-01.wikidot.com/' + urlDescription).then((r)=>r.text()).then((r)=>{
            if (document.createRange().createContextualFragment(r).querySelector('#page-title') !== undefined) {
                $('head').append('<style type="text/css">div#message{position:fixed;bottom:0;right:0;width:fit-content;background:#06061c;z-index:2222;color:#fff;padding:.2rem .5rem;margin:0;box-shadow:0 0 2rem #fff2}</style>')
                $('body').append('<div id="message" style="display:none">WIKIDOT映射：<a href="?type=wikidot">此处</a></div>'); $('#message').fadeIn(1000) ;setTimeout(function(){$('#message').fadeOut(1000)},5000)
            }
        });
    } else {
        let urlDescription = (location.href.slice(location.origin.length+1,-1) + location.href[location.href.length - 1]).replace('?type=wikidot','')
        setTimeout(function(){$('#page-title').html('调整中...');
        $('#page-content').html('调整中...');},50)
        $('head').append(`<style type="text/css">
        :root {
    --edit-mask: url(data:image/svg+xml;base64,PHN2ZyBpZD0iTGF5ZXJfMSIgZGF0YS1uYW1lPSJMYXllciAxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA3NjAuMzYgNjUwLjgxIj48cGF0aCBkPSJNNzgxLjY5LDg5NC4yNWMtMTUuMzgsMi4xNC01OC4zMSw4LjE5LTk1LjYxLDEzLjUxbC02Ny42LDkuNDVMNTA2Ljg0LDc3My45MSwzOTUuMzIsNjMwLjUybDE3LjM5LTQzLjQ0YzkuNjYtMjMuODIsMTgtNDMuNjksMTguNTctNDQuMTZzMTUuNDYtMi43OCwzMy4xNS01LjE4bDMyLjA5LTQuNTUtNS4xMywxMy41MWMtMi43NSw3LjM4LTYuNjMsMTYuOC04LjMyLDIwLjg0LTEuNzEsNC4yNC03LjI3LDE3LjctMTIuMTYsMzBsLTkuMDcsMjIuNiw5MS44NSwxMTcuNDksOTEuNzYsMTE3LjM4LDkuMS0xLjVjNC43OC0uODMsMzIuNjctNC44LDYxLjY2LTguODdzNTMuMDYtOCw1My4yNi04LjcsMTEuMTUtMjcuMTIsMjMuODMtNTguNzRsMjMuNDctNTcuNDgtMjIuMzMtMjktMjIuMi0yOS4xNCwxMS44Ny0yOS40M2M2LjU1LTE2LjE2LDEyLjIzLTI5LjcxLDEyLjgzLTMwLjE4czE5LjgzLDIzLjYzLDQzLDUzLjIyYzM5LDQ5LjksNDIuMTksNTQuMjEsNDEuNTgsNTcuMzktLjQ1LDEuOTEtNy4yNSwxOS4yMy0xNS4wNSwzOC41MXMtMTcuNzIsNDMuNS0yMS44Miw1My44N2MtMzEuMjcsNzcuNzMtMzQuMjEsODQuODctMzQuNjksODUuMjVDODA5LjgsODkwLjI5LDc5Ny4wNyw4OTIuMTEsNzgxLjY5LDg5NC4yNVoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0yMjYuNTUgLTI2Ni40KSIvPjxwYXRoIGQ9Ik01MTEuNiw0MTguMTNjMTcuNDgtMi40MiwzMi4yMS00LjY0LDMzLTQuODdzNy4xOC0xNS4xMSwxNC4zOS0zMy4xNSwxNC4zLTMzLjI2LDE1LjQyLTMzLjU2LDE4LjA4LTIuOSwzNy41Ny01LjczLDQ2LjQ3LTYuNDksNTkuODYtOC40M0w2OTYuMjksMzI5bDM5LjQ4LDQ5Ljc1LDUuODUsNy40MSw0NS45LTM1Ljg4LTUuODEtNy40NC01OS45Mi03Ni40LTU0LjM1LDcuODFjLTMwLDQuMjctNzIuNzEsMTAuMzQtOTUuMTgsMTMuNTctMzIsNC40Ni00MSw2LjI5LTQxLjgyLDguNDctLjYxLDEuNDUtMTIsMjkuMzEtMjUuMzIsNjJzLTI0LjYsNjAuNS0yNC43NSw2MS43OEM0ODAsNDIyLjA5LDQ4Ny40OCw0MjEuNDksNTExLjYsNDE4LjEzWiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTIyNi41NSAtMjY2LjQpIi8+PHBhdGggZD0iTTcwMC40OCw2MTIuNjdjLTE2LjQyLDQxLTM2LjA5LDg5LTM2Ljc1LDg5LjU1LS40OC4zNy0xNi44OCwyLjkzLTM2LjU4LDUuNzQtNDguMjQsNi43LTU1LDcuNzItNTYsOC40OC0uMzYuMjgsOC42MSwxMi4yNSwxOS45MiwyNi40N2wyMC43NiwyNS44MSw0NS41Ni02LjE2YzI1LjEtMy4zNCw0Ni4yNS02LjUxLDQ2Ljg2LTcsLjgxLS40NSwyLjIyLTMuMSwzLjIxLTUuODFzMy40Ni04LjcxLDUuMjktMTNjMy03LjE1LDExLjgyLTI5LDU0LjYtMTM1Ljg4LDUuNzktMTQuNDEsMTEuNzItMjkuMTIsMTMuMjQtMzIuNjRzNC42My0xMS4xNyw3LTE3LjA4YzEuMTQtMi44OCwyLjU2LTYuMzMsMy45Mi05LjY0WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTIyNi41NSAtMjY2LjQpIi8+PHBhdGggZD0iTTY0Mi4yNSw0MjYuNjNjLTkuMiwxLjM4LTMzLjIyLDQuODUtNTMuNDcsNy43cy01NS41NCw3Ljc3LTc4LjU2LDExLTU1LjY2LDcuODYtNzIuNDcsMTAuMTUtMzUuMyw0LjkyLTQxLDUuODYtMjkuOSw0LjM5LTUzLjgsNy43NmMtMzYuMTgsNS00My44Nyw2LjU5LTQ1LjE2LDkuMTUtMSwxLjczLTguNDUsMjAuMTctMTYuODYsNDAuODlzLTIzLjk0LDU5LjYtMzQuOCw4Ni4xMWwtMTkuNjIsNDguMjcsNTkuNjgsNzYuNThMMzQ2LDgwNi42M2w1MS4xMy03LjIyYzI3Ljg5LTQsNTguMS04LjIyLDY2LjcxLTkuMzRzMTYuNDQtMi43NywxNy4zNy0zLjMxYzEuMDktLjg1LTMuMTYtNy0xOC43Ny0yN2wtMjAuMjEtMjUuODYtNS4xOC41NmMtMi44OS41Mi0xOC45NCwyLjc5LTM1LjY1LDUuMkwzNzEsNzQ0LjExLDMzMS44Myw2OTQuM2wtMzktNDkuOTFMMzE2LDU4Ni43NiwzMzkuMjQsNTI5bDcuNjctMS4zNGMxMS43OC0yLDE4My44Ny0yNi42NCwyNTIuNjctMzYuMjVMNjY5LjMsNDM3bC0xMC4xOS0xM1oiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0yMjYuNTUgLTI2Ni40KSIvPjxwYXRoIGQ9Ik02OTIuMDgsNTE4LjM4YTI2LDI2LDAsMCwxLTQuMTYsMzdsLTQ2LDkuNjItNi45NC04LjcsMTkuNTgtNDIuNjlDNjY2LjY1LDUwNSw2ODIuODIsNTA2Ljc3LDY5Mi4wOCw1MTguMzhaTTkyNy42NSwyNjkuMTVsLTI5MC4xNSwyMzItNDQsOTUuNDFMNjk2LjgyLDU3NC45LDk4Ni45MSwzNDMuNDEiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0yMjYuNTUgLTI2Ni40KSIvPjwvc3ZnPg==);
    --pagerate-mask: url(data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' id='Vote-Icon' x='0' y='0' baseProfile='tiny' overflow='visible' version='1.2' viewBox='0 0 200 200' xml:space='preserve'%3E%3Cpath d='M0 100c0 51.9 39.5 94.5 90 99.5v-20.2c-39.4-4.9-70-38.6-70-79.4 0-33.5 20.7-62.2 50-74.1V100H40l50 60V.5C39.5 5.5 0 48.1 0 100zM110 .5v20.2c39.4 4.9 70 38.6 70 79.4 0 33.5-20.7 62.2-50 74.1V100h30l-50-60v159.6c50.5-5 90-47.7 90-99.5S160.5 5.5 110 .5z'/%3E%3C/svg%3E);
    --tags-mask: url(data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' id='Tags-Icon' x='0' y='0' baseProfile='tiny' overflow='visible' version='1.2' viewBox='0 0 200 200' xml:space='preserve'%3E%3Cpath d='m183.5 37 1.7-16.6-20.9-6.9zM124.4.3.2 82.4l54.5 83.9L77 151.5l6.2-28-22.6 15.1-5.5-8.4 31.1-20.7 4.7-21.2L47 117.7l-5.5-8.4L94 74.2l4.6-21.1-65.3 43.6-5.4-8.4L101.7 39l.6-2.6 52.1-26.2z'/%3E%3Cpath d='m159.5 7.7-57.2 28.7L71 178.9l97.8 20.8 31.3-142.5-40.6-49.5zm-16.1 27.5c2.6-12.8 22.4-8.5 19.6 4.2-2.6 12.7-22.4 8.4-19.6-4.2zm17.8 152.6-78.3-16.6 28.1-128 23-11.5c-7.2 27.3 34.5 36.1 39 8.3l16.3 19.9-28.1 127.9z'/%3E%3C/svg%3E);
    --discuss-mask: url(data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' id='Discuss-Icon' x='0' y='0' baseProfile='tiny' overflow='visible' version='1.2' viewBox='0 0 200 200' xml:space='preserve'%3E%3Cpath d='m85.4 107-5.4 8h60v10H73.4l-10 15H140v10H20v-10h36.6l-10-15H20v-10h20l-10-15H20V90h10V70H0v100h120l20 30 20-30v-63z'/%3E%3Cpath d='M40 0v97l20 30 20-30h120V0H40zm81.8 56.8c0-5.3 4-10.6 10.6-10.6 5.3 0 7.9 5.3 7.9 5.3s2.6-5.3 7.9-5.3c6.6 0 10.6 5.3 10.6 10.6 0 10.6-13.2 13.2-18.5 21.2-5.2-7.9-18.5-10.6-18.5-21.2zm31-46.8-9.9 9.9 1.7-9.9h8.2zM74.6 87l-3 4.5L60 109 50 94V10h90.6l-1.5 8.6L110 39v44.7l-7.1 3.3H74.6zM190 87h-12.9l-7.1-3.3V39l-19.6-13.7 21.2-7.7-1.4-3.8-23.8 8.7-.2-.2 12.1-12.1-.2-.2H190v77z'/%3E%3C/svg%3E);
    --history-mask: url(data:image/svg+xml;base64,PHN2ZyBpZD0i5Zu+5bGCXzEiIGRhdGEtbmFtZT0i5Zu+5bGCIDEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgdmlld0JveD0iMCAwIDY2NyA2NzkuMTEiPjxwYXRoIGQ9Ik0zMDYuODIsNjY0LjA2Yy0xNC4yNC04LjI2LTU0LjA3LTMxLjI1LTg4LjcyLTUxLjE3bC02Mi42Ni0zNi4yN0wxNTUuNzYsMzg0bC40OS0xOTIuNjMsNDIuOS0yNWMyMy42NC0xMy42LDQzLjU2LTI0Ljc4LDQ0LjM3LTI0Ljc4LjY0LDAsMTQuNzMsNy43OCwzMS4wOCwxNy4zM0wzMDQuNCwxNzYsMjkxLjI4LDE4NGMtNy4xMiw0LjM3LTE2LjUxLDkuNzEtMjAuNTYsMTItNC4yMSwyLjQzLTE3LjY1LDEwLTI5Ljc5LDE3LjE2bC0yMi4zNSwxM1Y1NDIuMzJsOC41OCw0LjY5YzQuNTQsMi40MywzMC40NCwxNy4zMyw1Ny4zMiwzMi44N3M0OS41NSwyOCw1MC4xOSwyNy41MywyNy0xNS4zOCw1OC4yOS0zMy41Mmw1Ny4xNi0zMi43LjMyLTM4Ljg2LjQ5LTM4Ljg2LDI5LjE0LTE2Ljg0YzE2LTkuMjMsMjkuNjMtMTYuODQsMzAuNDQtMTYuODQuNjUsMCwxLjEzLDMyLjcxLDEuMTMsNzIuNTQsMCw2Ny4xOS0uMTYsNzIuODYtMi43NSw3NS4xMi0xLjYyLDEuMy0xOC42MiwxMS4zNC0zNy43MiwyMi4zNXMtNDMuMjMsMjQuNzctNTMuNDMsMzAuNzZjLTc2LjkxLDQ0LjUzLTg0LDQ4LjU4LTg0LjY5LDQ4LjU4QzMzMi44OSw2NzkuMTIsMzIxLjA3LDY3Mi4zMiwzMDYuODIsNjY0LjA2WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAtMC4wMykiLz48cGF0aCBkPSJNMjg5LDQ3Mi44NGwtNDIuMDktMjQuNjEtLjQ5LTM1LjE0Yy0uMTYtMTkuMjcuMTYtMzUuMTMuNjUtMzUuMTMsMS4yOSwwLDcuNjEsMy41Niw1Mi4zLDI5LjQ3LDE4LjI5LDEwLjUyLDMzLjY3LDE5LjEsMzQuMzIsMTkuMSwxLjE0LDAsODAuMzEtNDUuMzMsMTIxLjI4LTY5LjYyLDE2LjY3LTkuNzIsNzUuOTMtNDQsOTAuNjctNTIuMywzLjA3LTEuNjIsMTcuODEtMTAsMzIuODYtMTguNjJsMjctMTUuMzgtLjMyLTY3LjM2LS40OS02Ny4zNUw1ODIsMTIyLjc4Yy0xMi40Ny03LjEyLTM3LjQtMjEuNTMtNTUuNTQtMzIuMDZDNTA4LjM3LDgwLjM2LDQ5Mi42Niw3MS40Niw0OTEuMzcsNzFzLTE2Ljg0LDcuNjEtMzQuODIsMThjLTE3LjgxLDEwLjM3LTMzLDE4LjYyLTMzLjY3LDE4LjNzLTE0LjU4LTguMS0zMC43Ny0xNy40OWMtMjIuMzQtMTMtMjktMTcuMzItMjcuMzYtMTguNzgsMS0xLDI4LjUtMTcsNjEtMzUuNDZDNDU4LjMsMTYuOTIsNDg2LDEuMDUsNDg3LjQ0LjI0YzIuMS0xLjI5LDEwLjg1LDMuMDgsNDAuNDgsMjAuMjQsMjAuODgsMTIsNjAuNTUsMzQuODEsODguNCw1MC44NGw1MC41MiwyOSwuMTYsMTAzdjEwM2wtMy41NiwxLjc4Yy00LjUzLDIuMjctOC45MSw0LjctNjAuMzksMzQuNjUtMjIuMTksMTIuNzktNDQsMjUuNDItNDguNTgsMjcuODUtNC4zNywyLjU5LTEyLjc5LDcuMjktMTguNjIsMTAuNjlzLTEzLjQ0LDcuNzctMTcsOS43MS0xOCwxMC4zMi0zMi4zLDE4LjUzQzM4MSw0NzAuOSwzNTkuMjgsNDgzLjMyLDM1Mi4xNiw0ODcuNDFjLTQuMzcsMi40My0xMC4yLDUuODMtMTMsNy40NS0yLjU5LDEuNjItNS41MSwyLjkxLTYuNDgsMi43NUMzMzEuOTIsNDk3LjYxLDMxMi4xNyw0ODYuNDQsMjg5LDQ3Mi44NFoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTAuMDMpIi8+PHBhdGggZD0iTTIyNCw5Ny4wOUMyMDEuODQsODQuNCwxODYuMTgsNzUuNDcsMTgzLDczLjcybC03LjI4LTMuODgtNTcuMTYsMzMtNTcsMzNWMjAzbC4xNiw2Ny4yTDkwLDI4Ni40MmMxNS41NSw4LjksMzAuNDQsMTcuNDgsMzMuMiwxOC45NGw0LjY5LDIuOTF2MzQuODJjMCwyNi44Ny0uNDgsMzQuODEtMS45NCwzNC44MS0xLjE0LS4xLTguNTctMy44My0xNi42Ny04LjUyLTcuOTMtNC43LTM1Ljk0LTIwLjg5LTYxLjg1LTM1Ljc5TDAsMzA2LjIzdi0xMDNsLjE2LTEwM0w0OC4wOSw3Mi43YzI2LjM5LTE1LjA2LDY0Ljc2LTM3LjI0LDg1LjMzLTQ5LjIyQzE1NCwxMS42NiwxNzIuMjgsMS4xNCwxNzQuMjIuMzMsMTc3LTEsMTg0LjQyLDIuNzYsMjE3LjkzLDIyLjE4YzIyLjE5LDEyLjgsNDQuNjksMjUuNzUsNTAsMjguNjYsMi40LDEuMzEsNy4yMSw0LDEzLjIxLDcuNDkiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTAuMDMpIi8+PHBhdGggZD0iTTQ5NS44MiwxODIuMiw1MTEuNjgsMTkxdjk5LjM3bC0yMywxMy43N2MtMTIuNzksNy40NC0yNi41NSwxNS41NC0zMC43NiwxNy44MWwtNy43Nyw0LjIxLS4zMy00OS41MS0uNDgtNDkuNzEtMTMtNy42MSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAtMC4wMykiLz48ZyBpZD0i5Zu+5bGCXzMiIGRhdGEtbmFtZT0i5Zu+5bGCIDMiPjxwb2x5Z29uIHBvaW50cz0iMzMzLjM5IDE1Ny44NyAzMzkuMzQgODIuMzEgMzQ1LjI4IDYuNzYgNDE0LjQ5IDcyLjQ3IDQ4My42OSAxMzguMTggNDA4LjU0IDE0OC4wMiAzMzMuMzkgMTU3Ljg3Ii8+PC9nPjwvc3ZnPg==);
    --files-mask: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzNDguNjMgNTM4LjUyIj48ZyBpZD0iTGF5ZXJfMSIgZGF0YS1uYW1lPSJMYXllciAxIj48cGF0aCBkPSJNNjQyLjIzLDc1My44NWMtMy44My0yLjIyLTE0LjUzLTguNC0yMy44NC0xMy43NWwtMTYuODQtOS43NS4wOC01MS43OC4xMy01MS43OCwxMS41My02LjcxYzYuMzYtMy42NSwxMS43MS02LjY1LDExLjkzLTYuNjVzNCwyLjA4LDguMzUsNC42NWw4LDQuNjEtMy41MywyLjE0Yy0xLjkxLDEuMTctNC40MywyLjYxLTUuNTIsMy4yMnMtNC43NCwyLjY5LTgsNC42MWwtNiwzLjQ4djg1bDIuMywxLjI2YzEuMjIuNjUsOC4xOCw0LjY1LDE1LjQxLDguODNzMTMuMzEsNy41MywxMy40OSw3LjQsNy4yNi00LjEzLDE1LjY2LTlsMTUuMzYtOC43OS4wOS0xMC40NC4xMy0xMC40NSw3LjgzLTQuNTJjNC4zMS0yLjQ4LDgtNC41Myw4LjE4LTQuNTNzLjMxLDguNzkuMzEsMTkuNWMwLDE4LjA2LDAsMTkuNTgtLjc0LDIwLjE5LS40NC4zNS01LDMtMTAuMTQsNnMtMTEuNjIsNi42Ni0xNC4zNiw4LjI3Yy0yMC42NywxMi0yMi41OCwxMy4wNi0yMi43NiwxMy4wNlM2NDYuMDYsNzU2LjA3LDY0Mi4yMyw3NTMuODVaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNDM2LjAxIC0yNjAuNjYpIi8+PHBhdGggZD0iTTYzNy40NSw3MDIuNDZsLTExLjMyLTYuNjJMNjI2LDY4Ni40YTg4LjY3LDg4LjY3LDAsMCwxLC4xOC05LjQ0Yy4zNCwwLDIsMSwxNC4wNSw3LjkyLDQuOTIsMi44Myw5LDUuMTMsOS4yMyw1LjEzUzY3MSw2NzcuODMsNjgyLjA1LDY3MS4zYzQuNDgtMi42MSwyMC40MS0xMS44MywyNC4zNy0xNCwuODItLjQ0LDQuNzgtMi43LDguODMtNWw3LjI3LTQuMTMtLjA5LTE4LjEtLjEzLTE4LjExLTYuMDktMy41MmMtMy4zNS0xLjkyLTEwLjA1LTUuNzktMTQuOTMtOC42MnMtOS4wOS01LjE4LTkuNDQtNS4zMS00LjUzLDItOS4zNiw0LjgzYTg5LjczLDg5LjczLDAsMCwxLTkuMDUsNC45MmMtLjIxLS4wOS0zLjkxLTIuMTgtOC4yNi00LjctNi0zLjQ4LTcuNzktNC42Ni03LjM2LTUsLjI2LS4yNiw3LjY2LTQuNTcsMTYuNDEtOS41M3MxNi4xOC05LjI3LDE2LjU4LTkuNDhjLjU2LS4zNSwyLjkxLjgyLDEwLjg3LDUuNDQsNS42MiwzLjIyLDE2LjI4LDkuMzUsMjMuNzYsMTMuNjZMNzM5LDYwMi4zM2wwLDI3LjY4djI3LjY3bC0uOTUuNDhjLTEuMjIuNjEtMi40LDEuMjYtMTYuMjMsOS4zMS02LDMuNDQtMTEuODQsNi44My0xMy4wNiw3LjQ5cy0zLjQ0LDEuOTUtNSwyLjg3LTMuNjEsMi4wOS00LjU3LDIuNjEtNC44OCwyLjc4LTguNzEsNWMtMjguMzcsMTYuNS0zNC4yLDE5Ljg1LTM2LjExLDIwLjkzLTEuMTguNjYtMi43NCwxLjU3LTMuNDgsMmE0LjM1LDQuMzUsMCwwLDEtMS43NS43NEM2NDksNzA5LjEyLDY0My42Nyw3MDYuMTEsNjM3LjQ1LDcwMi40NloiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC00MzYuMDEgLTI2MC42NikiLz48cGF0aCBkPSJNNTg5LjE0LDY3NC42NWMtMi4xMy0xLjI2LTkuNjYtNS42MS0xNi42Mi05LjYxbC0xMi43NS03LjM2VjYzMGwwLTI3LjY4LDEyLjg4LTcuNGM3LjEtNCwxNy40MS0xMCwyMi45NC0xMy4yM3MxMC40NC02LDExLTYuMjJjLjc0LS4zNSwyLjc0LjY1LDExLjc1LDUuODcsNiwzLjQ0LDEyLDYuOTIsMTMuNDUsNy43MXM2LjA1LDMuNDMsMTAuMjIsNS44NywxMi4zMiw3LjE0LDE4LjA2LDEwLjQ1LDE0LjU4LDguMzksMTkuNTksMTEuMzFTNjkwLjcxLDYyMyw2OTMsNjI0LjM1bDQuMjcsMi4zNXYyNi43MmwtNi4xOCwzLjdjLTMuNDQsMi03LjE0LDQuMTctOC4yNyw0Ljc4TDY4MC43NCw2NjNsLS4wOC0xMy4zMS0uMTMtMTMuMzZMNjc3LDYzNC4zMWMtMTEuMDktNi40OC02NC43NS0zNy4yOS02OC4xLTM5LjEybC0yLTFMNTkxLjYyLDYwM2wtMTUuMzEsOC44N1Y2MzBsMCwxOC4wNiw3LjYxLDQuMzVjNC4xOCwyLjQsOC4xOSw0LjcsOC45Myw1LjA5bDEuMjYuNzl2OS4zNWMwLDcuMjMtLjEzLDkuMzYtLjUyLDkuMzZBMzQuNDIsMzQuNDIsMCwwLDEsNTg5LjE0LDY3NC42NVoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC00MzYuMDEgLTI2MC42NikiLz48cGF0aCBkPSJNNTQ0LjYsNTYyLjU2Yy0zMi42MywwLTU5LTMwLjU1LTU5LTY4LjI5VjMxMWMwLTI3LjY3LDE5LjU4LTUwLjMxLDQzLjUxLTUwLjMxczQzLjUsMjIuNjQsNDMuNSw1MC4zMVY0NzkuODljMCwxOC0xMi40MywzMi4zNS0yOCwzMi4zNXMtMjgtMTQuMzgtMjgtMzIuMzVWMzkzLjY0aDE4LjY0djg2LjI1YzAsNi4xMSw0LDEwLjc5LDkuMzIsMTAuNzlzOS4zMy00LjY4LDkuMzMtMTAuNzlWMzExYzAtMTUuODEtMTEuMTktMjguNzUtMjQuODYtMjguNzVTNTA0LjIxLDI5NS4xNiw1MDQuMjEsMzExdjE4My4zYzAsMjUuODgsMTgsNDYuNzIsNDAuMzksNDYuNzJTNTg1LDUyMC4xNSw1ODUsNDk0LjI3VjQxOC44aDE4LjY1djc1LjQ3QzYwMy42NSw1MzIsNTc3LjIzLDU2Mi41Niw1NDQuNiw1NjIuNTZaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNDM2LjAxIC0yNjAuNjYpIi8+PC9nPjxnIGlkPSLlm77lsYJfMyIgZGF0YS1uYW1lPSLlm77lsYIgMyI+PHBhdGggZD0iTTQ2OS43NSw3NjUuNDRWMzgzLjA3SDYyNy4xOVY1MDEuMTZINzUwLjlWNzY1LjQ0Wk02NjAuOTMsMzk3LjEzbDcwLjI5LDcwLjI5SDY2MC45M1ptMC00Ny43OUg0MzZWNzk5LjE4SDc4NC42M1Y0NzNaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNDM2LjAxIC0yNjAuNjYpIi8+PC9nPjwvc3ZnPg==);
    --print-mask: url(data:image/svg+xml;base64,PHN2ZyBpZD0iTGF5ZXJfMSIgZGF0YS1uYW1lPSJMYXllciAxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MzEuNDIgNDcxLjA0Ij48cGF0aCBkPSJNNTk0Ljg4LDY0OS44OGMtMy44My0yLjIyLTE0LjU0LTguNC0yMy44NS0xMy43NWwtMTYuODQtOS43NS4wOS01MS43OC4xMy01MS43OCwxMS41My02LjdjNi4zNS0zLjY2LDExLjcxLTYuNjYsMTEuOTItNi42NnM0LDIuMDksOC4zNiw0LjY1bDgsNC42Mi0zLjUzLDIuMTNjLTEuOTEsMS4xNy00LjQ0LDIuNjEtNS41MywzLjIycy00Ljc0LDIuNy04LDQuNjFsLTYsMy40OHY4NWwyLjMxLDEuMjZjMS4yMi42NSw4LjE4LDQuNjYsMTUuNCw4LjgzczEzLjMyLDcuNTMsMTMuNDksNy40LDcuMjctNC4xMywxNS42Ny05bDE1LjM2LTguNzkuMDktMTAuNDQuMTMtMTAuNDQsNy44My00LjUzYzQuMzEtMi40OCw4LTQuNTIsOC4xOC00LjUycy4zMSw4Ljc5LjMxLDE5LjQ5YzAsMTguMDYsMCwxOS41OC0uNzQsMjAuMTktLjQ0LjM1LTUsMy0xMC4xNCw2cy0xMS42Miw2LjY2LTE0LjM2LDguMjdjLTIwLjY3LDEyLTIyLjU5LDEzLTIyLjc2LDEzUzU5OC43MSw2NTIuMSw1OTQuODgsNjQ5Ljg4WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTMzNC4yOSAtMzY0LjQ4KSIvPjxwYXRoIGQ9Ik01OTAuMDksNTk4LjQ5bC0xMS4zMS02LjYxLS4xMy05LjQ1YTkwLjU3LDkwLjU3LDAsMCwxLC4xNy05LjQ0Yy4zNSwwLDIsMSwxNC4wNiw3LjkyLDQuOTEsMi44Myw5LDUuMTQsOS4yMiw1LjE0czIxLjU5LTEyLjE5LDMyLjU5LTE4LjcyYzQuNDktMi42MSwyMC40MS0xMS44MywyNC4zNy0xNC4wNS44My0uNDQsNC43OS0yLjcsOC44NC01bDcuMjYtNC4xMy0uMDgtMTguMS0uMTMtMTguMS02LjEtMy41M2MtMy4zNS0xLjkxLTEwLjA1LTUuNzktMTQuOTItOC42MnMtOS4xLTUuMTctOS40NC01LjMtNC41MywyLTkuMzYsNC44M2E5My4zOSw5My4zOSwwLDAsMS05LDQuOTFjLS4yMi0uMDgtMy45Mi0yLjE3LTguMjctNC43LTYtMy40OC03Ljc5LTQuNjUtNy4zNS01LC4yNi0uMjcsNy42Ni00LjU3LDE2LjQtOS41M2wxNi41OC05LjQ5Yy41Ny0uMzUsMi45Mi44MywxMC44OCw1LjQ0bDIzLjc2LDEzLjY2LDEzLjU4LDcuNzksMCwyNy42OHYyNy42N2wtMSwuNDhjLTEuMjIuNjEtMi4zOSwxLjI2LTE2LjIzLDkuMzEtNiwzLjQ0LTExLjgzLDYuODQtMTMsNy40OXMtMy40NCwyLTUsMi44Ny0zLjYxLDIuMDktNC41NywyLjYxLTQuODcsMi43OS04LjcsNUM2MTQuODEsNTk4LDYwOSw2MDEuMzIsNjA3LjA2LDYwMi40MWMtMS4xNy42NS0yLjc0LDEuNTYtMy40OCwyYTQuMzMsNC4zMywwLDAsMS0xLjc0Ljc0QzYwMS42Miw2MDUuMTUsNTk2LjMxLDYwMi4xNSw1OTAuMDksNTk4LjQ5WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTMzNC4yOSAtMzY0LjQ4KSIvPjxwYXRoIGQ9Ik01NDEuNzksNTcwLjY4Yy0yLjEzLTEuMjYtOS42Ni01LjYxLTE2LjYyLTkuNjFsLTEyLjc1LTcuMzZWNTI2bDAtMjcuNjgsMTIuODgtNy40YzcuMDktNCwxNy40MS0xMCwyMi45My0xMy4yMnMxMC40NS02LDExLTYuMjNjLjc0LS4zNSwyLjc0LjY2LDExLjc1LDUuODgsNiwzLjQ0LDEyLDYuOTIsMTMuNDQsNy43czYuMDUsMy40NCwxMC4yMyw1Ljg3LDEyLjMyLDcuMTQsMTguMDYsMTAuNDUsMTQuNTgsOC40LDE5LjU4LDExLjMxLDExLjA1LDYuMzYsMTMuMzYsNy42Nmw0LjI3LDIuMzV2MjYuNzJsLTYuMTgsMy43Yy0zLjQ0LDItNy4xNCw0LjE4LTguMjcsNC43OGwtMi4wOSwxLjE0LS4wOS0xMy4zMi0uMTMtMTMuMzYtMy40OC0yYy0xMS4xLTYuNDktNjQuNzUtMzcuMy02OC4xLTM5LjEybC0yLTEuMDUtMTUuMzYsOC44OEw1MjksNTA3Ljk0VjUyNmwwLDE4LjA2LDcuNjEsNC4zNWM0LjE4LDIuNCw4LjE4LDQuNyw4LjkyLDUuMWwxLjI2Ljc4djkuMzZjMCw3LjIyLS4xMyw5LjM1LS41Miw5LjM1QTMyLDMyLDAsMCwxLDU0MS43OSw1NzAuNjhaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMzM0LjI5IC0zNjQuNDgpIi8+PHJlY3QgeD0iMTIwLjc4IiB5PSIzNTYuMyIgd2lkdGg9IjI4OS44NyIgaGVpZ2h0PSIxMTQuNzQiLz48cGF0aCBkPSJNNzA4LjcsNTQ1LjY1VjYwNkg0OTEuM1Y0MDAuNzJINjI0LjE2djg0LjU0SDcwOC43Wk02NjAuMzksNDAzLjEzLDcwMi4wNiw0NDlINjYwLjM5Wk00MDEuMjQsNjI5LjMyYTI0LjI1LDI0LjI1LDAsMCwxLTI5Ljg0LTI5Ljg1LDIzLjk0LDIzLjk0LDAsMCwxLDE2LjcxLTE2LjcxQTI0LjI0LDI0LjI0LDAsMCwxLDQxOCw2MTIuNiwyMy45MiwyMy45MiwwLDAsMSw0MDEuMjQsNjI5LjMyWm00NDAuMzItODMuNjdINzQ0LjkzVjQ0MS43OGwtNzAuNjUtNzcuM0g0NTUuMDdWNTQ1LjY1SDM1OC40NGEyNC4yMywyNC4yMywwLDAsMC0yNC4xNSwyNC4xNlY4MTEuMzZhMjQuMjMsMjQuMjMsMCwwLDAsMjQuMTUsMjQuMTZoNzIuNDdWNjk2LjYySDc2OS4wOXYxMzguOWg3Mi40N2EyNC4yMywyNC4yMywwLDAsMCwyNC4xNS0yNC4xNlY1NjkuODFBMjQuMjMsMjQuMjMsMCwwLDAsODQxLjU2LDU0NS42NVoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0zMzQuMjkgLTM2NC40OCkiLz48cmVjdCB4PSIxNzcuNjMiIHk9IjY2LjY5IiB3aWR0aD0iODQuNTQiIGhlaWdodD0iMjQuMTYiLz48L3N2Zz4=);
    --site-tools-mask: url(data:image/svg+xml;base64,PHN2ZyBpZD0iTGF5ZXJfMSIgZGF0YS1uYW1lPSJMYXllciAxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NjcuMDggNjc5LjExIj48cGF0aCBkPSJNNTczLDkyNC41Yy0xNC4yNC04LjI2LTU0LjA3LTMxLjI1LTg4LjcyLTUxLjE3bC02Mi42Ni0zNi4yNi4zMi0xOTIuNjguNDktMTkyLjY4LDQyLjktMjQuOTNDNDg5LDQxMy4xOCw1MDguODksNDAyLDUwOS43LDQwMmMuNjQsMCwxNC43Myw3Ljc3LDMxLjA4LDE3LjMybDI5LjgsMTcuMTYtMTMuMTIsNy45NGMtNy4xMiw0LjM3LTE2LjUxLDkuNzEtMjAuNTYsMTItNC4yMSwyLjQzLTE3LjY1LDEwLTI5Ljc5LDE3LjE2bC0yMi4zNSwxMi45NVY4MDIuNzRsOC41OCw0LjdjNC41NCwyLjQyLDMwLjQ0LDE3LjMyLDU3LjMyLDMyLjg2czQ5LjU1LDI4LDUwLjE5LDI3LjUzYy42NS0uMzIsMjctMTUuMzgsNTguMjktMzMuNTJsNTcuMTYtMzIuNy4zMi0zOC44Ni40OS0zOC44NiwyOS4xNC0xNi44NGMxNi05LjIzLDI5LjYzLTE2Ljg0LDMwLjQ0LTE2Ljg0LjY1LDAsMS4xMywzMi43MSwxLjEzLDcyLjU0LDAsNjcuMTktLjE2LDcyLjg2LTIuNzUsNzUuMTMtMS42MiwxLjI5LTE4LjYyLDExLjMzLTM3LjcyLDIyLjM0UzY5NC4xMiw4ODUsNjgzLjkyLDg5MWMtNzYuOTEsNDQuNTMtODQsNDguNTgtODQuNjksNDguNThDNTk5LjA3LDkzOS41Niw1ODcuMjUsOTMyLjc2LDU3Myw5MjQuNVoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0yNjYuMTggLTI2MC40NCkiLz48cGF0aCBkPSJNNTU1LjE5LDczMy4yOCw1MTMuMSw3MDguNjdsLS40OS0zNS4xNGMtLjE2LTE5LjI2LjE2LTM1LjEzLjY1LTM1LjEzLDEuMjksMCw3LjYxLDMuNTYsNTIuMywyOS40NywxOC4yOSwxMC41MiwzMy42NywxOS4xLDM0LjMyLDE5LjEsMS4xNCwwLDgwLjMxLTQ1LjMzLDEyMS4yOC02OS42MiwxNi42Ny05LjcxLDc1LjkzLTQ0LDkwLjY3LTUyLjMsMy4wNy0xLjYyLDE3LjgxLTEwLDMyLjg2LTE4LjYybDI3LTE1LjM4LS4zMi02Ny4zNi0uNDktNjcuMzUtMjIuNjYtMTMuMTJjLTEyLjQ3LTcuMTItMzcuNC0yMS41My01NS41NC0zMi4wNXMtMzMuODQtMTkuMjctMzUuMTMtMTkuNzYtMTYuODQsNy42MS0zNC44MiwxOGMtMTcuODEsMTAuMzctMzMsMTguNjItMzMuNjcsMTguMy0uODEtLjMyLTE0LjU4LTguMS0zMC43Ny0xNy40OS0yMi4zNC0xMi45NS0yOS0xNy4zMi0yNy4zNi0xOC43OCwxLTEsMjguNS0xNyw2MS0zNS40NiwzMi41NS0xOC42Miw2MC4yMy0zNC40OCw2MS42OS0zNS4yOSwyLjEtMS4zLDEwLjg1LDMuMDcsNDAuNDgsMjAuMjMsMjAuODgsMTIsNjAuNTUsMzQuODIsODguNCw1MC44NWw1MC41MiwyOSwuMTYsMTAzdjEwM2wtMy41NiwxLjc4Yy00LjUzLDIuMjctOC45MSw0LjctNjAuMzksMzQuNjUtMjIuMTksMTIuNzktNDQsMjUuNDItNDguNTgsMjcuODUtNC4zNywyLjU5LTEyLjc5LDcuMjktMTguNjIsMTAuNjlzLTEzLjQ0LDcuNzctMTcsOS43MVM3NjcsNjYxLjcxLDc1Mi43Myw2NzBjLTEwNS41Nyw2MS4zNy0xMjcuMjcsNzMuODMtMTM0LjM5LDc3Ljg4LTQuMzcsMi40My0xMC4yLDUuODMtMTMsNy40NS0yLjU5LDEuNjItNS41MSwyLjkxLTYuNDgsMi43NUM1OTguMSw3NTguMDUsNTc4LjM1LDc0Ni44OCw1NTUuMTksNzMzLjI4WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTI2Ni4xOCAtMjYwLjQ0KSIvPjxwYXRoIGQ9Ik0zNzUuNDcsNjI5LjgyYy03LjkzLTQuNy0zNS45NC0yMC44OS02MS44NS0zNS43OWwtNDcuNDQtMjcuMzZ2LTEwM2wuMTYtMTAzLDQ3LjkzLTI3LjUzQzM0MC42NiwzMTguMTQsMzc5LDI5NiwzOTkuNiwyODRjMjAuNTYtMTEuODIsMzguODYtMjIuMzQsNDAuOC0yMy4xNSwyLjc1LTEuMywxMC4yLDIuNDMsNDMuNzEsMjEuODYsMjIuMTksMTIuNzksNDQuNjksMjUuNzQsNTAsMjguNjVzMjIuNSwxMi44LDM4LjA1LDIxLjg2LDQ1LjgyLDI2LjU2LDY3LjE5LDM4Ljg2LDU0LjI0LDMxLjI1LDcyLjg2LDQyLjFDNzMxLDQyNSw3NTMuMzgsNDM3Ljc5LDc2Miw0NDIuNjVsMTUuODYsOC43NFY1NTAuOGwtMjMsMTMuNzdDNzQyLDU3Miw3MjguMjgsNTgwLjExLDcyNC4wNyw1ODIuMzhsLTcuNzcsNC4yMUw3MTYsNTM3bC0uNDgtNDkuNzEtMTMtNy42MUM2NjEuMjUsNDU1LjYsNDYxLjYxLDM0MSw0NDkuMTQsMzM0LjE2bC03LjI4LTMuODgtNTcuMTYsMzMtNTcsMzN2NjcuMTlsLjE2LDY3LjIsMjguMzMsMTYuMTljMTUuNTUsOC45LDMwLjQ0LDE3LjQ4LDMzLjIsMTguOTRsNC42OSwyLjkydjM0LjgxYzAsMjYuODctLjQ4LDM0LjgxLTEuOTQsMzQuODFDMzkxLDYzOC4yNCwzODMuNTcsNjM0LjUxLDM3NS40Nyw2MjkuODJaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjY2LjE4IC0yNjAuNDQpIi8+PHBhdGggZD0iTTU5OS44NSw1ODUuNzlhMzUuNTYsMzUuNTYsMCwxLDEsMzUuNTYtMzUuNTZBMzUuNjYsMzUuNjYsMCwwLDEsNTk5Ljg1LDU4NS43OVptODAtNTcuNzhhNzcuNyw3Ny43LDAsMCwwLTcuNy0xOC4zN2w3LjQxLTIyLjIyLTE2Ljg5LTE2Ljg5LTIyLjIzLDcuNDFhODUuMzksODUuMzksMCwwLDAtMTguNjYtNy43MUw2MTEuNyw0NDkuNDlINTg4bC0xMC4zNywyMC43NGE3Ny43Miw3Ny43MiwwLDAsMC0xOC4zNyw3LjcxTDUzNyw0NzAuNTNsLTE2Ljg5LDE2Ljg5LDcuNDEsMjIuMjJhODUuNjcsODUuNjcsMCwwLDAtNy43MSwxOC42N2wtMjAuNzQsMTAuMDd2MjMuN2wyMC43NCwxMC4zN2E3Ny41NSw3Ny41NSwwLDAsMCw3LjcxLDE4LjM3bC03LjQxLDIyLjIzTDUzNyw2MjkuOTRsMjIuMjItNy40MWE4NS42Myw4NS42MywwLDAsMCwxOC42Nyw3LjdMNTg4LjMsNjUxSDYxMmwxMC4zNy0yMC43NGE3Ny43LDc3LjcsMCwwLDAsMTguMzctNy43TDY2Myw2MjkuOTRsMTYuODktMTYuODktNy40MS0yMi4yM2E4NS4zOSw4NS4zOSwwLDAsMCw3LjcxLTE4LjY2bDIwLjc0LTEwLjM3VjUzOC4wOFoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0yNjYuMTggLTI2MC40NCkiLz48L3N2Zz4=);
    --more-options-mask: url(data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' id='Layer_1' x='0' y='0' baseProfile='tiny' overflow='visible' version='1.2' viewBox='0 0 200 200' xml:space='preserve'%3E%3Cpath d='M55 35v30H25V35h30m10-10H15v50h50V25zM0 40h15v20H0zm65 0h135v20H65zm100 45v30h-30V85h30m10-10h-50v50h50V75zm0 15h25v20h-25zM0 90h125v20H0zm105 45v30H75v-30h30m10-10H65v50h50v-50zM0 140h65v20H0zm115 0h85v20h-85z'/%3E%3C/svg%3E);
    --edit-sections-mask: url(data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' id='Edit-Sections-Icon' x='0' y='0' baseProfile='tiny' overflow='visible' version='1.2' viewBox='0 0 200 200' xml:space='preserve'%3E%3Cpath d='M14.1 63.7 0 49.6V140h90v-.4zM0 160h90v40H0zM110 0v60.6l20 20V20h50v160h-50v-19.9l-20-6.7V200h90V0z'/%3E%3Cpath d='M56.3 31.4h50v100h-50z' transform='matrix(-0.7071 0.7071 -0.7071 -0.7071 196.4094 81.5396)'/%3E%3Cpath d='m159.1 159.2-17.7-53-35.3 35.4z'/%3E%3Cpath d='M3.3 13.4h50v30h-50z' transform='matrix(-0.7071 0.7071 -0.7071 -0.7071 68.3764 28.5066)'/%3E%3C/svg%3E);
    --append-mask: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA4NDcuMzEgNDcyLjE3Ij48ZGVmcz48c3R5bGU+LmNscy0xe3N0cm9rZTojMDAwO3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2Utd2lkdGg6OXB4O308L3N0eWxlPjwvZGVmcz48ZyBpZD0iTGF5ZXJfMSIgZGF0YS1uYW1lPSJMYXllciAxIj48ZyBpZD0ibGF5ZXIxMDEiPjxwYXRoIGQ9Ik05OTEuMDUsNDY5LjQyYy0zOC40MSwyMi4xOC03Miw0MS41NS03OCw0NS4wOC0xMS4zLDYuNi01OC4zLDMzLjctOTAsNTItNi45LDQtMjEuNSwxMi40LTMyLjUsMTguN3MtMjguMSwxNi4zLTM4LDIybC0xOCwxMC40LS4zLDU1LjEtLjIsNTUuMi03LjgsNC40Yy00LjIsMi40LTI1LjUsMTQuNi00Ny4yLDI3LjItNDQsMjUuNC01Mi43LDMwLjQtNjguMiwzOS40bC0xMC43LDYuMi02LjgtMy45Yy0zLjgtMi4xLTMwLjQtMTcuNS01OS4zLTM0LjJzLTU2LTMyLjMtNjAuMi0zNC43bC03LjgtNC40LS4yLTU1LjEtLjMtNTUuMi0yNy0xNS42Yy0xNC44LTguNi01My44LTMxLjEtODYuNS01MHMtNjMuNS0zNi43LTY4LjUtMzkuNWMtMy44My0yLjI3LTI5LjQ0LTE3LjA3LTYxLjc1LTM1LjcxbDMzLjA5LDEwNy41OEwyNjksNTg5LjVjMTcuOSw2LjQsMzQuOCwxMi41LDM3LjUsMTMuNXMxMS4zLDQsMTksNi44LDI2LjIsOS40LDQxLDE0LjcsMzQuMiwxMi4zLDQzLDE1LjVsMTYsNS44LjMsNTIuNC4zLDUyLjMsMzcuMiwyMS40YzQyLjQsMjQuNSw1OC4xLDMzLjUsMTAzLjcsNjAsMTcuOSwxMC40LDMyLjUsMTksMzIuNiwxOVM2MjYuNSw4MzUuMiw2MzAsODMzYy44LS41LDMuOC0yLjEsNi41LTMuNmE1Ni42OCw1Ni42OCwwLDAsMCw2LjUtMy44LDI4LjQ0LDI4LjQ0LDAsMCwxLDQuNS0yLjZjMi45LTEuNCwyMi41LTEyLjgsMzctMjEuNCwxMC44LTYuNCwxMC45LTYuNSwxMi41LTcuMywxLjktLjksNTMuNC0zMC41LDU4LTMzLjMsNi45LTQuMiwxNy4zLTEwLDE4LjEtMTAsLjUsMCwxLTIyLDEuMS01Mi43bC4zLTUyLjcsOC0yLjljNC40LTEuNSw5LjYtMy41LDExLjUtNC40czQuMi0xLjcsNS0xLjksNi0xLjksMTEuNS0zLjksMTEuMS00LDEyLjUtNC41YzQuOC0xLjYsMzAuNi0xMC45LDQ3LjUtMTcsOS40LTMuNCwyMC4yLTcuMywyNC04LjdzMTYuMy01LjgsMjcuNi05LjlTOTQzLDU4NSw5NDMuMyw1ODVhNDUuNTYsNDUuNTYsMCwwLDAsNC4zLTEuNywzNiwzNiwwLDAsMSw1LjMtMS45IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTc2LjMgLTM3OC43MykiLz48cGF0aCBkPSJNMjk3LjIsNzgxLjNjLTIzLjYtMzQuMy0yNS42LTM3LjMtMjQuNi0zOC4yLjUtLjUsNC4zLTEuNCw4LjQtMmwzNy01LjVjNzEuNC0xMC45LDgyLjQtMTIuNiw4My4yLTEyLjYuNCwwLC44LDcuNy44LDE3LDAsMTEuMy0uNCwxNy0xLjEsMTdhMzYuODUsMzYuODUsMCwwLDAtNS43LDIuMWMtMi42LDEuMi0xMC4zLDQuNi0xNy4yLDcuNi0xMi42LDUuNS0yMC4xLDguOS0yMy4xLDEwLjMtLjkuNS02LjEsMi43LTExLjUsNXMtMTIuNiw1LjUtMTUuOSw3Yy0xMC40LDQuOC0xNy43LDgtMTguNiw4QzMwOC41LDc5NywzMDMuMiw3ODkuOSwyOTcuMiw3ODEuM1oiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xNzYuMyAtMzc4LjczKSIvPjxwYXRoIGQ9Ik04NDMuOCw3NzYuNyw3OTgsNzU2LjVWNzM5LjhjMC05LjMuNC0xNi44LjgtMTYuOC44LDAsMTEuOCwxLjcsODMuMiwxMi42bDM3LDUuNWM0LjEuNiw3LjksMS40LDguNCwxLjlzLTEuMiwzLjYtMy41LDctNS4yLDcuNi02LjEsOS4xLTQuNiw2LjgtOCwxMS43LTksMTIuNy0xMi4yLDE3LjUtNi40LDguNy03LDguN1M4NjguOSw3ODcuOCw4NDMuOCw3NzYuN1oiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xNzYuMyAtMzc4LjczKSIvPjxwYXRoIGQ9Ik0yMDkuNyw2NTRjLTE4LjYtMjctMzMuNi00OS40LTMzLjQtNDkuNy41LS40LDI4LjgsNy43LDk4LjIsMjguMiw5LjksMywyOSw4LjYsNDIuNSwxMi41LDQ4LjMsMTQuMiw2OC42LDIwLjIsNzYuOCwyMi42bDguMiwyLjV2MjguN2wtMTUuNy4xYy04LjcuMS0xOC41LjMtMjEuOC42LTYsLjQtMzMuNywxLjMtNjIsMi04LjIuMi0yNC45LjctMzcsMWwtMjIsLjdaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTc2LjMgLTM3OC43MykiLz48cGF0aCBkPSJNOTMwLjcsNzAyLjRjLS4xLS4xLTExLjItLjUtMjQuNy0uNy0zMS4yLS43LTYzLjgtMS42LTcxLjUtMi4yLTMuMy0uMy0xMi45LS41LTIxLjItLjZsLTE1LjMtLjFWNjcwLjFsOC4zLTIuNWM4LjEtMi40LDI4LjQtOC40LDc2LjctMjIuNiwxMy41LTMuOSwzMi42LTkuNSw0Mi41LTEyLjUsNjYuNi0xOS42LDk3LjctMjguNiw5OC4xLTI4LjMuMi4zLTIuMiw0LjItNS40LDguN3MtNi40LDkuMy03LjIsMTAuNi05LjQsMTMuNy0xOSwyNy41LTE3LjksMjUuOS0xOC41LDI2LjhjLTIuNiw0LjItMTIuMiwxOC4xLTE0LjgsMjEuNWwtMi45LDMuOC0xMi40LS4yQzkzNi41LDcwMi43LDkzMC45LDcwMi41LDkzMC43LDcwMi40WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTE3Ni4zIC0zNzguNzMpIi8+PC9nPjwvZz48ZyBpZD0i5Zu+5bGCXzUiIGRhdGEtbmFtZT0i5Zu+5bGCIDUiPjxnIGlkPSLlm77lsYJfMyIgZGF0YS1uYW1lPSLlm77lsYIgMyI+PHBhdGggY2xhc3M9ImNscy0xIiBkPSJNNzQ1LjU5LDUwN0g2MjEuODJWMzgzLjIzSDU3OC4xNVY1MDdINDU0LjQxdjQzLjY2SDU3OC4xNVY2NzQuNDJoNDMuNjdWNTUwLjY3SDc0NS41OVoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xNzYuMyAtMzc4LjczKSIvPjwvZz48L2c+PC9zdmc+);
    --edit-meta-mask: url(data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' id='Meta-Tags-Icon' x='0' y='0' baseProfile='tiny' overflow='visible' version='1.2' viewBox='0 0 200 200' xml:space='preserve'%3E%3Cpath d='M78.4 20.7 7.7 91.5 110.2 194l63.6-7.1 7.1-63.6L78.4 20.7zm35.5 162.8-92.1-92 56.6-56.6 92.1 92.1-5.7 50.9-50.9 5.6z'/%3E%3Cpath d='m180.9 123.3-5.3 47.4 16.8-30.4-55.5-134-51.6 21.4zM61.6 37.5l-17.1 7.1 3 7.1zm79.8 153 20.1 5.9 4.7-8.6z'/%3E%3Cpath d='M154.4 153.9c2.6 0 5.1 1 7.1 2.9 3.9 3.9 3.9 10.2 0 14.1-2 2-4.5 2.9-7.1 2.9s-5.1-1-7.1-2.9c-3.9-3.9-3.9-10.2 0-14.1 2-1.9 4.5-2.9 7.1-2.9m0-10c-5.3 0-10.4 2.1-14.1 5.9-7.8 7.8-7.8 20.5 0 28.3 3.8 3.8 8.8 5.9 14.1 5.9 5.3 0 10.4-2.1 14.1-5.9 7.8-7.8 7.8-20.5 0-28.3-3.7-3.8-8.8-5.9-14.1-5.9z'/%3E%3Cpath fill='none' stroke='%23000000' stroke-miterlimit='10' stroke-width='10' d='M65 105.2v-30h30m33.5 33.6v30h-30m-11.3-8.7 19.1-46.2'/%3E%3C/svg%3E);
    --watchers-mask: url(data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' id='Watchers-Icon' x='0' y='0' baseProfile='tiny' overflow='visible' version='1.2' viewBox='0 0 200 200' xml:space='preserve'%3E%3Cpath d='M76.9 124.8c-5.8-10.1-5.7-22.7.1-32.9l8.7 5c-4.1 7.1-4.1 15.9-.1 23l-8.7 4.9zm-67.3.5-9.2-4C27.5 56.5 98.3 18 158.8 25.8l-1 10c-56.5-7.4-123 28.8-148.2 89.5z'/%3E%3Cpath d='M111.8 51.2C47.9 63.9 10.6 136.8 8.2 167.1 89.8 198.2 188.3 131.5 200 54.6c-14.3-4.9-48-14.2-88.2-3.4zm29.2 80.9c-3.6 3.2-7.5 6.1-11.5 8.8l-9.4-16.6c6.2-7 3.8-19.4-5.1-23.2-7.4-2.8-11.3-12.5-8-19.7-20 9-21.3 48.7 4.4 47.9l9.6 16.8c-25.9 14.8-57.2 19.6-86.4 13.3l2.1-9.8c12.7 3.1 38.2 4.3 59.4-3.3-33.2-6.7-40.2-55.6-10.1-71.8 28-17.7 65 10.5 57 41.9 8.6-9.2 15.8-19.9 21-31.5l9.1 4.1c-7.4 16.5-18.5 31.4-32.1 43.1z'/%3E%3C/svg%3E);
    --backlinks-mask: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA4NDcuMzEgNjEzLjYzIj48ZyBpZD0iTGF5ZXJfMSIgZGF0YS1uYW1lPSJMYXllciAxIj48ZyBpZD0ibGF5ZXIxMDEiPjxwYXRoIGQ9Ik05OTEuMDUsNDY5LjQyYy0zOC40MSwyMi4xOC03Miw0MS41NS03OCw0NS4wOC0xMS4zLDYuNi01OC4zLDMzLjctOTAsNTItNi45LDQtMjEuNSwxMi40LTMyLjUsMTguN3MtMjguMSwxNi4zLTM4LDIybC0xOCwxMC40LS4zLDU1LjEtLjIsNTUuMi03LjgsNC40Yy00LjIsMi40LTI1LjUsMTQuNi00Ny4yLDI3LjItNDQsMjUuNC01Mi43LDMwLjQtNjguMiwzOS40bC0xMC43LDYuMi02LjgtMy45Yy0zLjgtMi4xLTMwLjQtMTcuNS01OS4zLTM0LjJzLTU2LTMyLjMtNjAuMi0zNC43bC03LjgtNC40LS4yLTU1LjEtLjMtNTUuMi0yNy0xNS42Yy0xNC44LTguNi01My44LTMxLjEtODYuNS01MHMtNjMuNS0zNi43LTY4LjUtMzkuNWMtMy44My0yLjI3LTI5LjQ0LTE3LjA3LTYxLjc1LTM1LjcxbDMzLjA5LDEwNy41OEwyNjksNTg5LjVjMTcuOSw2LjQsMzQuOCwxMi41LDM3LjUsMTMuNXMxMS4zLDQsMTksNi44LDI2LjIsOS40LDQxLDE0LjcsMzQuMiwxMi4zLDQzLDE1LjVsMTYsNS44LjMsNTIuNC4zLDUyLjMsMzcuMiwyMS40YzQyLjQsMjQuNSw1OC4xLDMzLjUsMTAzLjcsNjAsMTcuOSwxMC40LDMyLjUsMTksMzIuNiwxOVM2MjYuNSw4MzUuMiw2MzAsODMzYy44LS41LDMuOC0yLjEsNi41LTMuNmE1Ni42OCw1Ni42OCwwLDAsMCw2LjUtMy44LDI4LjQ0LDI4LjQ0LDAsMCwxLDQuNS0yLjZjMi45LTEuNCwyMi41LTEyLjgsMzctMjEuNCwxMC44LTYuNCwxMC45LTYuNSwxMi41LTcuMywxLjktLjksNTMuNC0zMC41LDU4LTMzLjMsNi45LTQuMiwxNy4zLTEwLDE4LjEtMTAsLjUsMCwxLTIyLDEuMS01Mi43bC4zLTUyLjcsOC0yLjljNC40LTEuNSw5LjYtMy41LDExLjUtNC40czQuMi0xLjcsNS0xLjksNi0xLjksMTEuNS0zLjksMTEuMS00LDEyLjUtNC41YzQuOC0xLjYsMzAuNi0xMC45LDQ3LjUtMTcsOS40LTMuNCwyMC4yLTcuMywyNC04LjdzMTYuMy01LjgsMjcuNi05LjlTOTQzLDU4NSw5NDMuMyw1ODVhNDUuNTYsNDUuNTYsMCwwLDAsNC4zLTEuNywzNiwzNiwwLDAsMSw1LjMtMS45IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTc2LjMgLTIzNy4yNykiLz48cGF0aCBkPSJNMjk3LjIsNzgxLjNjLTIzLjYtMzQuMy0yNS42LTM3LjMtMjQuNi0zOC4yLjUtLjUsNC4zLTEuNCw4LjQtMmwzNy01LjVjNzEuNC0xMC45LDgyLjQtMTIuNiw4My4yLTEyLjYuNCwwLC44LDcuNy44LDE3LDAsMTEuMy0uNCwxNy0xLjEsMTdhMzYuODUsMzYuODUsMCwwLDAtNS43LDIuMWMtMi42LDEuMi0xMC4zLDQuNi0xNy4yLDcuNi0xMi42LDUuNS0yMC4xLDguOS0yMy4xLDEwLjMtLjkuNS02LjEsMi43LTExLjUsNXMtMTIuNiw1LjUtMTUuOSw3Yy0xMC40LDQuOC0xNy43LDgtMTguNiw4QzMwOC41LDc5NywzMDMuMiw3ODkuOSwyOTcuMiw3ODEuM1oiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xNzYuMyAtMjM3LjI3KSIvPjxwYXRoIGQ9Ik04NDMuOCw3NzYuNyw3OTgsNzU2LjVWNzM5LjhjMC05LjMuNC0xNi44LjgtMTYuOC44LDAsMTEuOCwxLjcsODMuMiwxMi42bDM3LDUuNWM0LjEuNiw3LjksMS40LDguNCwxLjlzLTEuMiwzLjYtMy41LDctNS4yLDcuNi02LjEsOS4xLTQuNiw2LjgtOCwxMS43LTksMTIuNy0xMi4yLDE3LjUtNi40LDguNy03LDguN1M4NjguOSw3ODcuOCw4NDMuOCw3NzYuN1oiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xNzYuMyAtMjM3LjI3KSIvPjxwYXRoIGQ9Ik0yMDkuNyw2NTRjLTE4LjYtMjctMzMuNi00OS40LTMzLjQtNDkuNy41LS40LDI4LjgsNy43LDk4LjIsMjguMiw5LjksMywyOSw4LjYsNDIuNSwxMi41LDQ4LjMsMTQuMiw2OC42LDIwLjIsNzYuOCwyMi42bDguMiwyLjV2MjguN2wtMTUuNy4xYy04LjcuMS0xOC41LjMtMjEuOC42LTYsLjQtMzMuNywxLjMtNjIsMi04LjIuMi0yNC45LjctMzcsMWwtMjIsLjdaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTc2LjMgLTIzNy4yNykiLz48cGF0aCBkPSJNOTMwLjcsNzAyLjRjLS4xLS4xLTExLjItLjUtMjQuNy0uNy0zMS4yLS43LTYzLjgtMS42LTcxLjUtMi4yLTMuMy0uMy0xMi45LS41LTIxLjItLjZsLTE1LjMtLjFWNjcwLjFsOC4zLTIuNWM4LjEtMi40LDI4LjQtOC40LDc2LjctMjIuNiwxMy41LTMuOSwzMi42LTkuNSw0Mi41LTEyLjUsNjYuNi0xOS42LDk3LjctMjguNiw5OC4xLTI4LjMuMi4zLTIuMiw0LjItNS40LDguN3MtNi40LDkuMy03LjIsMTAuNi05LjQsMTMuNy0xOSwyNy41LTE3LjksMjUuOS0xOC41LDI2LjhjLTIuNiw0LjItMTIuMiwxOC4xLTE0LjgsMjEuNWwtMi45LDMuOC0xMi40LS4yQzkzNi41LDcwMi43LDkzMC45LDcwMi41LDkzMC43LDcwMi40WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTE3Ni4zIC0yMzcuMjcpIi8+PC9nPjwvZz48ZyBpZD0i5Zu+5bGCXzQiIGRhdGEtbmFtZT0i5Zu+5bGCIDQiPjxwYXRoIGQ9Ik02MDEuMTgsNzMxLjE3YTU1Ljg5LDU1Ljg5LDAsMCwxLTU1Ljc3LTU1Ljg0bDAtNzQuN2E1NC45Miw1NC45MiwwLDAsMSwzNy4zOC01Mi4yN2wwLDY1YTE4LjU3LDE4LjU3LDAsMCwwLDE4Ljg4LDE4LDE5LjE3LDE5LjE3LDAsMCwwLDE4LjkxLTE4bDAtNjVhNTYuMDcsNTYuMDcsMCwwLDEsMzYuODgsNTIuNzVsMCw3NC43QzY1Nyw3MDYuMTUsNjMyLjM4LDczMC43NCw2MDEuMTgsNzMxLjE3Wm0tNTUuNjEtMzMwLDAtNzQuN2E1NS44MSw1NS44MSwwLDEsMSwxMTEuNjEuMDZsMCw3NC43YTU2LjExLDU2LjExLDAsMCwxLTM2Ljk0LDUyLjcxbDAtNTIuNzNhMTguNTksMTguNTksMCwwLDAtMTguODktMTgsMTkuMTYsMTkuMTYsMCwwLDAtMTguOSwxOGwwLDUyLjczQTU2LjA5LDU2LjA5LDAsMCwxLDU0NS41Nyw0MDEuMTRaTTY5NC4zNyw2NzVsMC03NC43YTkyLjM5LDkyLjM5LDAsMCwwLTc0LjY0LTkxLjQ0VjQ5M2M0My4wNy04Ljc2LDc0LjI5LTQ3LDc0Ljc2LTkxLjM1bDAtNzQuN2MtMi4xNy00OS42Ni00My40NS04OS4yMy05My4xMS04OS42OS01MC4wOSwwLTkxLDM5LTkzLjIsODkuNThsLS4wNSw3NC43QTkyLjQsOTIuNCwwLDAsMCw1ODIuODYsNDkzdjE1LjgyYy00My4wNiw4Ljc3LTc0LjI4LDQ3LTc0Ljc1LDkxLjM2bDAsNzQuN2MxLjczLDUwLjA5LDQzLDg5LjY2LDkzLjExLDg5LjY5czkxLjQyLTM5LjQ5LDkzLjItODkuNTlaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTc2LjMgLTIzNy4yNykiLz48L2c+PC9zdmc+);
    --view-source-mask: url(data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' id='View-Source-Icon' x='0' y='0' baseProfile='tiny' overflow='visible' version='1.2' viewBox='0 0 200 200' xml:space='preserve'%3E%3Cpath fill='none' stroke='%23000000' stroke-miterlimit='10' stroke-width='10' d='M69.2 139.9h-15v-60h15m-30 60h-15v-60h15m91.6 0h15v60h-15m30-60h15v60h-15m-44.8-70-32 80'/%3E%3Cpath d='M190 45v130H10V45h180m10-10H0v150h200V35z'/%3E%3Cpath d='M0 45h200V15H0v30zm59.9-20H180v10H59.9V25zm-20 0h10v10h-10V25zM20 25h10v10H20V25z'/%3E%3C/svg%3E);
    --parent-page-mask: url(data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' id='Parent-Page-Icon' x='0' y='0' baseProfile='tiny' overflow='visible' version='1.2' viewBox='0 0 200 200' xml:space='preserve'%3E%3Cpath d='M114.2 95.9c-.5-3.7-1.3-7.5-2.3-11.2-1-3.6-2.1-7.1-3.5-10.5l10-10-55-18.4 18.4 55.1L92 90.6c.7 2.7 1.2 5.4 1.6 8.1l1.3 9.3 7.9 5.2 2.1 1.4-8 30 16.2 19.9 15.8-59.1-14.7-9.5z'/%3E%3Cpath d='M160 70V0H0v130h40v70h160V70h-40zM59.9 10H140v10H59.9V10zm-20 0h10v10h-10V10zM20 10h10v10H20V10zm170 180H50v-90h20.9l-3.3-10H60V80h4.3L61 70H39.9v50H10V30h140v40h-23.2l-1.2 1.2-5.5 5.5c.4 1.1.7 2.2 1 3.2h59v10h-56.5l10.8 7.1 4.5 2.9H190V190z'/%3E%3C/svg%3E);
    --lock-page-mask: url(data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' id='Page-Lock-Icon' x='0' y='0' baseProfile='tiny' overflow='visible' version='1.2' viewBox='0 0 200 200' xml:space='preserve'%3E%3Cpath d='M140 120c5.5 0 10 4.5 10 10v50c0 5.5-4.5 10-10 10H60c-5.5 0-10-4.5-10-10v-50c0-5.5 4.5-10 10-10h80m0-10H60c-11 0-20 9-20 20v50c0 11 9 20 20 20h80c11 0 20-9 20-20v-50c0-11-9-20-20-20z'/%3E%3Cpath d='M0 40v140h40v-10H10V50h180v120h-30v10h40V40z'/%3E%3Cpath fill='none' stroke='%23000000' stroke-miterlimit='10' stroke-width='10' d='M130 113H70V83c0-5.5 4.5-10 10-10h40c5.5 0 10 4.5 10 10v30z'/%3E%3Cpath d='M0 50h200V20H0v30zm59.9-20H180v10H59.9V30zm-20 0h10v10h-10V30zM20 30h10v10H20V30zm80 155c-2.8 0-5-2.2-5-5v-30c0-2.8 2.2-5 5-5s5 2.2 5 5v30c0 2.8-2.2 5-5 5z'/%3E%3Cpath d='M105 160H95c-5.5 0-10-4.5-10-10v-10c0-5.5 4.5-10 10-10h10c5.5 0 10 4.5 10 10v10c0 5.5-4.5 10-10 10z'/%3E%3C/svg%3E);
    --rename-mask: url(data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' id='Rename-Icon' x='0' y='0' baseProfile='tiny' overflow='visible' version='1.2' viewBox='0 0 200 200' xml:space='preserve'%3E%3Cpath d='M80 140h20v20H80zm-30 0h20v20H50zm-30 0h20v20H20z'/%3E%3Cpath d='M190 110h-16l3.4 10H190v50H10v-50h81.2l-10-10H0v70h200v-70z'/%3E%3Cpath d='m179.9 159.2-53.1-17.7 35.4-35.4z'/%3E%3Cpath d='M24.1 13.4h50v30h-50z' transform='matrix(0.7071 -0.7071 0.7071 0.7071 -5.6833 42.9942)'/%3E%3Cpath d='M76.8 31.1h50v100h-50z' transform='matrix(0.7071 -0.7071 0.7071 0.7071 -27.5307 95.7386)'/%3E%3C/svg%3E);
    --delete-mask: url(data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' id='Delete-Icon' x='0' y='0' baseProfile='tiny' overflow='visible' version='1.2' viewBox='0 0 200 200' xml:space='preserve'%3E%3Cpath d='M150 70v120H50V70h100m10-10H40v140h120V60zm10-30v20H30V30h140m10-10H20v40h160V20z'/%3E%3Cpath d='M95 90h10v80H95zm30 0h10v80h-10zm-60 0h10v80H65zm55-80v10H80V10h40m10-10H70v30h60V0z'/%3E%3C/svg%3E);
}
:root {
    --theme-base: "black-highlighter";
    --theme-id: "liminal";
    --theme-name: "Liminal Theme";
    --logo-image: url(https://github.backroomswiki.cn/New_BHL/image/logo.svg);
    --header-title: "The Backrooms ARI";
    --header-subtitle: "凡间秘境，人间净土";
    --body-font: Inter, "Noto Sans SC", "Noto Sans TC", Arimo, Verdana, Geneva, sans-serif;
    --header-font: Inter, "Noto Sans SC", "Noto Sans TC", Franklin Gothic Medium, Franklin Gothic, ITC Franklin Gothic, Arial, sans-serif;
    --title-font: var(--header-font);
    --mono-font: Recursive, "Noto Serif SC", "Noto Serif TC", Consolas, monaco, monospace;
    --white-monochrome: 237, 233, 223;
    --pale-gray-monochrome: 255, 251, 240;
    --light-gray-monochrome: 160, 160, 160;
    --gray-monochrome: 72, 69, 60;
    --black-monochrome: 25, 20, 16;
    --bright-accent: 140, 136, 126;
    --medium-accent: 72, 69, 60;
    --dark-accent: 140, 136, 126;
    --pale-accent: 140, 136, 126;
    --swatch-topmenu-border-color: var(--medium-accent);
    --link-color: 230, 23, 68;
    --hover-link-color: 187, 0, 34;
    --visited-link-color: 150, 24, 43;
    --background-gradient-distance: 0rem;
    --gradient-header: linear-gradient(to top, rgba(var(--medium-accent)) 0%, rgba(var(--medium-accent), 0.90) 100%);
    --diagonal-stripes: linear-gradient(transparent 0);
    --rename-option: "记住：后室维基用户可以重命名/移动自己创建的页面，但请谨慎使用该功能（最好仅在名称中出现错误时使用）。只有工作人员允许删除页面，包括你自己创建的页面。若需自删，请在页面名称前面加上 deleted: 前缀，以方便工作人员追踪与核查。";
}
* {
    --gray-monochrome: 125, 125, 195;
}
content a, content {
    color: inherit;
}
content {background: #92c0cf;}
.scp-image-block {
        --box-shadow: rgba(var(--swatch-menubg-black-color), 0.1);
        display: flex;
        flex-flow: column nowrap;
        align-items: center;
        box-shadow: 0.125rem 0.125rem 0.25rem var(--box-shadow);
        border: 0.0625rem outset rgba(var(--swatch-primary-darkest), 0.25);
        width: 18.75rem;
    }
    .scp-image-block.block-right {
        float: right;
        clear: right;
        margin: 0 0 1em 2em;
    }
    .scp-image-block.block-left {
        float: left;
        clear: left;
        margin: 0 2em 1em 0;
    }
    .scp-image-block.block-center {
        margin-right: auto;
        margin-left: auto;
    }
    .scp-image-block img {
        border: 0;
        min-width: 100%;
    }
    .scp-image-block img[style*="width:"] {
        width: 100% !important;
    }
    .scp-image-block .scp-image-caption {
        --wght: 700;
        box-sizing: border-box;
        border-top: 0.0625rem outset rgba(var(--swatch-primary-darkest), 0.25);
        background-color: rgb(var(--swatch-secondary-color));
        padding: 0.25em 0.5em;
        font-weight: 700;
        font-size: 80%;
        line-height: 1.25;
        letter-spacing: 0.016em;
        text-align: center;
        background: white;
    }
    .scp-image-block .scp-image-caption > p {
        margin: 0;
        padding: 0;
    }
    .scp-image-caption {
        min-width: 100%;
    }
span.printuser.avatarhover a img {
    aspect-ratio: 1;
    height: 1rem;
    margin: .2rem;
    position: relative;
    top: 0.5rem;
}
        </style>`);
        fetch('https://api.codetabs.com/v1/proxy/?quest=https://ari-01.wikidot.com/' + urlDescription).then((r)=>r.text()).then((r)=>{try{
        let k = document.createRange().createContextualFragment(r).querySelector('#page-title').innerHTML, j = document.createRange().createContextualFragment(r).querySelector('#page-content').innerHTML;$('#page-title').html(k);$('#page-content').html(j);
        let styles = document.createRange().createContextualFragment(r).querySelectorAll('style:not(style#internal-style)');
            for (var q = 0;q < styles.length; q++) {
                $('head').append(`<style type="text/css">${styles[q].innerHTML}</style>`);
            }
         let a_s = document.createRange().createContextualFragment(r).querySelectorAll('div#page-content a');
            for (var q = 0;q < a_s.length; q++) {
                if (a_s[q].href !== 'javascript:;') {
                    $('div#page-content a').eq(q).attr('href',a_s[q].href + '?type=wikidot');
                }
            }
        }catch{}})
    }
   ari.getRawArticleFromGitHub = function(owner, repo, branch, path) {
      const rawUrl = `https://api.codetabs.com/v1/proxy/?quest=https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`;
      
      return $.ajax({
        url: rawUrl,
        type: 'GET',
        success: function(content) {
          return content;
        },
        error: function(xhr, status, error) {
          console.error('Failed of this file:', error);
        }
      });
    }

    ari.load = function(pageName, pageData) {
        if (!pageData) pageData = { title: "", text: "" };
        document.title = 'ARI BACKROOMS WIKI ' + pageName;
        
        Promiser.then(async function() {
            if (new URLSearchParams(location.search).get('type') !== 'wikidot'){$('div#page-title').html(pageData.title);
            $('div#page-content').html(ari.compiled(pageData.text));}
        }).then(function() {
            $('div#page-title').attr('data-type', 'ok');
            $('div#page-content').attr('data-type', 'ok');
            return 'Load Success!';
        });
    };
    ari.get = async function(pageName) {
        try {
            const response = await $.ajax({
                url: location.origin + '/' + pageName,
                type: 'GET'
            });
            return response;
        } catch (error) {
            console.error('Failed to load page:', pageName, error);
            return `[[Error loading ${pageName}]]`;
        }
    };
    fetch('https://api.codetabs.com/v1/proxy/?quest=https://raw.githubusercontent.com/ari-backrooms/ari-backrooms.github.io/main/file/list.ari').then((r)=>r.text()).then((r)=>{
         var flag = false;
            const USER_NAME = window.md5(userName,7052003573572707903803022199967739299123921899991649819971n);
            const USER_PASSWORD = window.md5(userPassword,7052003573572707903803022199967739299123921899991649819971n)
            const LISTS = r.split('\n');
            function p(n) {
              if (LISTS[n] === USER_NAME + ' | ' + USER_PASSWORD + ' | ') flag = true;
              if (n < LISTS.length - 2) {
                p(n+1);
              }
            }
            p(0);
            if (!flag) {
                localStorage.login_0x88 = 0;
                delete localStorage.login_0x89;
                delete localStorage.login_0x90;
                delete localStorage.login_0x91;
                history.go();
            }
    })
    ari.compiled = (t) => {
        t = document.createRange().createContextualFragment('<tp-ari-compiled>' + t + '</tp-ari-compiled>');
        let f = t.querySelectorAll('tp-ari-compiled *');
        let urlDescription = location.href.slice(location.origin.length+1,-1) + location.href[location.href.length - 1];
        var flag = false
        var i = 0;
        function iFor() {
            if (i >= f.length) return;
            if (urlDescription.split(':')[0] !== 'component' && f[i].tagName === 'SCRIPT') {f[i].outerHTML = '';} // NONE XSS
            if (f[i].tagName !== 'STYLE' && f[i].tagName !== 'DIV' && f[i].tagName !== 'SPAN' && f[i].tagName !== 'UL' && f[i].tagName !== 'OL' && f[i].tagName !== 'LI' && f[i].tagName !== 'TABLE' && f[i].tagName !== 'TBODY' && f[i].tagName !== 'TR' && f[i].tagName !== 'THEAD' && f[i].tagName !== 'TH'
               && f[i].tagName !== 'H1' && f[i].tagName !== 'IMPORT' && f[i].tagName !== 'H2' && f[i].tagName !== 'H3' && f[i].tagName !== 'IMG' && f[i].tagName !== 'IFRAME' && f[i].tagName !== 'H4' && f[i].tagName !== 'H5' && f[i].tagName !== 'H6' && f[i].tagName !== 'BLOCKQUOTE' && f[i].tagName !== 'A' && f[i].tagName !== 'P'  && f[i].tagName !== 'BR' && f[i].tagName !== 'HR') {
                // out of the tag limit
                flag = true;
            }
            // change it
            var l = 0;
            function lFor() {
                if (l >= ari.componentsList.length) return;
                if (ari.componentsList[l].target === f[i].tagName) {
                    flag = false;
                    ari.get(ari.componentsList[l].URL).then((r)=>{
                        try { 
                            $('iframe[hidden][id="gets-somt-iframe"]')[0].contentWindow.document.querySelector('html').innerHTML = r;
                            var v = ($('iframe[hidden][id="gets-somt-iframe"]')[0].contentWindow.document.querySelector('body script')
                                     .innerHTML.slice(
                                         $('iframe[hidden][id="gets-somt-iframe"]')[0].contentWindow.document.querySelector('body script').innerHTML
                                         .split('{')[0].length+$('iframe[hidden][id="gets-somt-iframe"]')[0].contentWindow.document.querySelector('body script')
                                     .innerHTML.split('{')[1].length,-1)); 
                            var k = v.slice(1,-1 - (v.split('}').at(-1).length+v.split('}').at(-2).length));
                            r = eval(`(${k})`);
                        } catch{}
                        var isErrored = false;
                        for (var h = 0;h < ari.componentsList[l].targetStrings.length;h++) {
                            if ($(f[i]).attr(ari.componentsList[l].targetStrings[h]) === '' || $(f[i]).attr(ari.componentsList[l].targetStrings[h]) === 'null') {
                                isErrored = true;
                                f[i].outerHTML = '<div id="errorer-titles">Your config is error, please add the choose `' + ari.componentsList[l].targetStrings + '`</div>'
                            }
                            else {
                                r.text = r.text.replace(ari.componentsList[l].targetStrings[h],$(f[i]).attr(ari.componentsList[l].targetStrings[h]));
                            }
                        }
                        if (!isErrored) f[i].outerHTML = r.text;
                    })
                }
            } // end the function
            lFor()
            if (f[i].tagName === 'IMPORT') {
                ari.componentsList.push({
                    URL: $(f[i]).attr('src'),
                    target: $(f[i]).attr('toDoElement') || $(f[i]).attr('src').slice(1),
                    targetStrings: []
                })
                ari.get(ari.componentsList.at(-1).URL).then((r)=>{
                        if (r.startsWith('[[Error loading ')) {
                            $('div#page-content import[src="' + r.split('[[Error loading ')[1].split(']]')[0] + '"]').html('<div id="errorer-titles">Failed to load the page.</div>')
                        }
                        try { 
                            $('iframe[hidden][id="gets-somt-iframe"]')[0].contentWindow.document.querySelector('html').innerHTML = r;
                            var v = ($('iframe[hidden][id="gets-somt-iframe"]')[0].contentWindow.document.querySelector('body script')
                                     .innerHTML.slice(
                                         $('iframe[hidden][id="gets-somt-iframe"]')[0].contentWindow.document.querySelector('body script').innerHTML
                                         .split('{')[0].length+$('iframe[hidden][id="gets-somt-iframe"]')[0].contentWindow.document.querySelector('body script')
                                     .innerHTML.split('{')[1].length,-1)); 
                            var k = v.slice(1,-1 - (v.split('}').at(-1).length+v.split('}').at(-2).length));
                            r = eval(`(${k})`);
                        } catch{}
                        try {
                            let matches = [...r.text.matchAll(/\{\$([^}]+)\}/g)];
                            matches.forEach(match => {
                              ari.componentsList.targetStrings.push(match[1]);
                            });
                        } catch{}
                })
            }
            if (flag) {
                try{ f[i].outerHTML = ''; } catch{}
            }
            if (f[i].id !== '' && !f[i].id.startsWith('U-')) {
                f[i].id = 'U-' + f[i].id;
            }
            i++; iFor();
        }
        iFor();
        return t.querySelector('tp-ari-compiled').innerHTML;
    }
    // THE NAV
    ari.get('nav:top').then((r)=>{
        $('iframe[hidden][id="gets-somt-iframe"]')[0].contentWindow.document.querySelector('html').innerHTML = r;
        var t = eval(`(${'{' + $('iframe[hidden][id="gets-somt-iframe"]')[0].contentWindow.document.querySelector('body script').innerHTML.split('{')[2].split('}')[0].slice(1,-2) + '}'})`)
       $('#page-chooses').html(t.text)
       $('#page-chooses').attr('data-type','ok');
    })
    ari.user = {}
    
    $('div#page-button[edit-button]').on('click',function(){ari.user.edit()});
    $('div#page-button[tags-button]').on('click',function(){ari.user.tag()});
    $('div#page-button[source-button]').on('click',function(){ari.user.source()});

    ari.user.edit = () => {
        if (!islogin() || !userName || !userPassword) {
            $('body').append('<ui-alert>抱歉，你尚未登录，请登录。<ui-cancel onclick="this.parentNode.outerHTML=\'\'">关闭</ui-alert>')
        }

        window.onbeforeunload = (e) => {
            const MESSAGE = '我们不希望你的文章在编辑页面时意外脱离导致消失';
            e.returnValue = MESSAGE;
            return MESSAGE;
        }
        document.body.style.cursor = 'wait'
        let PageURL = location.href.slice(location.origin.length+1,-1) + location.href[location.href.length - 1]
        if (PageURL.at(-1) === '/') PageURL += 'index.html';
        $('body').append('<div id="edit-action" style="display:none"><input type="text" id="edit-title"><textarea id="edit-content"></textarea><div id="tools"><button id="cancel">取消</button><button id="preview">预览</button><button id="save">保存</button></div></div>')
        ari.getRawArticleFromGitHub('ari-backrooms','ari-backrooms.github.io','main',PageURL).then(function(r){
            document.body.style.cursor = ''
            try {r = document.createRange().createContextualFragment(r);}catch{}
            $('#page-bottom-buttons').remove();
            $('div#edit-action').fadeIn(500);
            try { 
                var v = ($('body script').eq(0).html().slice($('body script').eq(0).html().split('{')[0].length+$('body script').eq(0).html().split('{')[1].length,-1)); 
                var k = v.slice(1,-1 - (v.split('}').at(-1).length+v.split('}').at(-2).length));
                r = eval(`(${k})`);
            } catch{}
            try {
                $('div#edit-action textarea#edit-content').val(r.text);
                $('div#edit-action input#edit-title').val(r.title);
            } catch {
                $('div#edit-action textarea#edit-content').val('');
                $('div#edit-action input#edit-title').val('');
            }
            $('button#cancel').on('click', () => {
                window.onbeforeunload = null;
                location.reload();
            })
            $('button#preview').on('click', () => {
                $('#edit-action').attr('class','closed');
                ari.load('(EDITING PAGE PREVIEW)',{
                    title: $('input#edit-title').val(),
                    text: ari.compiled($('textarea#edit-content').val())
                })
                setTimeout(function(){
                    $('#edit-action')[0].onclick = function(){
                        if ($(this).attr('class') === 'closed') {
                            $(this).attr('class','');
                        }
                        setTimeout(function(){$('#edit-action')[0].onclick = null;},50)
                    }
                },500)
            })
        });
    }
    $('head').append('<script src="history.js"></script>')
    let m = getislogin();
    if (!getislogin()) {
        $('#headimage').css({width:'66.66667%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'})
        $('#headimage').html('登录');
        $('#contentText').html('注册')
        $('#headimage').on('click',function(){
            window.open(location.origin + '/gets.noneuser/login');
        })
        $('#contentText').on('click',function(){
            window.open(location.origin + '/gets.noneuser/register');
        })
        var t = setInterval(function(){
            if (m) {
                clearInterval(t)
                location.reload();
            }
        })
    } else {
         var t = setInterval(function(){
            if (!m) {
                clearInterval(t)
                location.reload();
            }
        })
    }
});
