const Chef = require("../models/Chefs");
const Recipe = require("../models/Recipes");
const File = require("../models/File");

module.exports = {
  async index(req, res) {
    try {
      // --> Buscando todos os chefs 
      let chefs = (await Chef.all()).rows;
      const chefTemp = [];

      // --> For para buscar a foto de cada chef
      for (let chef of chefs) {
        const file = (await File.find(chef.file_id)).rows[0]; // --> Armazena a foto do chef

        // Armazena todas as informações obtidas no for. 
        chefTemp.push({ 
          ...chef,
          photo: `${req.protocol}://${req.headers.host}${file.path.replace("public", "" )}`,
        });
      }

      chefs = chefTemp;

      return res.render("admin/chefs/index", { chefs });
    } catch (error) {
      throw new Error(error);
    }
  },
  create(req, res) {
    try {
      return res.render("admin/chefs/create");
    } catch (error) {
      throw new Error(error);
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

      if (!req.file) {
        return res.send("Por favor envie pelo menos uma foto!");
      }

      const fileID = (await File.create(req.file)).rows[0].id;

      const chefData = {
        ...req.body,
        file_id: fileID
      }
      
      const chefID = (await Chef.create(chefData)).rows[0].id;

      return res.redirect(`/admin/chefs/${chefID}`);
    } catch (error) {
      throw new Error(error);
    }
  },
  async show(req, res) {
    try {
      const { id } = req.params;

      let chef = (await Chef.find(id)).rows[0];

      if (!chef) return res.send("Chef não encontrado");

      let recipes = (await Recipe.allBy(chef.id)).rows;
      const recipesTemp = [];

      for (const recipe of recipes) {
        let RecipeID = recipe.id
        let files = (await Recipe.files(RecipeID)).rows;

        files = files.map((file) => ({
          ...file,
          src: `${req.protocol}://${req.headers.host}${file.path.replace(
            "public",
            ""
          )}`
        }));

        recipesTemp.push({
          ...recipe,
          images: files,
        });
      }

      recipes = recipesTemp;

      const file = (await File.find(chef.file_id)).rows[0];

      chef = {
        ...chef,
        photo: `${req.protocol}://${req.headers.host}${file.path.replace(
          "public",
          ""
        )}`
      };

      return res.render("admin/chefs/show", { chef, recipes });
    } catch (error) {
      throw new Error(error);
    }
  },
  async edit(req, res) {
    try {
      const { id } = req.params;

      const chef = (await Chef.find(id)).rows[0];

      if (!chef) return res.send("Chef não encontrado!");

      let file = (await File.find(chef.file_id)).rows[0];

      const photo = {
        ...file,
        src: `${req.protocol}://${req.headers.host}${file.path.replace(
          "public",
          ""
        )}`,
      };
      return res.render("admin/chefs/edit", { chef, photo });
    } catch (error) {
      throw new Error(error);
    }
  },
  async put(req, res) {
    try {
      const keys = Object.keys(req.body);

      for (key in keys) {
        if (req.body[key] == "") {
          return res.send("Por favor preencha todos os campos!");
        }
      }

      if (req.file) {
        const chef = (await Chef.find(req.body.id)).rows[0];

        if (!chef) return res.send("Chef não encontrado!");

        const fileID = chef.file_id;

        const fileData = {
          ...req.files,
          id: fileID
        }
        
        await File.update(fileData);
      }
      
      const chefData = {
        ...req.body
      }

      await Chef.update(chefData);

      return res.redirect(`/admin/chefs/${req.body.id}`);
    } catch (error) {
      throw new Error(error);
    }
  },
  async delete(req, res) {
    try {
      const { chefID } = req.body;

      // --> Buscando o chefe para excluir
      const chef = (await Chef.find(chefID)).rows[0];

      if (!chef) return res.send("Chef não encontrado!");

      // --> Deletando o chef e o arquivo do chefe buscado
      await Chef.delete(chefID);
      await File.delete(chef.file_id);

      // --> Redirecionando para a pagina com todos os chefs.
      return res.redirect("/admin/chefs");
    } catch (error) {
      throw new Error(error);
    }
  },
};
