const data = require("../data.json");

exports.index = (req, res) => {
    return res.render("main/home", {recipes: data.recipes})
}

exports.about = (req, res) => {
    return res.render("main/about")
}

exports.recipes = (req, res) => {
    return res.render("main/recipes", {recipes: data.recipes})
}

exports.details =  (req, res) => {
    const id = req.params.id;
  
    const receita = data.recipes.find((receita) => {
      return id == receita.id;
    });
  
    if(!receita) {
      return res.render('not-found')
    };
  
    return res.render('main/recipe', { receita })
}