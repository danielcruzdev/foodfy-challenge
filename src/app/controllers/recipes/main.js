const Recipe = require("../../models/Recipes");
const { date } = require("../../../lib/utils");

module.exports = {
  async index(req, res) {
    const { filter } = req.query;

    if (filter) {
      let results = await Recipe.findBy(filter);
      let recipes = results.rows;

      return res.render("main/recipes", { recipes });
    } else {
      let results = await Recipe.index();
      let recipes = results.rows;
      return res.render("main/home", { recipes });
    }
  },
  about(req, res) {
    return res.render("main/about");
  },
  async showAll(req, res) {
    let { filter, page, limit } = req.query;

    page = page || 1;
    limit = limit || 6;
    let offset = limit * (page - 1);

    const params = {
      filter,
      page,
      limit,
      offset,
    };

    let results = await Recipe.paginate(params);
    let recipes = results.rows;

    const pagination = {
      total: Math.ceil(recipes[0].total / limit),
      page,
    };

    return res.render("main/recipes", { recipes, pagination, filter });
  },
  async show(req, res) {
    let result = await Recipe.find(req.params.id);
    let recipe = result.rows[0];

    if (!recipe) return res.send("Recipe not found!");

    recipe.created_at = date(recipe.created_at).format;

    return res.render("main/recipe", { recipe });
  },
};
