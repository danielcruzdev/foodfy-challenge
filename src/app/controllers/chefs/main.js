const Chef = require('../../models/Chefs')

module.exports = {
    showAll(req, res) {

        const {filter} = req.query

        if(filter){
            Chef.findBy(filter, (chefs) => {
                return res.render('main/chefs', { chefs })
            })
        }
        else {
            Chef.all((chefs) => {
                return res.render('main/chefs', { chefs })
            })
        }
        
    },
    show(req, res) {
        Chef.find(req.params.id, (chef) => {
            if (!chef) return res.send("Chef not found!")

            Chef.findRecipes(req.params.id, (recipes) => {

                return res.render("main/chef", { chef, recipes })
            })

        })
    }
}