const express = require("express");
const nunjucks = require("nunjucks");
const recipes = require("./dataRecipes")

const server = express();

server.use(express.static('public'));

server.set("view engine", "njk");

nunjucks.configure("views", {
  express: server,
  autoescape: false,
  noCache: true,
});

server.get("/", (req, res) => {
  return res.render('home', { recipes })
});

server.get("/sobre", (req, res) => {
  return res.render("about")
})

server.get("/receitas", (req, res) => {
    return res.render("recipes", { recipes })
});

server.listen(5000, () => {
  console.log("Server is running!");
});
