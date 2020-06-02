const db = require("../../config/db");

module.exports = {
  all() {
    try {
      return db.query(`
        SELECT chefs.*, COUNT(recipes.id) AS total_recipes
        FROM chefs
        LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
        GROUP BY chefs.id
        ORDER BY chefs.name
      `);
    } catch (error) {
      throw new Error(error)
    }
  }, 
  create(data) {
    try {
      const query = `
      INSERT INTO chefs (
          name,
          file_id
      ) VALUES ($1, $2)
      RETURNING id
    `

    const values = [
      data.name,
      data.file_id
    ]

    return db.query(query, values)

    } catch (error) {
      throw new Error(error)
    }
  },
  find(id) {
    try {
      return db.query(`
      SELECT chefs.*, COUNT(recipes) AS total_recipes
      FROM chefs
      LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
      WHERE chefs.id = $1
      GROUP BY chefs.id`, [id]);
    } catch (error) {
      throw new Error(error)
    }
  },
  findBy(filter) {
    try {
      return db.query(`
      SELECT chefs.*, COUNT(recipes) AS total_recipes
      FROM chefs 
      LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
      WHERE chefs.name ILIKE '%${filter}%'
      GROUP BY chefs.id
      `);
    } catch (error) {
      throw new Error(error)
    }
    
  },
  update(data) {
    try {
      const query = `
        UPDATE chefs SET 
        name=($1),
        WHERE id = $2
      `;

      const values = [
        data.name, 
        data.id
      ];

      return db.query(query, values);
    } catch (error) {
      throw new Error(error)
    }
   
  },
  findRecipes(id) {
    try {
      return db.query(`
        SELECT recipes.* FROM recipes
        LEFT JOIN chefs ON (chefs.id = recipes.chef_id)
        WHERE chefs.id = $1
        `, [id]);
    } catch (error) {
      throw new Error(error)
    }
    
  },
  delete(id) {
    try {
      return db.query(`
      DELETE FROM chefs
      WHERE id = $1`,
      [id]);
    } catch (error) {
      throw new Error(error)
    }
    
  },
  paginate(params) {
    try {
      let { filter, limit, offset } = params

      let totalQuery = `(
          SELECT count(*) FROM chefs
      ) AS total`

      let endQuery = `
          LIMIT ${limit} OFFSET ${offset}
      `

      if (filter) {
          const filterQuery = `
              WHERE name ILIKE '%${filter}%'
          `

          totalQuery = `(
              SELECT count(*) FROM chefs
              ${filterQuery}
          ) AS total`

          endQuery = `
              ${filterQuery}
              ${endQuery}
          `
      }

      const query = `
          SELECT chefs.*, ${totalQuery}
          FROM chefs
          ${endQuery}
      `

      return db.query(query)
    } catch (error) {
      throw new Error(error)
    }
      
  }
};
