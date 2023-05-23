const blogRouter = require("./blogRoutes");
const videoRouter = require("./videoRoutes");
const categorieRouter = require("./categoriesRoute");
const paymentRouter = require("./paymentRoute");
const { Router } = require("express");
const passport = require("passport");
const router = Router();
const userRouter = require("./usersRoutes");


// Blog routes
router.use("/blog", blogRouter);

// Video routes
router.use("/video", videoRouter);

// Categories routes
router.use("/categories", categorieRouter);

// Users routes
router.use("/users", userRouter);

// payment Route

router.use("/payment", paymentRouter);

// Home
router.get('/', (req, res, next) => {
  res.render('index');
});


// Registar usuario
router.get('/signup', (req, res, next) => {
  res.render('signup');
});

router.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/users',
  failureRedirect: '/users',
  passReqToCallback: true
}), (req, res) => {
  return res.json({ data: req.user });
  
});

router.put("/update", passport.authenticate("local-changePassword", {
  successRedirect: '/users',
  failureRedirect: "/users",
  passReqToCallback: true,
}), (req, res) => {
  return res.json({ data: req.user }
  )
})

// Login usuario
router.get('/signin', (req, res, next) => {
  res.render('signin');
});

// router.post('/signin', passport.authenticate('local-signin', {
//   successRedirect: '/Home',
//   failureRedirect: '/signIn',
//   failureFlash: true
// }));

// router.post('/signin', passport.authenticate('local-signin', {
//   successRedirect: '/Home',
//   failureRedirect: '/signin',
//   failureFlash: true
// }), (req, res) => {
//   res.json({ user: req.user });
// });

// router.post('/signin', passport.authenticate('local-signin'), (req, res) => {
//   res.json({ user: req.user });
// }
// );



router.post('/signin', passport.authenticate('local-signin', {
  successRedirect: '/users',
  failureRedirect: '/users',
  failureFlash: true
}), (req, res) => {
    return res.json({ data: req.user });
    
  });

router.get('/logout', (req, res, next) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    
  });
});




// Proteger rutas
// router.use((req, res, next) => {
//   isLogIn(req, res, next);
//   next();
// });

// Perfil usuario
router.get('/profile',  (req, res, next) => {
  isLogIn(req, res, next);
  res.render('profile');
});


// // Ruta protegida
function isLogIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect('/signIn');
}

module.exports = router;
