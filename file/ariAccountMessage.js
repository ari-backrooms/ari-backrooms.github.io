$(function(){
  var promise = new Promise((resolveOuter) => { resolveOuter(new Promise((resolveInner) => {setTimeout(resolveInner, 10);}),);});
  promise.then(()=>{
    
  })
  promise.then(()=>{
    $('div#animations').fadeOut(500);
    $('div#relcontent').fadeIn(500);
  })
});
