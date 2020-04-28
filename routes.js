const express = require('express');
const routes = express.Router();
const main = require('./controllers/main');
const admin = require('./controllers/admin');


//Admin Routes
routes.get("/admin/recipes", admin.index);
routes.get("/admin/recipes/create", admin.create);
routes.get("/admin/recipes/:id", admin.show);
routes.get("/admin/recipes/:id/edit", admin.edit);

routes.post("/admin/recipes", admin.post);
routes.put("/admin/recipes", admin.put);
routes.delete("/admin/recipes", admin.delete);


//Main Routes
routes.get("/", main.index);
routes.get("/sobre", main.about);
routes.get("/receitas", main.recipes);
routes.get("/receitas/:id", main.details);

module.exports = routes;