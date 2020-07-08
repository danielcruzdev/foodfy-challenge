const Recipe = require('../models/Recipes')
const Chef = require('../models/Chefs')
const File = require('../models/File')

module.exports = {
    async home(req, res) {
        try {
            const params = {
                limit: 6,
                offset: 0
            }

            let recipes = (await Recipe.paginate(params)).rows
            const recipesTemp = []

            for(const recipe of recipes) {
                let files = (await Recipe.files(recipe.id)).rows

                files = files.map(file => ({
                    ...file,
                    src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`
                }))

                recipesTemp.push({
                    ...recipe,
                    images: files
                })
            }

            recipes = recipesTemp

            return res.render('main/home', { recipes })
        } catch (error) {
            throw new Error(error)
        }
    },
    async allRecipes(req, res) {
        try {
            let { page, filter, limit } = req.query

            page = page || 1
            limit = limit || 6

            let offset = limit * ( page - 1 )

            const params = {
                limit,
                offset,
                page,
                filter
            }

            let recipes = (await Recipe.paginate(params)).rows
            const recipesTemp = []
            
            for(const recipe of recipes) {
                let files = (await Recipe.files(recipe.id)).rows

                files = files.map(file => ({
                    ...file,
                    src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`
                }))

                recipesTemp.push({
                    ...recipe,
                    images: files
                })
            }

            recipes = recipesTemp

            const pagination = {
                total: recipes.length > 0 ? Math.ceil(recipes[0].total / limit) : 0,
                page
            }
            
            return res.render('main/recipes', { recipes, pagination, filter })

        } catch (error) {
            throw new Error(error)
        }
    },
    async showRecipe(req, res) {
        try {
            const { id } = req.params

            let recipe = (await Recipe.find(id)).rows[0]

            if(!recipe) return res.send('Receita não encontrada!')

            let files = (await Recipe.files(recipe.id)).rows

            files = files.map(file => ({
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`
            }))

            recipe = {
                ...recipe,
                images: files
            }

            return res.render('main/recipe', { recipe })
        } catch (error) {
            throw new Error(error)
        }
    },
    async allChefs(req, res) {
        try {
            let chefs = (await Chef.all()).rows
            const chefsTemp = []

            for(let chef of chefs){
                const file = (await File.find(chef.file_id)).rows[0]

                chefsTemp.push({
                    ...chef,
                    photo: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`
                })
            }

            chefs = chefsTemp

            return res.render('main/chefs', { chefs })
        } catch (error) {
            throw new Error(error)
        }
    },
    about (req, res) {
        return res.render('main/about')
    }
}