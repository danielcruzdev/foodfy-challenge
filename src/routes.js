const express = require('express');
const routes = express.Router();
const multer = require('./app/middlewares/multer')
const recipes = require('./app/controllers/recipes');
const chefs = require('./app/controllers/chefs');
const main = require('./app/controllers/main')


//Main Routes
routes.get("/", main.home);
routes.get("/sobre", main.about);
routes.get("/receitas", main.allRecipes);
routes.get("/receitas/:id", main.showRecipe);
routes.get("/chefs", main.allChefs);


//Admin Routes
routes.get("/admin", (req, res) => res.redirect('/admin/recipes'))
routes.get("/admin/recipes", recipes.index);
routes.get("/admin/recipe/create", recipes.create);
routes.get("/admin/recipe/:id", recipes.show);
routes.get("/admin/recipe/:id/edit", recipes.edit);

routes.post("/admin/recipes", multer.array("photos", 5), recipes.post);
routes.put("/admin/recipes", multer.array("photos", 5), recipes.put);
routes.delete("/admin/recipes", recipes.delete);


routes.get("/admin/chefs", chefs.index);
routes.get("/admin/chefs/create", chefs.create);
routes.get("/admin/chefs/:id", chefs.show);
routes.get("/admin/chefs/:id/edit", chefs.edit);

routes.post("/admin/chefs", multer.single("photo"), chefs.post);
routes.put("/admin/chefs", multer.single("photo"), chefs.put);
routes.delete("/admin/chefs", chefs.delete);

module.exports = routes;