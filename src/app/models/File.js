const db = require("../../config/db");
const fs = require("fs")

module.exports = {
  create({filename, path, recipe_id}) {
    const query = `
        WITH new_file AS (
        INSERT INTO files (id, name, path) VALUES (default, $1, $2)
        RETURNING id )

        INSERT INTO recipe_files (recipe_id, file_id)
        VALUES 
        ($3, (SELECT id FROM new_file));
      `;

    const values = [
        filename,
        path,
        recipe_id
    ];

    return db.query(query, values)
  },
  async delete(id) {
    
    try {
      const result = await db.query(`
        SELECT * FROM files 
        WHERE id = $1
    `, [id] )

      const file = result.rows[0]

      fs.unlinkSync(file.path)

      return db.query(`
        DELETE FROM files 
        WHERE id = $1
      `, [id])
    

    } catch(err) {
      console.error(err)
    }

  }
}