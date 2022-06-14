const { response } = require('express');

function main(req, res){
    if(req.session.loggedin !== true){
        res.redirect('/auth/login');
    }else{
        res.status(200).render('dashboard', { title: 'ARMwall - Dashboard', layout: 'root' });
    }
}

module.exports = {
    main,
}