const express = require('express');
const routes = express.Router();
const recipesMain = require('./controllers/recipesMain');
const recipesAdmin = require('./controllers/recipesAdmin');


//Admin Routes
routes.get("/admin/recipes", recipesAdmin.index);
routes.get("/admin/recipes/create", recipesAdmin.create);
routes.get("/admin/recipes/:id", recipesAdmin.show);
routes.get("/admin/recipes/:id/edit", recipesAdmin.edit);

routes.post("/admin/recipes", recipesAdmin.post);
routes.put("/admin/recipes", recipesAdmin.put);
routes.delete("/admin/recipes", recipesAdmin.delete);


//Main Routes
routes.get("/", recipesMain.index);
routes.get("/sobre", recipesMain.about);
routes.get("/receitas", recipesMain.showAll);
routes.get("/receitas/:id", recipesMain.show);

module.exports = routes;