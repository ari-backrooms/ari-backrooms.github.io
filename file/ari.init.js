$(document).ready(function(){
  var ari = window.ari = {};
  ari.load = (a,t) => {
    if (!t) t = {title:"",text:""}
    document.title = 'ARI BACKROOMS WIKI ' + a;
    $('div#page-title').html(ari.compiled(t.title));
    $('div#page-content').html(ari.compiled(t.text));
    $('div#page-title').attr('data-type','ok');
    $('div#page-content').attr('data-type','ok');
    return 'Get Success!';
  }
  ari.get = async (a) => {
    return await $.ajax({
      get: location.origin + '/' + a,
      type: 'GET',
      success: function(t){
        return document.createRange().createContextualFragment(t);
      }
    })
  }
  ari.compiled = (x) => {
    return x; // do later
  }
})
