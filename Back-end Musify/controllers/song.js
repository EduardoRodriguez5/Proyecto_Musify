const fs = require("fs");
const path = require("path");
const mongoosePaginate = require ("mongoose-pagination");
const Artist = require ("../models/artist");
const Album = require ("../models/album");
const Song = require ("../models/song");

function getSong(req,res){
    let songId = req.params.id;

    Song.findById(songId).populate({path: "album"}).exec((err, song) =>{

        if(err){
            res.status(500).send({message:"Error en la petición"});
        }else {
            if(!song){
                res.status(404).send({message:"No se ha encontrado la canción"});

            }else {

                res.status(200).send({song});

            }
        }
    })
}

function saveSong(req,res){

    let song = new Song();

    let params = req.body;
    song.number = params.number;
    song.name = params.name;
    song.duration = params.duration;
    song.file = null;
    song.album = params.album;

    song.save((err,songStored)=>{
        if(err){
            res.status(500).send({message:"Error en el servidor"});

        }else{
            if(!songStored){
                res.status(404).send({message:"No se ha guardado la canción"});

            }else{
                res.status(200).send({song: songStored});

            }

        }
    })
}

function getSongs(req, res){

    let albumId = req.params.album;

    if (!albumId){
        var find = Song.find({}).sort("number");
    }else{
        var find = Song.find({album: albumId}).sort("number");
    }

    find.populate({
        path: "album",
        populate: {
            path: "artist",
            model: "Artist"
        }
    }).exec((err,songs) =>{
        if(err){
            res.status(500).send({message:"Error en el servidor"});

        }else{
            if(!songs){
                res.status(404).send({message:"No hay canciones"});

            }else{
                res.status(200).send({songs});

            }
        }
    })
}

function updateSong(req, res){

    let songId = req.params.id;
    let update = req.body;

    Song.findByIdAndUpdate(songId, update, (err, songUpdated) =>{
        if(err){
            res.status(500).send({message:"Error en el servidor"});

        }else{
            if(!songUpdated){
                res.status(404).send({message:"No se ha actualizado la canción"});

            }else{
                res.status(200).send({song: songUpdated});

            }
        }
    })
}

function deleteSong(req,res){

    let songId = req.params.id;
    Song.findOneAndRemove(songId, (err, songRemoved) =>{
        if(err){
            res.status(500).send({message:"Error en el servidor"});

        }else{
            if(!songRemoved){
                res.status(404).send({message:"No se ha eliminadola canción"});

            }else{
                res.status(200).send({song: songRemoved});

            }
        }
    })
}

function uploadFile(req, res){

    var songId = req.params.id;
    var file_name = "No subido";

    if(req.files){

        var file_path = req.files.file.path;
        var file_split = file_path.split('/');
        var file_name = file_split[2];
        console.log(file_split);
        var ext_split = file_path.split('\.');
        var file_ext = ext_split[1];


       if(file_ext == "mp3" || file_ext == "ogg"){

        Song.findByIdAndUpdate(songId,{file: file_name}, (err, songUpdated)=> {
            if(!songUpdated){
                res.status(404).send({message:"No se ha podido actualizar la canción"});

            }else{
                res.status(200).send({song: songUpdated});

            }
        });

       }else{
        res.status(200).send({message:"Extensión del archivo no valida"});
       }


    }else{
        res.status(200).send({message:"No has subido ninguna imagen"});
    }

}
function getSongFile(req,res){
    let songFile = req.params.songFile;
    let path_file = "./uploads/songs/" + songFile;
    fs.exists(path_file, function(exists){
        if (exists){

            res.sendFile(path.resolve(path_file));
        }else{
            res.status(200).send({message:"No existe la canción"});
        }
    })
}


module.exports = {
    getSong,
    saveSong,
    getSongs,
    updateSong,
    deleteSong,
    uploadFile,
    getSongFile

}