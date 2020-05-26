const { date } = require("../../lib/utils");
const db = require("../../config/db");

module.exports = {
  all() {
    try {
      const query = `
          SELECT recipes.*, chefs.name as chef_name
          FROM recipes 
          LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
          ORDER BY recipes.title
        `;
      return db.query(query);
    } catch (err) {
      console.log(`Erro ao buscar receitas --> ${err}`);
    }
  },
  index() {
    try {
      const query = `
          SELECT recipes.*, chefs.name as chef_name
          FROM recipes 
          LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
          ORDER BY recipes.title
          LIMIT 6 
      `;
      return db.query(query);
    } catch (err) {
      console.log(`Erro ao buscar receitas --> ${err}`);
    }
  },
  create(data) {
    try {
      const query = `
        INSERT INTO recipes (
          chef_id,
          title,
          ingredients,
          preparation,
          information,
          created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id
      `;

      const values = [
        data.chef_id,
        data.title,
        data.ingredients,
        data.preparation,
        data.information,
        date(Date.now()).iso,
      ];

      return db.query(query, values);
    } catch(err) {
      console.log(`Erro ao criar receitas --> ${err}`)
    }
  },
  find(id) {
    try {
      return db.query(
        `
        SELECT recipes.*, chefs.name AS chef_name 
        FROM recipes 
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        WHERE recipes.id = $1`,
        [id],
      );
    } catch(err) {
      console.log(`Erro ao buscar receita --> ${err}`)
    }
    
  },
  findBy(filter) {
    try {
      return db.query(
        `SELECT recipes.*, chefs.name as chef_name
        FROM recipes 
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        WHERE recipes.title ILIKE '%${filter}%'
        ORDER BY recipes.title
        `
      );
    } catch(err) {
      console.log(`Erro ao filtrar receita --> ${err}`)
    }
    
  },
  update(data) {
    try {
      const query = `
      UPDATE recipes SET 
        chef_id=($1),
        title=($2),
        ingredients=($3),
        preparation=($4),
        information=($5)
      WHERE id = $6
      `;

    const values = [
      data.chef_id,
      data.title,
      data.ingredients,
      data.preparation,
      data.information,
      data.id,
    ];

    return db.query(query, values);
    } catch(err) {
      console.log(`Erro ao atualizar receita --> ${err}`)
    }
    
  },
  delete(id) {
    try {
      return db.query(`
        DELETE FROM recipes
        WHERE id = $1`,
        [id],)
    } catch(err) {
      console.log(`Erro ao deletar receita --> ${err}`)

    }
    
  },
  chefSelectOptions() {
    try {
      return db.query(`SELECT name, id FROM chefs`);
    } catch(err) {
      console.log(`Erro ao buscar chefs --> ${err}`)
      
    }
  }, 
  paginate(params) {
    try {
      const { filter, limit, offset } = params;

      let query = "",
        filterQuery = "",
        totalQuery = `(
              SELECT count(*) FROM recipes
              ) AS total`;
  
      if (filter) {
        filterQuery = `
          WHERE recipes.title ILIKE '%${filter}%'  
          `;
  
        totalQuery = `(
            SELECT count(*) FROM recipes
            ${filterQuery}
            ) AS total`;
      }
  
      query = `
        SELECT recipes.*, chefs.name AS chef_name, ${totalQuery}
        FROM recipes
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        ${filterQuery}
        LIMIT $1 OFFSET $2
        `;
  
      return db.query(query, [limit, offset]);
    } catch(err) {
      console.log(`Erro na paginação --> ${err}`)
    }
    
  },
  files(id){
    return db.query(`
      SELECT * 
      FROM files 
      WHERE recipe_id = $1
    `, [id])
  }
};
