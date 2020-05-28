const db = require("../../config/db");
const { date } = require("../../lib/utils");

module.exports = {
  all() {
    try {
      return db.query(`
        SELECT chefs.*, COUNT(recipes.id) AS total_recipes
        FROM chefs
        LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
        GROUP BY chefs.id
        ORDER BY name
      `);
    } catch (err) {
      console.error(`Erro ao buscar chefs --> ${err}`);
    }
  }, 
  create(data) {
    try {
      const query = `
      INSERT INTO chefs (
          file_id,
          name
      ) VALUES ($1, $2)
      RETURNING id
    `

    const values = [
      data.file_id,
      data.name
    ]

    return db.query(query, values)

    } catch (err) {
      console.error(`Erro ao criar chefs --> ${err}`);
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
    } catch (err) {
      console.error(`Erro ao buscar chef --> ${err}`);
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
    } catch (err) {
      console.error(`Erro ao filtrar chef --> ${err}`);
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

      console.error(`Erro ao atualizar chef --> ${err}`);
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
      console.error(`Erro ao buscar receitas --> ${err}`);   
    }
    
  },
  delete(id) {
    try {
      return db.query(`
      DELETE FROM chefs
      WHERE id = $1`,
      [id]);
    } catch (err) {
      console.error(`Erro ao deletar chef --> ${err}`);   
    }
    
  },
  paginate(params) {
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
  }
};
