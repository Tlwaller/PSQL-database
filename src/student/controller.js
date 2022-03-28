const pool = require("../../db");

const getStudents = (req, res) => {
  pool.query("SELECT * FROM students", (error, result) => {
    if (error) throw error;
    res.status(200).json(result.rows);
  });
};

module.exports = {
  getStudents,
};
