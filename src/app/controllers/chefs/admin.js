const Chef = require("../../models/Chefs");

module.exports = {
  async index(req, res) {
    let results = await Chef.all();
    let chefs = results.rows;

    return res.render("admin/chefs/chefs", { chefs });
  },
  create(req, res) {
    return res.render("admin/chefs/create");
  },
  async post(req, res) {
    const keys = Object.keys(req.body);

    for (key in keys) {
      if (req.body[key] == "") {
        return res.send("Por favor preencha todos os campos!");
      }
    }

    let chefId = await Chef.create(req.body);

    return res.redirect(`/admin/chefs/${chefId}`);
  },
  async show(req, res) {
    let results = await Chef.find(req.params.id);
    let chef = results.rows[0];

    if (!chef) return res.send("Chef not found!");

    results = Chef.findRecipes(req.params.id);
    let recipes = results.rows;

    return res.render("admin/chefs/details", { chef, recipes });
  },
  async edit(req, res) {
    let results = await Chef.find(req.params.id);
    let chef = results.rows;

    if (!chef) return res.send("Chef not found!");

    return res.render("admin/chefs/edit", { chef });
  },
  async put(req, res) {
    const keys = Object.keys(req.body);

    for (key in keys) {
      if (req.body[key] == "") {
        return res.send("Por favor preencha todos os campos!");
      }
    }

    await Chef.update(req.body);

    return res.redirect(`/admin/chefs/${req.body.id}`);
  },
  async delete(req, res) {
      
    await Chef.delete(req.body.id);

    return res.redirect("/admin/chefs");
  },
};
