//Puerto
process.env.PORT = process.env.PORT || 3000;

//Entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//Base de datos
let urlDB;
if(process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/coffee_shop';
} else {
    urlDB = 'mongodb+srv://David:7CYnjMnUn91vQmMG@cluster0-c9bz7.mongodb.net/coffee_shop';
}

process.env.URLDB = urlDB;