const fs = require("fs");
const path = require("path");
const mongoosePaginate = require ("mongoose-pagination");
const Artist = require ("../models/artist");
const Album = require ("../models/album");
const Song = require ("../models/song");
function getAlbum(req, res){
    let albumId = req.params.id;

    Album.findById(albumId).populate({path: "artist"}).exec((err, album) =>{

        if(err){
            res.status(500).send({message: "Error en la petición"});

        }else{
            if(!album){
                res.status(404).send({message: "No existe el album"});
            }else{

                res.status(200).send({album});
            }
        }
    })

    
}

function saveAlbum(req,res){
    let album = new Album ();

    let params = req.body;
    album.title = params.title;
    album.description = params.description;
    album.year = params.year;
    album.image = "null";
    album.artist = params.artist;
    album.save((err, albumStored) => {
        if(err){
            res.status(500).send({message: "Error en el servidor"});
        }else {
            if(!albumStored){

                res.status(404).send({message: "No se ha guardado el album"});

            }else{
                res.status(200).send({album: albumStored});


            }
        }


    })
}

function getAlbums(req, res){

    let artistId = req.params.artist;

    if(!artistId){

        //Sacar todos los albums de la BBDD.

        var find = Album.find({}).sort("title");


    }else {
        //Sacar los albums de un artista concreto de la BBDD.
        var find = Album.find({artist: artistId}).sort("year");
    }

    find.populate({path:'artist'}).exec((err,albums) =>{
        if(err){
            res.status(500).send({message: "Error en la petición"});

        }else {
            if(!albums){
                res.status(404).send({message: "No hay albums"});
            }else{
                res.status(200).send({albums});
            }
        }
    })
}
function updateAlbum(req, res){
    let albumId = req.params.id;
    let update = req.body;
    
    Album.findByIdAndUpdate(albumId, update, (err, albumUpdated) =>{

        if(err){
            res.status(500).send({message: "Error en la petición"});

        }else {
            if(!albumUpdated){
                res.status(404).send({message: "No se ha actualizado el album"});
            }else{
                res.status(200).send({album: albumUpdated});
            }
        }
    
    });
}

function deleteAlbum(req, res){
    let albumId = req.params.id;

    Album.findByIdAndRemove(albumId,(err, albumRemoved)=>{
        if(err){
            res.status(500).send({message: "Error al eliminar el album"});

        }else{
            if(!albumRemoved){
                res.status(404).send({message: "El album no ha sido eliminado"});

            }else{
                Song.find({album: albumId}).remove((err, songRemoved)=>{
                    if(err){
                        res.status(500).send({message: "Error al eliminar la canción"});
            
                    }else{
                        if(!songRemoved){
                            res.status(404).send({message: "La canción no ha sido eliminada"});
            
                        }else{
                            res.status(200).send({album:albumRemoved});

                        }
                    }
                });
            }

               
                
        }
    });
}
function uploadImage(req, res){

    var albumId = req.params.id;
    var file_name = "No subido";

    if(req.files){

        var file_path = req.files.image.path;
        var file_split = file_path.split('/');
        var file_name = file_split[2];
        console.log(file_split);
        var ext_split = file_path.split('\.');
        var file_ext = ext_split[1];


       if(file_ext == "png" || file_ext == "jpg" || file_ext == "jpeg"|| file_ext == "gif" ){

        Album.findByIdAndUpdate(albumId,{image: file_name}, (err, albumUpdated)=> {
            if(!albumUpdated){
                res.status(404).send({message:"No se ha podido actualizar el usuario"});

            }else{
                res.status(200).send({album: albumUpdated});

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
    let path_file = "./uploads/albums/" + imageFile;
    fs.exists(path_file, function(exists){
        if (exists){

            res.sendFile(path.resolve(path_file));
        }else{
            res.status(200).send({message:"No existe la imagen"});
        }
    })
}

module.exports = {

    getAlbum,
    saveAlbum,
    getAlbums,
    updateAlbum,
    deleteAlbum,
    uploadImage,
    getImageFile
};