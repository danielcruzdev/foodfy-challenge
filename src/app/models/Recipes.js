const { date } = require('../../lib/utils')
const db = require('../../config/db')


module.exports = {
    all(callback) {
      db.query(`SELECT *
      FROM recipes
      ORDER BY title ASC
      `, (err, results) => {
        if(err) throw `Database Error! ${err}`
  
        callback(results.rows)
      })
    },
    allIndex(callback) {
      db.query(`SELECT *
      FROM recipes
      ORDER BY title ASC`, (err, results) => {
        if(err) throw `Database Error! ${err}`
  
        callback(results.rows)
      })
    },
    create(data, callback) {
  
      const query = `
        INSERT INTO recipes (
          chef_id,
          image,
          title,
          ingredients,
          preparation,
          information,
          created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id
      `
  
      const values = [
        data.chef_id,
        data.image,
        data.title,
        data.ingredients,
        data.preparation,
        data.information,
        date(Date.now()).iso
      ]
  
      db.query(query, values, (err, results) => {
        if(err) throw `Database Error! ${err}`
        
        callback(results.rows[0])
      })
  
  
    },
    find(id, callback) {
      db.query(`
      SELECT recipes.*, chefs.name AS chef_name 
      FROM recipes 
      LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
      WHERE recipes.id = $1`, [id], (err, results) => {
        if(err) throw `Database Error! ${err}`
        callback(results.rows[0])
      })
    },
    findBy(filter, callback) {
      db.query(`SELECT *
      FROM recipes 
      WHERE recipe.title ILIKE '%${filter}%'
      `, (err, results) => {
        if(err) throw `Database Error! ${err}`
  
        callback(results.rows)
      })
    },
    update(data, callback) {
      const query = `
      UPDATE recipes SET 
        chef_id=($1),
        image=($2),
        title=($3),
        ingredients=($4),
        preparation=($5),
        information=($6)
      WHERE id = $7
      `
  
      const values = [
        data.chef_id,
        data.image,
        data.title,
        data.ingredients,
        data.preparation,
        data.information,
        data.id
      ]
  
      db.query(query, values, (err, results) => {
        if(err) throw `Database Error! ${err}`
  
        callback()
      })
    },
    delete(id, callback) {
      db.query(`
        DELETE FROM recipes
        WHERE id = $1`, [id], (err) => {
          if(err) throw `Database Error! ${err}`
          
          return callback()
      })
    },
    chefSelectOptions(callback) {
      db.query(`SELECT name, id FROM chefs`, (err, results) => {
        if (err) throw `Database Error!`
  
        callback(results.rows)
      })
    },
    paginate(params) {
      const { filter, limit, offset, callback } = params
  
      let query = '',
        filterQuery = '',
        totalQuery = `(
          SELECT count(*) FROM recipes
        ) AS total`
      
      if(filter){
  
        filterQuery = `
        WHERE recipes.title ILIKE '%${filter}%'   
        `
  
        totalQuery = `(
          SELECT count(*) FROM recipes
          ${filterQuery}
          ) AS total`
      }
  
      query = `
      SELECT recipes.*, ${totalQuery}
      FROM recipes
      ${filterQuery}
      LIMIT $1 OFFSET $2
      `
  
      db.query(query, [limit, offset], (err, results) => {
        if(err) throw `Database Error! ${err}` 
  
        callback(results.rows)
      })
    }
  }