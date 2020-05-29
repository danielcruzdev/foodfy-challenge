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
    } catch (error) {
      throw new Error(error);
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
    } catch (error) {
      console.error(`Erro ao buscar receitas --> ${err}`);
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
        ) VALUES ($1, $2, $3, $4, $5)
        RETURNING id
      `;

      const values = [
        data.chef_id,
        data.title,
        data.ingredients,
        data.preparation,
        data.information,
      ];

      return db.query(query, values);
    } catch (error) {
      throw new Error(error);
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
        [id]
      );
    } catch (error) {
      throw new Error(error);
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
    } catch (error) {
      throw new Error(error);
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
    } catch (error) {
      throw new Error(error);
    }
  },
  delete(id) {
    try {
      return db.query(
        `
        DELETE FROM recipes
        WHERE id = $1`,
        [id]
      );
    } catch (error) {
      throw new Error(error);
    }
  },
  paginate(params) {
    try {
      let { filter, limit, offset } = params;

      let totalQuery = `(
            SELECT count(*) FROM recipes
        ) AS total`;

      let endQuery = `
            ORDER BY recipes.created_at DESC
            LIMIT ${limit} OFFSET ${offset}
        `;

      if (filter) {
        const filterQuery = `
                WHERE name ILIKE '%${filter}%'
            `;

        totalQuery = `(
                SELECT count(*) FROM recipes
                ${filterQuery}
            ) AS total`;

        endQuery = `
                ${filterQuery}
                ${endQuery}
            `;
      }

      const query = `
            SELECT recipes.*, ${totalQuery}, chefs.name AS chef_name
            FROM recipes
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
            ${endQuery}
        `;

      return db.query(query);
    } catch (error) {
      throw new Error(error);
    }
  },
  allBy(chefId) {
    try {
      return db.query(`
          SELECT recipes.*, chefs.name AS chef_name
          FROM recipes
          LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
          WHERE recipes.chef_id = $1
          ORDER BY recipes.title ASC`, [chefId])

    } catch (error) {
      throw new Error(error)
    }  
  },
  files(id) {
    try {
      return db.query(`
        SELECT * FROM files 
        LEFT JOIN recipe_files ON (recipe_files.file_id = files.id)
        WHERE recipe_files.recipe_id = $1
      `,[id]);

    } catch (error) {
      throw new Error(error)
    }
  },
};
