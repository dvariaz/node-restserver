const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const User = require('../models/user');
const Product = require('../models/product');

router.use(fileUpload({ useTempFiles: true }));

router.put('/upload/:type/:id', (req, res) => {
    let type = req.params.type;
    let id = req.params.id;

    //Validacion de archivo
    if(!req.files){
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningun archivo'
            }
        });
    }

    let file = req.files.file;
    let [ filename, ext ] = file.name.split('.');
    
    //Validacion de tipos
    let validTypes = ['productos','usuarios'];

    let typeTranslate = {
        'productos': 'products',
        'usuarios': 'users',
    }
    
    if(validTypes.indexOf(type) < 0){
        return res.status(400).json({
            ok: false,
            err:{
                message: 'Los tipos permitidos son ' + validTypes.join(', '),
                ext
            }
        });
    }

    //Validacion de extensiones
    let validExt = ['png', 'jpg', 'gif', 'jpeg'];

    if(validExt.indexOf(ext) < 0){
        return res.status(400).json({
            ok: false,
            err:{
                message: 'Las extensiones permitidas son ' + validExt.join(', ')
            }
        });
    }

    let newPath = `uploads/${ typeTranslate[type] }/${ id }-${ new Date().getMilliseconds() }.${ ext }`;

    file.mv(`${ newPath }`, (err) => {
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(type === 'usuarios'){
            updateUserImage(id, res, newPath);
        }else if(type === 'productos'){
            updateProductImage(id, res, newPath);
        }
    });
})

const updateUserImage = (id, res, imagePath) => {
    User.findById(id, (err, userDB) => {
        if(err) {
            removeFile(imagePath);

            return res.status(500).json({
                ok: false,
                err
            })
        }

        if(!userDB) {
            removeFile(imagePath);

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            })
        }
        
        removeFile(userDB.img);
        
        userDB.img = imagePath;

        userDB.save( (err, savedUser) => {
            res.json({
                ok: true,
                user: savedUser,
                img: imagePath
            })
        })
    })
}

const updateProductImage = (id, res, imagePath) => {
    Product.findById(id, (err, productDB) => {
        if(err) {
            removeFile(imagePath);

            return res.status(500).json({
                ok: false,
                err
            })
        }

        if(!productDB) {
            removeFile(imagePath);

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no existe'
                }
            })
        }
        
        removeFile(productDB.img);
        
        productDB.img = imagePath;

        productDB.save( (err, savedProduct) => {
            if(err) {
                removeFile(imagePath);

                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                product: savedProduct,
                img: imagePath
            })
        })
    })
}

const removeFile = (filePath) => {
    let fsPath = path.resolve(__dirname, `../../${ filePath }`);
    if(fs.existsSync(fsPath)) {
        fs.unlink(fsPath, (err) => {
            if(err){
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
        })
    }
} 

module.exports = router;