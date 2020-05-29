const Recipe = require('../models/Recipe')
const Chef = require('../models/Chef')
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
            let { page } = req.query

            page = page || 1
            const limit = 12

            let offset = limit * ( page - 1 )

            const params = {
                limit,
                offset
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
                totalPages: recipes.length > 0 ? Math.ceil(recipes[0].total / limit) : 0,
                page
            }
            
            return res.render('main/recipes', { recipes, pagination })

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
    async search(req, res) {
        try {
            let { filter } = req.query
            
            let recipes = (await Recipe.findBy(filter)).rows
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

            return res.render('main') /// ARRUMAR pagina de pesquisa! 

        } catch (error) {
            
        }
    }
}