const fs = require("fs");
const path = require("path");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));


app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "note-taker/public/notes.html"));
});


app.get("/api/notes", function (req, res) {
    fs.readFile("db/db.json", function (err, data) {
        if (err) {
            throw err;
        }
        res.json(JSON.parse(data))

    })
});

app.post("/api/notes", function (req, res) {
    const note = req.body;
    fs.readFile("db/db.json", function (err, data) {
        if (err) throw err;
        const notes = JSON.parse(data)
        note.id = notes.length
        notes.push(note)
        console.log(notes);

        fs.writeFile("db/db.json", JSON.stringify(notes), function (err) {
            if (err) throw err;
            res.json(note)
        })
    })

});
app.delete("/api/notes/:id", function (req, res) {
    const id = parseInt(req.params.id);

    fs.readFile("db/db.json", function (err, data) {
        if (err) throw err;
        const notes = JSON.parse(data)
        // console.log(notes[id])
        notes.splice(id, 1)
        console.log("before", notes);
        notes.forEach(function (item, index) {
            item.id = index;

        })
        console.log("after", notes);
        fs.writeFile("db/db.json", JSON.stringify(notes), function (err) {
            if (err) throw err;
            res.send(true)
        })
    })
});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "note-taker/public/index.html"));
});

app.listen(PORT, function () {
    console.log("Server listening on Port:" + PORT);
});
