const express = require('express');
const routes = express.Router();
const recipesMain = require('./app/controllers/recipes/main');
const recipesAdmin = require('./app/controllers/recipes/admin');
const chefsMain = require('./app/controllers/chefs/main');
const chefsAdmin = require('./app/controllers/chefs/admin');


//Main Routes
routes.get("/", recipesMain.index);
routes.get("/sobre", recipesMain.about);
routes.get("/receitas", recipesMain.showAll);
routes.get("/receitas/:id", recipesMain.show);

routes.get("/chefs", chefsMain.showAll);
routes.get("/chefs/:id", chefsMain.show);

//Admin Routes
routes.get("/admin", (req, res) => res.redirect('/admin/recipes'))
routes.get("/admin/recipes", recipesAdmin.index);
routes.get("/admin/recipes/create", recipesAdmin.create);
routes.get("/admin/recipes/:id", recipesAdmin.show);
routes.get("/admin/recipes/:id/edit", recipesAdmin.edit);

routes.post("/admin/recipes", recipesAdmin.post);
routes.put("/admin/recipes", recipesAdmin.put);
routes.delete("/admin/recipes", recipesAdmin.delete);


routes.get("/admin/chefs", chefsAdmin.index);
routes.get("/admin/chefs/create", chefsAdmin.create);
routes.get("/admin/chefs/:id", chefsAdmin.show);
routes.get("/admin/chefs/:id/edit", chefsAdmin.edit);

routes.post("/admin/chefs", chefsAdmin.post);
routes.put("/admin/chefs", chefsAdmin.put);
routes.delete("/admin/chefs", chefsAdmin.delete);

module.exports = routes;