const express = require('express');

const { register, login, setAvatar, getAllUsers } = require('../controllers/user.controller');

const userRoute = express.Router();

userRoute.post("/register", register);
userRoute.post("/login", login);
userRoute.post("/setAvatar/:id", setAvatar);
userRoute.get("/allUsers/:id", getAllUsers);

module.exports = userRoute;