const express = require("express");
const userController = require("../controllers/user");
const md_auth = require("../middlewares/authenticated");
const multipart = require("connect-multiparty");
const md_upload = multipart({uploadDir: "./uploads/users"});
const api = express.Router();


api.get("/probando-controlador", md_auth.ensureAuth, userController.pruebas);
api.post("/register", userController.saveUser);
api.post("/login", userController.loginUser);
api.put("/update-user/:id", md_auth.ensureAuth, userController.updateUser);
api.post("/upload-image-user/:id", [md_auth.ensureAuth, md_upload], userController.uploadImage);
api.get("/get-image-user/:imageFile", userController.getImageFile);

module.exports = api;