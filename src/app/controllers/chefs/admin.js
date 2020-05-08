const Chef = require('../../models/Chefs')
const { date } = require('../../../lib/utils')

module.exports = {
    index(req, res) {
        Chef.all((chefs) => {
            return res.render('admin/chefs/chefs', { chefs })
        })
    },
    create(req, res) {
        return res.render('admin/chefs/create')
    },
    post(req, res) {
        const keys = Object.keys(req.body);

        for (key in keys) {
            if (req.body[key] == "") {
                return res.send("Por favor preencha todos os campos!")
            }
        }

        Chef.create(req.body, (chef) => {
            return res.redirect(`/admin/chefs/${chef.id}`)
        })
    },
    show(req, res) {
        Chef.find(req.params.id, (chef) => {
            if (!chef) return res.send("Chef not found!")

            Chef.findRecipes(req.params.id, (recipes) => {

                return res.render("admin/chefs/details", { chef, recipes })
            })
        })
    },
    edit(req, res) {
        Chef.find(req.params.id, (chef) => {
            if (!chef) return res.send("Chef not found!")

            Chef.recipeSelectOptions((options) => {
                return res.render('admin/chefs/edit', { chef, chefSelectOptions: options })
            })
        })
    },
    put(req, res) {
        const keys = Object.keys(req.body);

        for (key in keys) {
            if (req.body[key] == "") {
                return res.send("Por favor preencha todos os campos!")
            }
        }

        Chef.update(req.body, () => {
            return res.redirect(`/admin/chefs/${req.body.id}`)
        })
    },
    delete(req, res) {
        Chef.delete(req.body.id, () => {
            return res.redirect('/admin/chefs')
        })
    }
}
