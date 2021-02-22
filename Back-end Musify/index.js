
const mongoose = require('mongoose');
const app = require("./app");
const port = process.env.PORT || 3978;
const DB_URL = 'mongodb://localhost:27017/Musify';

mongoose.connect(DB_URL,{ useNewUrlParser: true, useUnifiedTopology: true}, (err, res) =>{

    if(err){
        throw err;
    }
    else{
       
        console.log("La base de datos está conectada correctamente");

        app.listen(port, () =>{
            console.log("Servidor del api rest de música escuchando en http:/localhost:" + port)
        })
    }
   
})