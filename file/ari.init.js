$(document).ready(function() {
    var Promiser = new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        },100);
    });
    var ari = window.ari = {};
    ari.pageCache = {};
    // #nav : start //
    var chooses = $('#page-chooses')

    Promiser.then(function(){
        $('iframe#gets-somt-iframe').html(ari.get('nav:top'))
    }).then(function(){
        try {
            chooses.html($('iframe#gets-somt-iframe')[0].contentWindow.$('#page-content'))
            chooses.attr('data-type','ok')
        }
        catch {
            return new TypeError('nav:top iframe is not loaded')
        }
    })
    // #nav : end //
    ari.load = function(pageName, pageData) {
        if (!pageData) pageData = { title: "", text: "" };
        document.title = 'ARI BACKROOMS WIKI ' + pageName;
        
        Promiser.then(async function() {
            let processedContent = await ari.processIncludes(pageData.text);
            processedContent = await ari.processExpressions(processedContent);
            $('div#page-title').html(pageData.title);
            $('div#page-content').html(ari.compiled(processedContent));
        }).then(function() {
            $('div#page-title').attr('data-type', 'ok');
            $('div#page-content').attr('data-type', 'ok');
            return 'Load Success!';
        });
    };

    ari.get = async function(pageName) {
        if (ari.pageCache[pageName]) {
            return ari.pageCache[pageName];
        }

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

    ari.processIncludes = async function(content) {
        const includeRegex = /\[\[include\s+([^\]]+)\]\]/gi;
        const matches = content.match(includeRegex) || [];
        
        for (const match of matches) {
            const pageName = match.replace(/\[\[include\s+|\]\]/gi, '').trim();
            try {
                const includedContent = await ari.get(pageName);
                content = content.replace(match, includedContent);
            } catch (error) {
                console.error('Error including page:', pageName, error);
                content = content.replace(match, `[[Error including ${pageName}]]`);
            }
        }
        
        return content;
    };

    ari.processExpressions = async function(content) {
        content = content.replace(/\[\[#expr\s+(.+?)\]\]/gi, (match, expr) => {
            try {
                return ari.evaluateExpression(expr);
            } catch (e) {
                console.error('Expression error:', e);
                return `[[Expression error: ${expr}]]`;
            }
        });
        
        content = content.replace(/\[\[#ifexpr\s+(.+?)\s+then\s+(.+?)(?:\s+else\s+(.+?))?\]\]/gi, 
            (match, condition, thenPart, elsePart) => {
                try {
                    const result = ari.evaluateExpression(condition);
                    return result ? thenPart : (elsePart || '');
                } catch (e) {
                    console.error('Condition error:', e);
                    return `[[Condition error: ${condition}]]`;
                }
            });
        
        return content;
    };

    ari.evaluateExpression = function(expr) {
        expr = expr.replace(/\{\{\w+\}\}/g, '0');
        
        const safeEval = (str) => {
            if (/^[\d\s+\-*\/%().<>!=&|]+$/.test(str)) {
                return new Function('return ' + str)();
            }
            return 0;
        };
        
        if (expr.includes('&&') || expr.includes('||')) {
            const parts = expr.split(/(&&|\|\|)/);
            let result = safeEval(parts[0].trim());
            
            for (let i = 1; i < parts.length; i += 2) {
                const op = parts[i];
                const nextVal = safeEval(parts[i+1].trim());
                result = op === '&&' ? result && nextVal : result || nextVal;
            }
            
            return result;
        }
        
        return safeEval(expr);
    };

    ari.compiled = function(wikidotText) {
        let lines = wikidotText.split('\n');
        let html = '';
        let inList = false;
        let inTable = false;
        let inBlockquote = false;
        let inCode = false;

        for (let i = 0; i < lines.length; i++) {
            let line = lines[i].trimRight();
            if (line.startsWith('[code]')) {
                inCode = true;
                html += '<pre><code>';
                continue;
            }
            if (line.endsWith('[/code]') && inCode) {
                inCode = false;
                html += line.replace('[/code]', '') + '</code></pre>';
                continue;
            }
            if (inCode) {
                html += line + '\n';
                continue;
            }
            if (line.match(/^\++ /)) {
                const level = Math.min(line.match(/^(\++)/)[0].length, 6);
                const titleText = line.replace(/^\++\s*/, '').trim();
                html += `<h${level}>${titleText}</h${level}>`;
                continue;
            }
            if (line.match(/^[*#]\s/)) {
                if (!inList) {
                    const tag = line.startsWith('*') ? 'ul' : 'ol';
                    html += `<${tag}>`;
                    inList = true;
                }
                html += `<li>${line.substring(2).trim()}</li>`;
                continue;
            } else if (inList) {
                html += inList.startsWith('*') ? '</ul>' : '</ol>';
                inList = false;
            }
            if (line.match(/^\|.+\|$/)) {
                if (!inTable) {
                    html += '<table>';
                    inTable = true;
                }
                const cells = line.slice(1, -1).split('|').map(cell => cell.trim());
                html += '<tr>' + cells.map(cell => `<td>${cell}</td>`).join('') + '</tr>';
                continue;
            } else if (inTable) {
                html += '</table>';
                inTable = false;
            }
            if (line.startsWith('> ')) {
                if (!inBlockquote) {
                    html += '<blockquote>';
                    inBlockquote = true;
                }
                html += line.substring(2).trim() + '<br>';
                continue;
            } else if (inBlockquote) {
                html += '</blockquote>';
                inBlockquote = false;
            }
            if (line.match(/^-{4,}$/)) {
                html += '<hr>';
                continue;
            }
            if (line) {
                line = line
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\/\/(.*?)\/\//g, '<em>$1</em>')
                    .replace(/__(.*?)__/g, '<u>$1</u>')
                    .replace(/--(.*?)--/g, '<del>$1</del>')
                    .replace(/@@@@/g,'<br />')
                    .replace(/@@(.*?)@@/g, '<code>$1</code>')
                    .replace(/\[\[\[(.*?)\]\]\]/g, '<a href="$1">$1</a>')
                    .replace(/\[\[(.*?)\|(.*?)\]\]/g, '<a href="$1">$2</a>');

                if (!html.endsWith('</p>') && !html.endsWith('<br>')) {
                    html += '<p>';
                } else if (html.endsWith('<br>')) {
                    html = html.slice(0, -4);
                }

                html += line + '<br>';
            } else if (html.endsWith('<br>')) {
                html = html.slice(0, -4) + '</p>';
            }
        }

        if (inList) html += inList.startsWith('*') ? '</ul>' : '</ol>';
        if (inTable) html += '</table>';
        if (inBlockquote) html += '</blockquote>';
        if (inCode) html += '</code></pre>';
        if (html.endsWith('<br>')) html = html.slice(0, -4) + '</p>';

        return html || '<p></p>';
    };
    ari.user = {};
    $('#page-bottom-buttons #page-button[edit-button]').on('click',function(){
        ari.user.edit();
    })
    $('#page-bottom-buttons #page-button[tags-button]').on('click',function(){
        ari.user.tags();
    })
    $('#page-bottom-buttons #page-button[source-button]').on('click',function(){
        ari.user.source();
    })
});
