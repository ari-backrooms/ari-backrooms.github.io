$(function(){
  var promise = new Promise((resolveOuter) => { resolveOuter(new Promise((resolveInner) => {setTimeout(resolveInner, 10);}),);});
  let userName, userPassword;
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
        if (!flag) return flag;
        userName = newString;
        userPassword = newPassword;
        return true;
    }
  promise.then(()=>{
    if (!getislogin() || !userName || !userPassword) {
      $('div#relcontent').append('<svg class="none-login-style" style="width: 1.0107421875em;height: 1em;vertical-align: middle;fill: white;overflow: hidden;" viewBox="0 0 1035 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4473"><path d="M647.149787 595.478261l-52.616601 52.616601 83.478261 83.478261-83.478261 83.47826 52.616601 52.616601 83.47826-83.478261 83.478261 83.478261 52.616601-52.616601-83.478261-83.47826 83.478261-83.478261-52.616601-52.616601-83.478261 83.478261-83.47826-83.478261z m82.972332-83.478261c121.422925 0 219.573123 97.644269 219.573122 219.573123 0 121.422925-97.644269 219.573123-219.573122 219.573122s-219.573123-97.644269-219.573123-219.573122c0-121.928854 97.644269-219.573123 219.573123-219.573123z m-364.774704-438.640316c101.185771 0 182.640316 81.454545 182.640316 182.640316s-81.454545 182.640316-182.640316 182.640316-182.640316-81.454545-182.640316-182.640316 80.948617-182.640316 182.640316-182.640316z m0-73.359684c-140.648221 0-256 114.84585-256 256 0 88.031621 45.027668 166.450593 113.328063 212.490119-130.529644 56.158103-222.608696 185.16996-222.608695 335.936758h73.359683c0-161.897233 130.529644-292.426877 292.426878-292.426877 50.086957 0 97.13834 13.15415 138.118577 35.41502-40.474308 50.086957-65.264822 114.339921-65.264822 184.158103 0 160.885375 131.541502 292.426877 292.426877 292.426877s292.426877-131.541502 292.426878-292.426877-131.541502-292.426877-292.426878-292.426878c-63.747036 0-122.940711 21.249012-171.509881 56.158103-16.189723-10.118577-33.391304-18.719368-51.604743-26.308301 68.300395-46.039526 113.328063-124.458498 113.328063-212.490118-0.505929-141.15415-115.857708-256.505929-256-256.505929z" p-id="4474"></path></svg>')
      $('div#relcontent').append('<h1>对不起，你尚未登陆</h1>');
      $('div#relcontent').append('<span>你可以选择 <button onclick="window.open(location.origin+\'/gets.noneuser/login/\')">登录</button> 和 <button onclick="window.open(location.origin+\'/gets.noneuser/register/\')">注册</button></span>');
    }
    else {
      $('div#relcontent').append('<div id="sidebar"></div>');
      if (location.search === '' || location.search === '?') {
        location.search = '?page=start';
      }
      let type = new URL(location.href).searchParams.get('page');
      let contentURLs = [['start','开始'],['messages','消息'],['guide','教程'],['userInfos','用户信息'],['yourContents','创建文章']]
      let flag = false;
      for (var i = 0;i < contentURLs.length;i++) {
        if (type === contentURLs[i][0]) flag = true;
        $('div#sidebar').append('<a id="kside" href="?page=' + contentURLs[i][0] + '">' + (navigator.language.replace('-')[0]!=='zh'?contentURLs[i][1]:contentURLs[i][0]) + '</a>')
      }
      if (!flag) {location.search = '?page=start';}
      
    }
  })
  promise.then(()=>{
    $('div#animations').fadeOut(500);
    $('div#relcontent').fadeIn(500);
  })
});
