const Recipe = require("../../models/Recipes");
const { date } = require("../../../lib/utils");

module.exports = {
  index(req, res) {
    const { filter } = req.query;

    if (filter) {
      Recipe.findBy(filter, (recipes) => {
        return res.render("main/recipes", { recipes });
      });
    } else {
      Recipe.index((recipes) => {
        return res.render("main/home", { recipes });
      });
    }
  },
  about(req, res) {
    return res.render("main/about");
  },
  showAll(req, res) {
    let { filter, page, limit } = req.query;

    page = page || 1;
    limit = limit || 6;
    let offset = limit * (page - 1);

    const params = {
      filter,
      page,
      limit,
      offset,
      callback(recipes) {
        const pagination = {
          total: Math.ceil(recipes[0].total / limit),
          page,
        };
        return res.render("main/recipes", { recipes, pagination, filter });
      },
    };

    Recipe.paginate(params);
  },
  show(req, res) {
    Recipe.find(req.params.id, (recipe) => {
      if (!recipe) return res.send("Recipe not found!");

      recipe.created_at = date(recipe.created_at).format;

      return res.render("main/recipe", { recipe });
    });
  },
};
