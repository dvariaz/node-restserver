const express = require('express');
const { verifyToken, verifyAdmin } = require('../middlewares/auth');
const router = express.Router();

let Category = require('../models/category');

router.get('/categorias', verifyToken, (req, res) => {
    let from = Number(req.query.from) || 0;
    let limit = Number(req.query.limit) || 5;

    Category.find({})
        .skip(from)
        .limit(limit)
        .sort('name')
        .populate('user', 'name email')
        .exec( (err, categories) => {
            if(err){
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            Category.countDocuments({}, (err, count) => {
                res.json({
                    ok: true,
                    count,
                    categories
                })
            })
        })
})

router.get('/categoria/:id', verifyToken, (req, res) => {
    let id = req.params.id;
    Category.findById(id, (err, categoryDB) => {
        if(err){
            return res.status(500).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            category: categoryDB
        })
    })
})

router.post('/categoria', [verifyToken, verifyAdmin], (req, res) => {
    let body = req.body;

    let category = new Category({
        name: body.name,
        user: req.user._id
    })

    category.save((err, categoryDB) => {
        if(err){
            return res.status(500).json({
                ok: false,
                err
            })
        }

        res.status(201).json({
            ok: true,
            category: categoryDB
        })
    })
})

router.put('/categoria/:id', [verifyToken, verifyAdmin], (req, res) => {
    let id = req.params.id;
    let body = req.body;
    Category.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, categoryDB) => {
        if(err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            category: categoryDB
        })
    })
})

router.delete('/categoria/:id', [ verifyToken, verifyAdmin ],  (req, res) => {
    let id = req.params.id;

    Category.findByIdAndRemove(id, (err, categoryDB) => {
        if(err){
            res.status(400).json({
                ok: false,
                err
            })
        }

        if(!categoryDB){
            return res.status(404).json({
                ok: false,
                err:{
                    message: 'El ID de categoria no existe'
                }
            })
        }

        res.json({
            ok: true,
            message: 'Categoria eliminada'
        })
    })
})

module.exports = router;