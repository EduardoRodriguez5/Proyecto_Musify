
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt-nodejs");
const User = require("../models/user");
const jwt= require ("../services/jwt");
function pruebas (req, res){

    res.status(200).send({
        message: "Probando probando"
    })
}
function saveUser(req, res){
    let user = new User();

    let params = req.body;

    console.log(params);

    user.name = params.name;
    user.surname = params.surname;
    user.email = params.email;
    user.role = "ROLE_USER";
    user.image = "null";

    if(params.password){
        //Encriptar contraseña y guardar datos.
        bcrypt.hash(params.password, null,null,function(error,hash){
            user.password = hash;
            if(user.name != null && user.surname != null && user.email != null){
                //Guardar el usuario 
                user.save((err, userStored) =>{
                    if(err){
                        res.satus(500).send({message:"Error al guardar el usuario"});
                    }
                    else{
                        if(!userStored){
                            res.status(404).send({message:"No se ha registrado el usuario"});

                        }else{
                            res.status(200).send({user:userStored});
                        }
                    }
                })
            }
            else{
                res.status(200).send({message:"Rellena todos los campos"});
                
            }
        })
    }
    else {
        res.status(500).send({message: "Introduce la contraseña"});
    }
}

function loginUser(req, res){

    let params = req.body;

    let email = params.email;
    let password = params.password;

    User.findOne({email: email.toLowerCase()}, (err, user) =>{

        if(err){
            res.status(500).send({message: "Error en la petición"});
        }else{
            if(!user){

                res.status(404).send({message: "El usuario no existe"});

            }else{
                bcrypt.compare(password, user.password, function(err, check){

                    if(check){
                        //devolver los datos del usuario logeado
                        if(params.gethash){
                            //devolver un token de jwt
                            res.status(200).send({
                                token: jwt.createToken(user)
                            });
                        }else{
                            res.status(200).send({user});
                        }
                    }else{
                        res.status(404).send({message: "El usuario no ha podido loguearse"});
                    }
                })

            }
        }
    })

}

function updateUser(req, res){
    let userId = req.params.id;
    let update = req.body;

    if(userId != req.user.sub){
       return res.status(500).send({message:"No tienes permiso para actualizar este usuario"});

    }

    User.findByIdAndUpdate(userId, update, (err,userUpdated) =>{

        if(err){
            res.status(500).send({message:"Error al actualizar el usuario"});
        }else{
            if(!userUpdated){
                res.status(404).send({message:"No se ha podido actualizar el usuario"});

            }else{
                res.status(200).send({user: userUpdated});

            }
        }
    });
}

function uploadImage(req, res){

    var userId = req.params.id;
    var file_name = "No subido";

    if(req.files){

        var file_path = req.files.image.path;
        var file_split = file_path.split('/');
        var file_name = file_split[2];
        console.log(file_split);
        var ext_split = file_path.split('\.');
        var file_ext = ext_split[1];


       if(file_ext == "png" || file_ext == "jpg"|| file_ext == "jpeg" || file_ext == "gif"){

        User.findByIdAndUpdate(userId,{image: file_name}, (err, userUpdated)=> {
            if(!userUpdated){
                res.status(404).send({message:"No se ha podido actualizar el usuario"});

            }else{
                res.status(200).send({image: file_name, user: userUpdated});

            }
        });

       }else{
        res.status(200).send({message:"Extensión del archivo no valida"});
       }


    }else{
        res.status(200).send({message:"No has subido ninguna imagen"});
    }

}
function getImageFile(req,res){
    let imageFile = req.params.imageFile;
    let path_file = "./uploads/users/" + imageFile;
    fs.exists(path_file, function(exists){
        if (exists){

            res.sendFile(path.resolve(path_file));
        }else{
            res.status(200).send({message:"No existe la imagen"});
        }
    })
}
module.exports = {
    pruebas,
    saveUser,
    loginUser,
    updateUser,
    uploadImage,
    getImageFile
};