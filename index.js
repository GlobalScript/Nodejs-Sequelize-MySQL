const express = require('express');
const cors = require('cors');
const routes = require("./src/routes/index");
const path = require('path');

const CORS_DOMAIN_1 = process.env.CORS_DOMAIN_1;
const CORS_DOMAIN_2 = process.env.CORS_DOMAIN_2;
const PORT = process.env.PORT;

const app = express();

// const db = require("./src/models/index");
// db.sequelize.sync({force: false}).then(() => console.log("Sync DB"));


const corsOptions = {
    origin: [CORS_DOMAIN_1, CORS_DOMAIN_2].filter(Boolean),
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept, Authorization"
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(routes);

app.use(express.static(path.join(__dirname, 'public')));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

app.use((req, res) => {
    res.status(404).send({error: "not found"});
});
