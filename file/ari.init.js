$(document).ready(function() {
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
            moveBook = atob(atob(atob(atob(atob(atob(localStorage.login_0x91)))))).split('>');
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
            newString += String.fromCharCode(localStorage.login_0x90[i].charCodeAt() - moveBook[i % 128]);
        }


        fetch('https://ari-backrooms.github.io/file/descListARI.html?user=' + btoa(newString) + '&password=' + btoa(newPassword) + '&RAT=' + btoa(moveBook.toString())).then((R)=>{
            if (R.status === 404) flag = false;
            return R.text();
        }).then((R)=>{
            if (R.replace('TRUE | TRUE') !== R) {
                flag = true;
            }
            flag = false;
        })
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
        $('#page-title').html('调整中...');
        $('#page-content').html('调整中...');
        fetch('https://api.codetabs.com/v1/proxy/?quest=https://ari-01.wikidot.com/' + urlDescription).then((r)=>r.text()).then((r)=>{try{
        let k = document.createRange().createContextualFragment(r).querySelector('#page-title').innerHTML, j = document.createRange().createContextualFragment(r).querySelector('#page-content').innerHTML;$('#page-title').html(k);$('#page-content').html(j);}catch{}})
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
            $('div#page-title').html(pageData.title);
            $('div#page-content').html(ari.compiled(pageData.text));
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
               && f[i].tagName !== 'H1' && f[i].tagName !== 'IMPORT' && f[i].tagName !== 'H2' && f[i].tagName !== 'H3' && f[i].tagName !== 'IMG' && f[i].tagName !== 'IFRAME' && f[i].tagName !== 'H4' && f[i].tagName !== 'H5' && f[i].tagName !== 'H6' && f[i].tagName !== 'BLOCKQUOTE' && f[i].tagName !== 'A' && f[i].tagName !== 'P') {
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
    if (!localStorage.login_0x88) {
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
            if (localStorage.login_0x88) {
                clearInterval(t)
                location.reload();
            }
        })
    } else {
         var t = setInterval(function(){
            if (!localStorage.login_0x88) {
                clearInterval(t)
                location.reload();
            }
        })
    }
});
