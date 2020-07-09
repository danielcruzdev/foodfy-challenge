const Recipe = require("../models/Recipes");
const Chef = require("../models/Chefs");
const File = require("../models/File");
const RecipeFiles = require("../models/RecipeFiles");

module.exports = {
  async index(req, res) {
    try {
      let { page, limit, filter} = req.query;

      page = page || 1;
      limit = limit || 8;

      let offset = limit * (page - 1);

      const params = {
        limit,
        offset,
        page,
        filter
      };

      let recipes = (await Recipe.paginate(params)).rows;
      const recipesTemp = [];

      for (const recipe of recipes) {
        let files = (await Recipe.files(recipe.id)).rows;

        files = files.map((file) => ({
          ...file,
          src: `${req.protocol}://${req.headers.host}${file.path.replace(
            "public",
            ""
          )}`,
        }));

        recipesTemp.push({
          ...recipe,
          images: files,
        });
      }

      recipes = recipesTemp;

      const pagination = {
        total: recipes.length > 0 ? Math.ceil(recipes[0].total / limit) : 0,
        page,
      };

      return res.render(`admin/recipes/index`, { recipes, pagination, filter });
    } catch (error) {
      throw new Error(error);
    }
  },
  async create(req, res) {
    try {
      const chefOptions = (await Chef.all()).rows;

      return res.render("admin/recipes/create", { chefOptions });
    } catch (error) {
      throw new Error(error);
    }
  },
  async post(req, res) {
    try {
      const keys = Object.keys(req.body);

      for (key of keys) {
        if (req.body[key] == "") {
          return res.send("Por favor preencha todos os campos!");
        }
      }

      if (req.files.length == 0) {
        return res.send("Por favor envie pelo menos uma imagem!");
      }

      const filesPromise = req.files.map((file) => File.create(file));
      const fileIds = await Promise.all(filesPromise);

      const recipeId = (await Recipe.create(req.body)).rows[0].id;

      const recipeFilesPromise = fileIds.map((fileId) =>
        RecipeFiles.create({
          recipe_id: recipeId,
          file_id: fileId.rows[0].id,
        })
      );

      await Promise.all(recipeFilesPromise);

      return res.redirect(`/admin/recipe/${recipeId}`);
    } catch (error) {
      throw new Error(error);
    }
  },
  async show(req, res) {
    try {
      const { id } = req.params;

      let recipe = (await Recipe.find(id)).rows[0];

      if (!recipe) {
        return res.send("Receita não encontrada!");
      }

      let files = (await Recipe.files(recipe.id)).rows;

      files = files.map((file) => ({
        ...file,
        src: `${req.protocol}://${req.headers.host}${file.path.replace(
          "public",
          ""
        )}`,
      }));

      recipe = {
        ...recipe,
        images: files,
      };

      return res.render("admin/recipes/show", { recipe });
    } catch (error) {
      throw new Error(error);
    }
  },
  async edit(req, res) {
    try {
      const { id } = req.params;

      let recipe = (await Recipe.find(id)).rows[0];

      if (!recipe) {
        return res.send("Receita não encontrada!");
      }

      let files = (await Recipe.files(recipe.id)).rows;

      files = files.map((file) => ({
        ...file,
        src: `${req.protocol}://${req.headers.host}${file.path.replace(
          "public",
          ""
        )}`,
      }));

      recipe = {
        ...recipe,
        images: files,
      };

      const chefOptions = (await Chef.all()).rows;

      return res.render("admin/recipes/edit", { recipe, chefOptions });
    } catch (error) {
      throw new Error(error);
    }
  },
  async put(req, res) {
    try {
      const keys = Object.keys(req.body);

      for (const key of keys) {
        if (req.body[key] == "" && key != "removed_files") {
          return res.send("Please, fill all fields");
        }
      }

      if (req.files.length != 0) {
        const filesPromise = req.files.map((file) => File.create(file));
        const fileIds = await Promise.all(filesPromise);

        const recipeFilesPromisse = fileIds.map((fileId) =>
          RecipeFiles.create({
            recipe_id: req.body.id,
            file_id: fileId.rows[0].id,
          })
        );

        await Promise.all(recipeFilesPromisse);
      }

      if (req.body.removed_files) {
        const removedFiles = req.body.removed_files.split(",");
        const lastIndex = removedFiles.length - 1;
        removedFiles.splice(lastIndex, 1);

        const removedRecipeFilesPromise = removedFiles.map(id =>
          RecipeFiles.delete(id)
        );

        await Promise.all(removedRecipeFilesPromise);

        const removedFilesPromise = removedFiles.map(id => File.delete(id));
        await Promise.all(removedFilesPromise);
      }

      await Recipe.update(req.body);

      return res.redirect(`/admin/recipe/${req.body.id}/`);
    } catch (error) {
      throw new Error(error);
    }
  },
  async delete(req, res) {
    try {
      const { id } = req.body;

      let files = (await Recipe.files(id)).rows;

      let removeFilesPromise = files.map((file) => RecipeFiles.delete(file.id));
      await Promise.all(removeFilesPromise);

      removeFilesPromise = files.map((file) => File.delete(file.id));
      await Promise.all(removeFilesPromise);

      await Recipe.delete(id);

      return res.redirect("/admin/recipes");
    } catch (error) {
      throw new Error(error);
    }
  },
};
