const Recipe = require("../../models/Recipes");
const File = require("../../models/File");
const { date } = require("../../../lib/utils");

module.exports = {
  async index(req, res) {
    try {
      let results = await Recipe.all();
      let recipes = results.rows;

      return res.render("admin/index", { recipes });
    } catch (error) {
      console.error(`Erro ao listar receitas para a pagina index --> ${error}`);
    }
  },
  async create(req, res) {
    try {
      let results = await Recipe.chefSelectOptions();
      let chefOptions = results.rows;

      return res.render("admin/recipes/create", { chefOptions });
    } catch (error) {
      console.error(`Erro ao renderizar pagina de criar receitas --> ${error}`);
    }
  },
  async post(req, res) {
    try {
      const keys = Object.keys(req.body);

      for (key in keys) {
        if (req.body[key] == "") {
          return res.send("Por favor preencha todos os campos!");
        }
      }

      if (req.files.length == 0) {
        return res.send("Por favor envie pelo menos uma imagem!");
      }

      let results = await Recipe.create(req.body);
      const recipeId = results.rows[0].id;

      const filePromise = req.files.map((file) =>
        File.create({
          ...file,
          recipe_id: recipeId,
        })
      );
      await Promise.all(filePromise);

      return res.redirect(`/admin/recipes/${recipeId}`);
    } catch (error) {
      console.error(`Erro ao cadastrar receita --> ${error}`);
    }
  },
  async show(req, res) {
    try {
      let results = await Recipe.find(req.params.id);
      const recipe = results.rows[0];

      if (!recipe) {
        return res.send("Produto não encontrado!");
      }

      recipe.created_at = date(recipe.created_at).format;

      results = await Recipe.files(recipe.id);
      let files = results.rows;

      files = files.map((file) => ({
        ...file,
        src: `${req.protocol}://${req.headers.host}${file.path.replace(
          "public",
          ""
        )}`,
      }));

      return res.render("admin/recipes/details", { recipe, files });
    } catch (error) {
      console.error(`Erro ao mostrar receita --> ${error}`);
    }
  },
  async edit(req, res) {
    try {
      let results = await Recipe.find(req.params.id);
      const recipe = results.rows[0];

      if (!recipe) {
        return res.send("Produto não encontrado!");
      }

      recipe.created_at = date(recipe.created_at).format;

      results = await Recipe.chefSelectOptions();
      let chefOptions = results.rows;

      results = await Recipe.files(recipe.id);
      let files = results.rows;

      files = files.map((file) => ({
        ...file,
        src: `${req.protocol}://${req.headers.host}${file.path.replace(
          "public",
          ""
        )}`,
      }));

      return res.render("admin/recipes/edit", { recipe, files, chefOptions });
    } catch (error) {
      console.error(`Erro ao exibir pagina de edição da receita --> ${error}`);
    }
  },
  async put(req, res) {
    try {
      const keys = Object.keys(req.body);

      for (key in keys) {
        if (req.body[key] == "" && key != "removed_files") {
          return res.send("Por favor preencha todos os campos!");
        }
      }

      if (req.files.length != 0) {
        const newFilesPromise = req.files.map((file) => {
          File.create({ ...file, recipe_id: req.body.id });
        });

        await Promise.all(newFilesPromise);
      }

      if (req.body.removed_files) {
        const removedFiles = request.body.removed_files.split(",");
        const lastIndex = removedFiles.length - 1;
        removedFiles.splice(lastIndex, 1);

        const removedFilesPromise = removedFiles.map((id) => File.delete(id));

        await Promise.all(removedFilesPromise);
      }

      await Recipe.update(req.body);

      return res.redirect(`admin/recipe/${req.body.id}`);
    } catch (error) {
      console.error(`Erro ao atualizar da receita --> ${error}`);
    }
  },
  async delete(req, res) {
    try {
      await Recipe.delete(req.body.id);

      return res.redirect("/admin/recipes");
    } catch (error) {
      console.error(`Erro ao deletar receitas --> ${error}`);
    }
  },
};
