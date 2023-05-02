// const blogrouter = require("./blogRoutes");
const { Router } = require("express");
const passport = require("passport");
const router = Router();

// Blog routes
// router.use("/blog", blogrouter);

// Video routes
// router.use("/blog", videoRouter);

// Home
router.get('/' , (req,res, next) => {
    res.render('index')
})

// Registar usuario
router.get('/signup' , (req,res, next) => {
    res.render('signup')
})

router.post('/signup' ,passport.authenticate('local-signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    passReqToCallback: true
}))


// Login usuario
router.get('/signin' , (req,res, next) => {
    res.render('signin')
})

router.post('/signin', passport.authenticate('local-signin', {
    successRedirect: '/profile',
    failureRedirect: '/signin',
    failureFlash: true
  }));

  router.get('/logout', (req, res, next) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
});


// Proteger rutas
router.use((req, res , next) => {
    isLogIn(req, res, next);
    next()
})

// Perfil usuario
router.get('/profile' ,(req,res, next) => {
    res.render('profile')
})


// Ruta protegida
function isLogIn(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    return res.redirect("/signin");
  }

module.exports = router;