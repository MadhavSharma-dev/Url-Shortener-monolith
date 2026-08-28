//Responsible for 
//1) Express
//2) Middleware
//3) Routes

const express = require("express");
require("dotenv").config();

const app = express();

//PARSE JSON request bodies
app.use(express.json());

