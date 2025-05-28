$(document).ready(function() {
    var Promiser = new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        });
    });

    var ari = window.ari = {};
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
               && f[i].tagName !== 'H1' && f[i].tagName !== 'H2' && f[i].tagName !== 'H3' && f[i].tagName !== 'IFRAME' && f[i].tagName !== 'H4' && f[i].tagName !== 'H5' && f[i].tagName !== 'H6' && f[i].tagName !== 'BLOCKQUOTE') {
                // out of the tag limit
                f[i].outerHTML = '';
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
});
