const db = require("../../config/db");
const { date } = require("../../lib/utils");

module.exports = {
  all() {
    try {
      return db.query(`SELECT chefs.*, COUNT(recipes) AS total_recipes
        FROM chefs
        LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
        GROUP BY chefs.id
        ORDER BY name
      `);
    } catch (err) {
      console.log(`Erro ao buscar chefs --> ${err}`);
    }
  },
  create(data) {
    try {
      const query = `
        INSERT INTO chefs (
          name,
          avatar_url,
          created_at
        ) VALUES ($1, $2, $3)
        RETURNING id
      `;

      const values = [data.name, data.avatar_url, date(Date.now()).iso];

      return db.query(query, values);
    } catch (err) {
      console.log(`Erro ao criar chefs --> ${err}`);
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
      console.log(`Erro ao buscar chef --> ${err}`);
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
      console.log(`Erro ao filtrar chef --> ${err}`);
    }
    
  },
  update(data) {
    try {
      const query = `
        UPDATE chefs SET 
        name=($1),
        avatar_url=($2)
        WHERE id = $3
      `;

      const values = [data.name, data.avatar_url, data.id];

      return db.query(query, values);
    } catch (error) {
      console.log(`Erro ao atualizar chef --> ${err}`);
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
      console.log(`Erro ao buscar receitas --> ${err}`);   
    }
    
  },
  delete(id) {
    try {
      return db.query(`
      DELETE FROM chefs
      WHERE id = $1`,
    [id]);
    } catch (err) {
      console.log(`Erro ao deletar chef --> ${err}`);   
    }
    
  },
};
