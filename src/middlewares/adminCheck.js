const adminCheck = (req, res, next) => {
    if (req.session.user && req.session.user.rol.name == 'Admin'){
        return next();
    }    
    res.redirect('/');
    }

module.exports = adminCheck;