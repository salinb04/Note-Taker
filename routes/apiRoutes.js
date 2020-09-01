// ===============================================================================
// LOAD DATA
// We are linking our routes to a series of "data" sources.
// These data sources hold arrays of information on table-data, waitinglist, etc.
// ===============================================================================

var fs = require("fs");
var path = require("path");
var filePath = path.join(__dirname, "../db/db.json");
const { v4: uuidv4 } = require("uuid");

function readDBFile() {
  return JSON.parse(fs.readFileSync(filePath));
}

function writeDBFile(notes) {
  fs.writeFileSync(filePath, JSON.stringify(notes));
}

// ===============================================================================
// ROUTING
// ===============================================================================

module.exports = function (app) {
  // API GET Requests
  // Below code handles when users "visit" a page.
  // In each of the below cases when a user visits a link
  // (ex: localhost:PORT/api/admin... they are shown a JSON of the data in the table)
  // ---------------------------------------------------------------------------

  app.get("/api/notes", function (req, res) {
    var notes = readDBFile();
    return res.json(notes);
  });

  // API POST Requests
  // Below code handles when a user submits a form and thus submits data to the server.
  // In each of the below cases, when a user submits form data (a JSON object)
  // ...the JSON is pushed to the appropriate JavaScript array
  // (ex. User fills out a reservation request... this data is then sent to the server...
  // Then the server saves the data to the tableData array)
  // ---------------------------------------------------------------------------

  app.post("/api/notes", function (req, res) {
    var newNote = req.body;
    newNote.id = uuidv4();

    var notes = readDBFile();
    notes.push(newNote);

    writeDBFile(notes);

    return res.json(newNote);
  });

  app.delete("/api/notes/:id", function (req, res) {
    // Keeps everything that does not match given id
    var notes = readDBFile();
    notes = notes.filter((note) => note.id !== req.params.id);

    writeDBFile(notes);

    return res.json(notes);
  });
};
