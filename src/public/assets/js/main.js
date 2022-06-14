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