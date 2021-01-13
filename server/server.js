const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const queryController = require("./controllers/queryController.js");

// handle parsing request body and cookies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// ROUTE HANDLERS FOR MIDDLEWARE CRUD FUNCTIONALITY:
app.post(
  "/newUser",
  queryController.addNewUser
);
// DELETE request to delete row(s) by ID(s)
app.delete("/field/:id", queryController.deleteFieldsRow);
// // DELETE request to delete a row in the schema_list table
app.delete("/schema/:id", queryController.deleteSchemaRow);

/* STRETCH FEATURES:
additional endpoints to add/edit rows in the fields table */
// POST request to add row(s) to field table where table_name already exists
app.post("/schema/:id", queryController.addFieldsRow);
// PATCH request to edit the fields in an existing row in the fields table
app.patch("/field/:id", queryController.editFieldsRow);

// catch-all route handler for any requests to an unknown route
app.use("*", (req, res) => res.sendStatus(404));

// // global error handler
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send("Internal Server Error");
});

app.listen(3000, () => {
  console.log("Listening on port 3000!");
});
