const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs'); 
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    const dateHeure = new Date().toISOString();
    const methode = req.method; 
    const urlVisitee = req.url;  
    const ipVisiteur = req.ip;   

  
    res.on('finish', () => {
        const statut = res.statusCode;
        const ligneLog = `[${dateHeure}] IP: ${ipVisiteur} | Action: ${methode} ${urlVisitee} | Statut: ${statut}\n`;
        
        fs.appendFile(path.join(__dirname, 'visiteurs.log'), ligneLog, (err) => {
            if (err) console.error("Impossible d'écrire dans le fichier de logs :", err.message);
        });
    });

    next();
});

const db = new sqlite3.Database('./database.db', (err) => {
    if (err) console.error("Erreur de connexion BDD :", err.message);
    else console.log("Base de données SQLite connectée avec succès.");
});

db.run(`CREATE TABLE IF NOT EXISTS temoignages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL
)`);

app.post('/api/temoignages', (req, res) => {
    const { nom, email, message } = req.body;
    const sql = `INSERT INTO temoignages (nom, email, message) VALUES (?, ?, ?)`;
    
    db.run(sql, [nom, email, message], function(err) {
        if (err) {
            const logErreur = `[${new Date().toISOString()}] ERREUR BDD : ${err.message}\n`;
            fs.appendFile(path.join(__dirname, 'visiteurs.log'), logErreur, () => {});
            return res.status(500).json({ error: err.message });
        }
        res.json({ success: true, id: this.lastID });
    });
});

app.get('/api/temoignages', (req, res) => {
    db.all("SELECT nom, email, message FROM temoignages ORDER BY id DESC", [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});


app.listen(PORT, () => {
    console.log(`[Flori Service] Serveur actif sur : http://localhost:${PORT}`);
});
