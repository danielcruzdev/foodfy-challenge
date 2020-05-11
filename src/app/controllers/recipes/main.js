const Recipe = require('../../models/Recipes')
const { date } = require('../../../lib/utils')

module.exports = {
    index(req, res) {
        const { filter } = req.query

        if (filter) {
            Recipe.findBy(filter, (recipes) => {
                return res.render('main/recipes', { recipes })
            })
        } else {
            Recipe.index((recipes) => {
                return res.render('main/home', { recipes })
            })
        }

    },
    about(req, res) {
        return res.render('main/about')
    },
    showAll(req, res) {
        Recipe.all((recipes) => {         
                return res.render('main/recipes', { recipes })
        })
    },
    show(req, res) {
        Recipe.find(req.params.id, (recipe) => {
            if (!recipe) return res.send("Recipe not found!")

            recipe.created_at = date(recipe.created_at).format

            return res.render("main/recipe", { recipe })

        })
    }
}