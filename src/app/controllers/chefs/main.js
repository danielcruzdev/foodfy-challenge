const Chef = require("../../models/Chefs");

module.exports = {
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
  },
  async show(req, res) {
      try {
        let results = await Chef.find(req.params.id);
        let chef = results.rows[0];
    
        if (!chef) return res.send("Chef not found!");
    
        results = await Chef.findRecipes(req.params.id);
        let recipes = results.rows;
    
        return res.render("main/chef", { chef, recipes });
        
      } catch (error) {
        console.error(`Erro ao exibir chef --> ${error}`);
      }
    
  },
};
