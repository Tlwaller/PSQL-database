const pool = require("../../db");
const queries = require("./queries");

const getStudents = (req, res) => {
  pool.query(queries.getStudents, (error, results) => {
    if (error) throw error;
    res.status(200).json(results.rows);
  });
};

const getStudentById = (req, res) => {
  const id = parseInt(req.params.id);
  pool.query(queries.getStudentById, [id], (error, results) => {
    if (error) throw error;
    res.status(200).json(results.rows);
  });
};

const addStudent = (req, res) => {
  const { name, email, age, dob } = req.body;

  //check if email exists
  pool.query(queries.checkEmailExists, [email], (error, results) => {
    if (results.rows.length) {
      res.send("email already exists");
    } else {
      //add student to db
      pool.query(
        queries.addStudent,
        [name, email, age, dob],
        (error, results) => {
          if (error) throw error;
          res.status(201).send("student successfully created");
        }
      );
    }
  });
};

const editStudent = (req, res) => {
  const id = parseInt(req.params.id);

  pool.query(queries.getStudentById, [id], (error, results) => {
    if (error) throw error;
    if (results.rows.length < 1) {
      res.send("student does not exist in the database");
    } else {
      let student = results.rows[0];
      for (let property in student) {
        if (req.body[property]) student[property] = req.body[property];
      }
      pool.query(
        queries.editStudent,
        [id, student.name, student.email, student.age, student.dob],
        (error, results) => {
          if (error) throw error;
          res.status(201).send("student successfully updated");
        }
      );
    }
  });
};

const deleteStudent = (req, res) => {
  const id = parseInt(req.params.id);
  pool.query(queries.getStudentById, [id], (error, results) => {
    const noStudentFound = !results.rows.length;
    if (error) throw error;
    if (noStudentFound) {
      res.send("student does not exist in the database");
    } else {
      pool.query(queries.deleteStudent, [id], (error, results) => {
        if (error) throw error;
        res.status(200).send("student successfully removed");
      });
    }
  });
};

module.exports = {
  getStudents,
  getStudentById,
  addStudent,
  editStudent,
  deleteStudent,
};
