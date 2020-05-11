const db = require('../../config/db')
const { date } = require('../../lib/utils')

module.exports = {
    all(callback) {
        db.query(`SELECT chefs.*, COUNT(recipes) AS total_recipes
      FROM chefs
      LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
      GROUP BY chefs.id
      ORDER BY name
      `, (err, results) => {
            if (err) throw `Database Error! ${err}`

            callback(results.rows)
        })
    },
    create(data, callback) {

        const query = `
        INSERT INTO chefs (
          name,
          avatar_url,
          created_at
        ) VALUES ($1, $2, $3)
        RETURNING id
      `

        const values = [
            data.name,
            data.avatar_url,
            date(Date.now()).iso
        ]

        db.query(query, values, (err, results) => {
            if (err) throw `Database Error! ${err}`

            callback(results.rows[0])
        })


    },
    find(id, callback) {
        db.query(`
        SELECT chefs.*, COUNT(recipes) AS total_recipes
        FROM chefs
        LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
        WHERE chefs.id = $1
        GROUP BY chefs.id`, [id], (err, results) => {
            if (err) throw `Database Error! ${err}`
            callback(results.rows[0])
        })
    },
    findBy(filter, callback) {
        db.query(`SELECT chefs.*, COUNT(recipes) AS total_recipes
      FROM chefs 
      LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
      WHERE chefs.name ILIKE '%${filter}%'
      GROUP BY chefs.id
      `, (err, results) => {
            if (err) throw `Database Error! ${err}`

            callback(results.rows)
        })
    },
    update(data, callback) {
        const query = `
      UPDATE chefs SET 
        name=($1),
        avatar_url=($2)
      WHERE id = $3
      `

        const values = [
            data.name,
            data.avatar_url,
            data.id
        ]

        db.query(query, values, (err, results) => {
            if (err) throw `Database Error! ${err}`

            callback()
        })
    },
    findRecipes(id, callback) {
      db.query(`
      SELECT recipes.* FROM recipes
      LEFT JOIN chefs ON (chefs.id = recipes.chef_id)
      WHERE chefs.id = $1
        `, [id], (err, results) => {
          if (err) throw `Database Error! ${err}`

          callback(results.rows)
      })
    },
    delete(id, callback) {
        db.query(`
        DELETE FROM chefs
        WHERE id = $1`, [id], (err) => {
            if (err) throw `Database Error! ${err}`

            return callback()
        })
    },
    recipeSelectOptions(callback) {
        db.query(`SELECT title, id FROM recipes`, (err, results) => {
            if (err) throw `Database Error! ${err}`

            callback(results.rows)
        })
    },
    paginate(params) {
        const { filter, limit, offset, callback } = params

        let query = '',
            filterQuery = '',
            totalQuery = `(
          SELECT count(*) FROM chefs
        ) AS total`

        if (filter) {

            filterQuery = `
        WHERE chefs.title ILIKE '%${filter}%'   
        `

            totalQuery = `(
          SELECT count(*) FROM chefs
          ${filterQuery}
          ) AS total`
        }

        query = `
            SELECT chefs.*, ${totalQuery}, COUNT(recipes) AS total_recipes
            FROM chefs
            LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
            ${filterQuery} GROUP BY chefs.id LIMIT $1 OFFSET $2`
  
      db.query(query, [limit, offset], (err, results) => {
        if(err) throw `Database Error! ${ err } ` 
  
        callback(results.rows)
      })
    }
  }