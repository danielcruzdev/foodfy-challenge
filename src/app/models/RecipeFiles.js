const db = require("../../config/db");

module.exports = {
  create({ recipe_id, file_id }) {
    try {
      const query = `
        INSERT INTO recipe_files (
            recipe_id,
            file_id
            ) VALUES ($1, $2)
            RETURNING id
        `;

      const values = [recipe_id, file_id];

      return db.query(query, values);
    } catch (error) {
      throw new Error(error);
    }
  },
  find(id) {
    try {
      return db.query(
        `
        SELECT *
        FROM files
        WHERE id = $1`,
        [id]
      );
    } catch (error) {
      throw new Error(error);
    }
  },
  async delete(id) {
    try {
      return db.query(
        `
        DELETE FROM recipe_files
        WHERE file_id = $1`,
        [id]
      );
    } catch (error) {
      throw new Error(error);
    }
  },
};
