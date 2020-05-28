const Chef = require("../../models/Chefs");

module.exports = {
  async index(req, res) {
    try {
      let results = await Chef.all();
      let chefs = results.rows;
  
      return res.render("admin/chefs/chefs", { chefs });
    } catch(error) {
      console.error(`erroro ao buscar todos os chefs --> ${error}`)
    }
    
  },
  create(req, res) {
    try {
    return res.render("admin/chefs/create");
      
    } catch (error) {
      console.error(`Erro ao renderizar pagina create dos chefs --> ${error}`)
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
  
      let chefId = await Chef.create();
  
      return res.redirect(`/admin/chefs/${chefId}`);

    } catch(error) {
      console.error(`erroro ao cadastrar chef --> ${error}`)
    }
    
  },
  async show(req, res) {
    try{
      let results = await Chef.find(req.params.id);
      let chef = results.rows[0];
  
      if (!chef) return res.send("Chef not found!");
  
      results = Chef.findRecipes(req.params.id);
      let recipes = results.rows;
  
      return res.render("admin/chefs/details", { chef, recipes });
      
    } catch(error) {
      console.error(`erroro ao exibir chef --> ${error}`)
    }
    
  },
  async edit(req, res) {
    try {
      let results = await Chef.find(req.params.id);
      let chef = results.rows[0];
  
      if (!chef) return res.send("Chef not found!");
  
      return res.render("admin/chefs/edit", { chef });

    } catch(error) {
      console.error(`erroro ao exibir pagina de edição de chefe --> ${error}`)
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
  
      await Chef.update(req.body);
  
      return res.redirect(`/admin/chefs/${req.body.id}`);

    } catch(error) {
      console.error(`erroro ao atualizar chef --> ${error}`)
    }
    
  },
  async delete(req, res) {
    try {
            
    await Chef.delete(req.body.id);

    return res.redirect("/admin/chefs");

    } catch (error) {
      console.error(`Erro ao deletar chef --> ${error}`)
    }

  }, 
  async showAll(req, res) {
    try {
      const { filter } = req.query;

      if (filter) {
        let results = await Chef.findBy(filter);
        let chefs = results.rows;

        return res.render("main/chefs", { chefs });
      } else {
        let results = await Chef.all();
        let chefs = results.rows;

        return res.render("main/chefs", { chefs });
      }
    } catch (error) {
      console.error(`Erro ao exibir chef --> ${error}`);
    }
  }
};
