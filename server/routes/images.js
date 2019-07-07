const express = require('express');
const path = require('path');
const fs = require('fs');
const router  = express.Router();

const { verifyImageToken } = require('../middlewares/auth');

router.get('/imagen/:type/:img', verifyImageToken, (req, res) => {
    let type = req.params.type;
    let img = req.params.img;

    let imagePath = path.resolve(__dirname, `../../uploads/${type}/${img}`);

    if(fs.existsSync(imagePath)){
        res.sendFile(imagePath);
    }else{
        let noImagePath = path.resolve(__dirname, '../assets/no-image.jpg');
        res.sendFile(noImagePath);
    }


});

module.exports = router;