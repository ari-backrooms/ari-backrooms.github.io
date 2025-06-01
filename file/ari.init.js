$(document).ready(function() {
    var Promiser = new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        });
    });

    var ari = window.ari = {};
    ari.componentsList = {};
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
        for (var i = 0;i < f.length;i++) {
            if (urlDescription.split(':')[0] !== 'component' && f[i].tagName === 'SCRIPT') {f[i].outerHTML = '';} // NONE XSS
            if (f[i].tagName !== 'STYLE' && f[i].tagName !== 'DIV' && f[i].tagName !== 'SPAN' && f[i].tagName !== 'UL' && f[i].tagName !== 'OL' && f[i].tagName !== 'LI' && f[i].tagName !== 'TABLE' && f[i].tagName !== 'TBODY' && f[i].tagName !== 'TR' && f[i].tagName !== 'THEAD' && f[i].tagName !== 'TH'
               && f[i].tagName !== 'H1' && f[i].tagName !== 'IMPORT' && f[i].tagName !== 'H2' && f[i].tagName !== 'H3' && f[i].tagName !== 'IFRAME' && f[i].tagName !== 'H4' && f[i].tagName !== 'H5' && f[i].tagName !== 'H6' && f[i].tagName !== 'BLOCKQUOTE' && f[i].tagName !== 'A' && f[i].tagName !== 'P') {
                // out of the tag limit
                try{ f[i].outerHTML = ''; } catch{}
            }
            if (f[i].id !== '' && !f[i].id.startsWith('U-')) {
                f[i].id = 'U-' + f[i].id;
            }
        }
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
            r = document.createRange().createContextualFragment(r);
            $('#page-bottom-buttons').remove();
            $('div#edit-action').fadeIn(500);
            r = eval(`(${'{' + r.querySelector('main ~ script').innerHTML.split('{')[2].split('}')[0] + '}'})`);
            $('div#edit-action textarea#edit-content').html(r.text);
            $('div#edit-action input#edit-title').val(r.title);
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
    }
});
