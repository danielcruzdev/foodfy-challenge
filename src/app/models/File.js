const db = require("../../config/db");
const fs = require("fs");

module.exports = {
  createRecipeFiles({ filename, path, recipe_id }) {
    try {
      const query = `
        WITH new_file AS (
        INSERT INTO files (id, name, path) VALUES (default, $1, $2)
        RETURNING id )

        INSERT INTO recipe_files (recipe_id, file_id)
        VALUES 
        ($3, (SELECT id FROM new_file));
      `;

      const values = [filename, path, recipe_id];

      return db.query(query, values);
    } catch (error) {
      console.error(
        `Erro ao inserir imagens da receita no banco de dados --> ${err}`
      );
    }
  },
  async deleteRecipeFiles(id) {
    try {
      const result = await db.query(
        `
        SELECT * FROM files 
        LEFT JOIN recipe_files ON recipe_files.file_id = files.id
        WHERE recipe_files.recipe_id = $1
        `,
        [id]
      );

      const file = result.rows[0];

      fs.unlinkSync(file.path);

      return db.query(
        `
        WITH delete_file AS (
          DELETE FROM recipe_files
          WHERE recipe_files.recipe_id = $1 
          RETURNING recipe_files.file_id
        )
        DELETE FROM files
        WHERE files.id = (SELECT id FROM delete_file)
        `,
        [id]
      );
    } catch (err) {
      console.error(err);
    }
  },
  async deleteChefFile(id) {
    try {
      const result = await db.query(
        `
        SELECT * FROM files 
        LEFT JOIN chefs ON chefs.file_id = files.id
        WHERE chefs.file_id = $1
        `,
        [id]
      );

      const file = result.rows[0];

      fs.unlinkSync(file.path);

      return db.query(
        `
        WITH delete_file AS (
          UPDATE chefs SET file_id = NULL
          WHERE chefs.file_id = $1 
          RETURNING chefs.file_id
        )
        DELETE FROM files
        WHERE files.id = (SELECT id FROM delete_file)
        `,
        [id]
      );
    } catch (err) {
      console.error(err);
    }
  },
};
