const mysql = require("mysql");
const path = require("path");
const express = require("express");
const app = express();

//Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

/* Connectiong to MySQL Database */
var sqlConnection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "studentdb",
});

sqlConnection.connect((err) => {
  if (!err) {
    console.log("DB Connection Successful!!");
  } else {
    console.log("DB Connection failed");
  }
});

app.get("/", (req, res) => {
  res.sendFile(__dirname +"/index.html", (err) => {
    if (err) {
      console.log("Error occured while loading HTML file");
    }
  });
});


//To get all student information
app.get("/student", (req, res) => {
  sqlConnection.query("SELECT * FROM student", (err, rows, fields) => {
    if (!err) {
      res.send(rows);
    } else {
      console.log(err);
    }
  });
});

//To post user data to database
app.post("/student/new", (req, res) => {
  const { RollNo, Name, Age, Address, Department } = req.body;
  sqlConnection.query(
    "INSERT INTO student(RollNo,Name,Age,Address,Department) values('" +
      RollNo +
      "','" +
      Name +
      "', '" +
      Age +
      "','" +
      Address +
      "','" +
      Department +
      "')",
    (err, rows, fields) => {
      if (err) {
        return console.log("Something went wrong while posting data");
      }
    }
    );
    return res.send("Data uploaded successfully");  
});

//To get a particular student information based on post RollNo
app.post("/view", (req, res) => {
  const { id } = req.body;
  sqlConnection.query(
    "SELECT * FROM student WHERE RollNo = ?",
    [id],
    (err, rows, fields) => {
      if (!err) {
        res.send(rows);
      } else {
        console.log(err);
      }
    }
  );
});

//Delete a student
app.post("/student/delete", (req, res) => { 
  sqlConnection.query(
    "DELETE FROM student WHERE RollNo = ?",
    [req.body.id],
    (err, rows, fields) => {
      if (!err) {
        res.send("Deleted Successfully");
      } else {
        console.log(err);
      }
    }
  );
});


//To update user data to database
app.post("/student/update", (req, res) => {
  const { RollNo, Name, Age, Address, Department } = req.body;
  sqlConnection.query(
    "UPDATE `student` SET `Name`=? , `Age`=? , `Address`=? , `Department`=? where `RollNo`=?",
    [Name, Age, Address, Department, RollNo],
    (err, rows, fields) => {
      if (err) {
        console.log("Something went wrong while updating data");
      } else {
        res.send("Data Updated");
      }
    }
  );
});

app.listen(3000, () => {
  console.log("Server is up and running!");
});




//NOT IN THE MAIN CODE 
//API TESTING PART
//Practice APIs

// 1.Delete a student
app.delete("/student/delete/:id", (req, res) => { 
   const {id} = req.params;
  sqlConnection.query(
    "DELETE FROM student WHERE RollNo = ?",
    [id],
    (err, rows, fields) => {
      if (!err) {
        res.send("Deleted Successfully");
      } else {
        console.log(err);
      }
    }
  );
});

//2. Update a student 
app.put("/update", (req, res) => {
  const { RollNo, Name, Age, Address, Department } = req.body;
  sqlConnection.query(
    "UPDATE `student` SET `Name`=? , `Age`=? , `Address`=? , `Department`=? where `RollNo`=?",
    [Name, Age, Address, Department, RollNo],
    (err, rows, fields) => {
      if (err) {
        console.log("Something went wrong while updating data");
      } else {
        res.send("Data Updated");
      }
    }
  );
});

//3. Get a particular student information based on RollNo
app.get("/student/:id", (req, res) => {
  const { id } = req.params;
  sqlConnection.query(
    "SELECT * FROM student WHERE RollNo = ?",
    [id],
    (err, rows, fields) => {
      if (!err) {
        res.send(rows);
      } else {
        console.log(err);
      }
    }
  );
});