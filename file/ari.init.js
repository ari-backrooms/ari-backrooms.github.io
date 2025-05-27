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
            ari.pageCache[pageName] = response;
            return response;
        } catch (error) {
            console.error('Failed to load page:', pageName, error);
            return `[[Error loading ${pageName}]]`;
        }
    };

    ari.compiled = (t) => {
        return t;
    }
    
    ari.user = {};
});
