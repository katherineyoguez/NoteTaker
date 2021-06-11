const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express()
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static("public"));

app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/notes.html"))
})

app.get("/api/notes", (req, res) => {
    fs.readFile("./db/db.json", (err, data) => {
        if(err) throw err;
        let dataEntry = JSON.parse(data)
        res.json(dataEntry)
    })
})

app.post("/api/notes", (req, res) => {
    fs.readFile("./db/db.json", (err, data) => {
        if(err) throw err;
        let arrOfNotes = JSON.parse(data)
        let dataNewNote = req.body
        dataNewNote["id"] = Math.floor(Math.random()*1)
        arrOfNotes.push(req.body)
        fs.writeFile("./db/db.json", JSON.stringify(arrOfNotes), (err) => {
            if(err) throw err;
            res.json(req.body)
        })
    })
})

app.delete("/api/notes/:id", (req, res) => {
    let idToDelete = req.params.id
    fs.readFile("./db/db.json", (err, data) => {
        if(err) throw err;
        let arrOfNotes = JSON.parse(data)
        for(i=0; i < arrOfNotes.length; i++){
            if(arrOfNotes[i].id == idToDelete){
                arrOfNotes.splice(i, 1)
            }
        }
        fs.writeFile("./db/db.json", JSON.stringify(arrOfNotes), (err) => {
            if(err) throw err;
            res.json(req.body)
        })
    })
})

app.listen(PORT, ()=>{
    console.log("working")
})