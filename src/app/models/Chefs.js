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
      console.error(`Erro ao buscar chefs --> ${err}`);
    }
  }, 
  create({ filename, path, name, created_at }) {
    try {
      const query = `
        WITH new_chef AS (
          INSERT INTO files (id, name, path) VALUES (default, $1, $2)
          RETURNING id )

        INSERT INTO chefs (
          name,
          created_at,
          file_id
          ) VALUES 
          ($3, $4, (SELECT id FROM new_chef))
          RETURNING id
      `;

      created_at = date(Date.now()).iso

      const values = [filename, path, name, created_at ];

      return db.query(query, values);

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
        avatar_url=($2)
        WHERE id = $3
      `;

      const values = [data.name, data.avatar_url, data.id];

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
  files(id){
    try {
      return db.query(`
      SELECT * FROM files 
      LEFT JOIN chefs ON chefs.file_id = files.id
      WHERE chefs.file_id = $1
    `, [id])
    } catch(err) {
      console.error(`Erro ao buscar foto do chef --> ${err}`)
    }
  }
};
