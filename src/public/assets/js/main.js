function toggleSidebar(element){
    document.querySelector('#sidebar').classList.toggle('active');
    const i = element.firstChild;
    i.classList.remove(Array.from(i.classList).slice(-1));
    if(document.querySelector('#sidebar').classList.contains('active')){
        i.classList.add("bi-arrow-90deg-right");
    }else{
        i.classList.add("bi-arrow-90deg-left");
    }
}
function get(url){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", url, false );
    xmlHttp.send( null );
    return xmlHttp;
}
function updateEditor(recVal = "", input) {
    const gutter = document.querySelector('#gutter');
    let val = input.value + recVal,finalVal = "";
    let lineBreaks = val.match(/\n/gi) || [];
    let numOfSpans = gutter.childElementCount;
    let numOfLines = lineBreaks.length ? lineBreaks.length + 1 : 1;
    gutter.innerHTML = ""
    for(var i = 0; i < numOfLines; i++) {
        var el = document.createElement('span');
        el.innerHTML = i+1;
        gutter.appendChild(el);
        finalVal += val.split('\n')[i].trim() + "\n";
    }
    input.value = finalVal;
    input.setSelectionRange(val.length, val.length);
}
function getPosition(string, subString, index) {
    return string.split(subString, index).join(subString).length;
}
function resizeNavbar(scrollHeight = document.documentElement.scrollHeight){
    const navbar = document.getElementById('sidebar');
    if(navbar){
        scrollHeight += 'px';
        navbar.style.height = scrollHeight;
        navbar.firstElementChild.style.height = scrollHeight;
    }
}
window.addEventListener('load', e => {
    resizeNavbar()
    const url = location.href.substring(getPosition(location.href, '/', 3)).trim();
    if (url !== null && url !== "") {
        const showing = [...document.querySelectorAll('ul.collapse.show')];
        if(showing.length > 0){
           if(showing.find(() => true).classList.contains('show')) showing.find(() => true).classList.remove('show');
           const locator = url.split('/').map((val, i) => { if(val.trim().length > 0) return val });
           locator.forEach((e, i) => {
            if(e !== undefined){
                const el = document.getElementById(e);
                if(typeof(el) != 'undefined' && el != null && !el.classList.contains('show')) {
                    el.classList.add('show')
                    const link = el.querySelector(`a[href="${url}"]`)
                    if(typeof(link) != 'undefined' && link != null){
                        if(!link.classList.contains('active')) link.classList.add('active');
                    }
                };
            }
            });
        } 
    }
})