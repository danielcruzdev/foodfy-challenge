const Recipe = require("../../models/Recipes");
const { date } = require("../../../lib/utils");

module.exports = {
  async index(req, res) {
    try {
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
    } catch (error) {
      console.error(`Erro ao listar receitas para a pagina index --> ${error}`);
    }
  },
  about(req, res) {
    try {
      return res.render("main/about");
    } catch (error) {
      console.error(`Erro ao renderizar pagina sobre --> ${error}`);
    }
  },
  async showAll(req, res) {
    try {
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
    } catch (error) {
      console.error(`Erro ao deletar receitas --> ${error}`);
    }
  },
  async show(req, res) {
    try {
      let result = await Recipe.find(req.params.id);
      let recipe = result.rows[0];

      if (!recipe) return res.send("Recipe not found!");

      recipe.created_at = date(recipe.created_at).format;

      return res.render("main/recipe", { recipe });
    } catch (error) {
      console.error(`Erro ao mostrar receita --> ${error}`);
    }
  },
};
