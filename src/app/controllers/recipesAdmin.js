const Recipe = require('../models/Recipes')
const { date } = require('../../lib/utils')

module.exports = {
    index(req, res) {
        Recipe.allIndex((recipes) => {
            return res.render('admin/index', { recipes })
        })
    },
    create(req ,res) {
        Recipe.chefSelectOptions((options) => {
            return res.render('admin/create', {chefOptions: options})
        })
    },
    post(req, res) {
        const keys = Object.keys(req.body);

        for(key in keys){
            if(req.body[key] == ""){
                return res.send("Por favor preencha todos os campos!")
            }
        }

        Recipe.create(req.body, (recipe) => {
            return res.redirect(`/admin/recipe/${recipe.id}`)
        })
    },
    show(req, res) {
        Recipe.find(req.params.id, (recipe) => {
            if (!recipe) return res.send("Recipe not found!")

            recipe.created_at = date(recipe.created_at).format

            return res.render("admin/details", { recipe })
        })
    },
    edit(req, res) {
        Recipe.find(req.params.id, (recipe) => {
            if(!recipe) return res.send("Recipe not found!")

            Recipe.chefSelectOptions((options) => {
                return res.render('admin/edit', { recipe, chefSelectOptions: options})
            })
        })
    },
    put(req, res) {
        const keys = Object.keys(req.body);

        for(key in keys){
            if(req.body[key] == ""){
                return res.send("Por favor preencha todos os campos!")
            }
        }

        Recipe.update(req.body, () => {
            return res.redirect(`admin/recipe/${req.body.id}`)
        })
    },
    delete(req, res) {
        Recipe.delete(req.body.id, () => {
            return res.redirect('/admin/recipes')
        }) 
    }
}
