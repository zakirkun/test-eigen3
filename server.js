require('dotenv').config();
const express = require('express');
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./src/database/database');
const webRouter = require('./src/router/router');

const app = express();
const PORT = process.env.PORT || 3000;

db.sync().then(() => {
    console.log('Database Sync!');
}).catch((err) => {
    console.log('Database failed Sync! ', err.message);
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// cors
app.use(cors());

app.get("/", (req, res) => {
    return res.json({
        message: 'Welcome to api!',
        author: "Muh Zakir Ramadhan"
    })
});

const options = {
    definition: {
      openapi: "3.1.0",
      info: {
        title: "Library API with Swagger",
        version: "0.1.0",
        description:
          "This is a simple CRUD Library documented with Swagger",
        license: {
          name: "MIT",
          url: "https://spdx.org/licenses/MIT.html",
        },
        contact: {
          name: "Zakir",
          url: "https://localhost",
          email: "zakir@gnuweeb.org",
        },
      },
      servers: [
        {
          url: "http://localhost:3000",
        },
      ],
    },
    apis: ["./src/router/router.js"],
};

const specs = swaggerJsdoc(options);
app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(specs, { explorer: true })
);
  

app.use("/api", webRouter);

app.listen(PORT, async () => {
    console.log("Application runnning on PORT: ", PORT);

    try {   
        await db.authenticate();
    } catch (error) {
        console.log("Database failed: ", error.message);
    }
});