const express = require('express');
const { verifyToken, verifyAdmin } = require('../middlewares/auth');
const router = express.Router();

let Product = require('../models/product');
let Category = require('../models/category');

router.get('/productos', verifyToken, (req, res) => {
    let from = Number(req.params.from) || 0;
    let limit = Number(req.params.limit) || 5;
    
    Product.find({ state: true })
        .skip(from)
        .limit(limit)
        .populate('category', 'name')
        .populate('user', 'name email')
        .exec((err, productsDB) => {
            if(err){
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            Product.countDocuments({ status: true }, (err, count) => {
                res.json({
                    ok: true,
                    count,
                    productsDB
                })
            })
        })
})

router.get('/producto/:id', verifyToken, (req, res) => {
    let id = req.params.id;

    Product.findById(id)
        .populate('category', 'name')
        .populate('user', 'name email')
        .exec((err, productDB) => {
            if(err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            if(!productDB.state){
                return res.status(404).json({
                    ok: false,
                    err: {
                        message: 'Producto no disponible'
                    }
                })
            }

            res.json({
                ok: true,
                product: productDB
            })
        })
})

router.get('/productos/buscar/:term', verifyToken, (req, res) => {
    let term = req.params.term;
    let regex = new RegExp(term,'i');

    Product.find({ name: regex, state: true })
        .populate('category', 'name')
        .exec((err, products) => {
            if(err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                products
            })
        })
})

router.post('/producto',[ verifyToken, verifyAdmin ], (req, res) => {
    let body = req.body;

    Category.findById(body.category, (err, categoryDB) => {
        if(err){
            return res.status(400).json({
                ok: false,
                err
            })
        }
        
        if(!categoryDB){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoría no encontrada'
                }
            })
        }

        let product = new Product({
            name: body.name,
            price: body.price,
            description: body.description,
            category: categoryDB._id,
            user: req.user._id
        });

        product.save((err, productDB) => {
            if(err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.status(201).json({
                ok: true,
                product: productDB
            })
        })

    })

})

router.put('/producto/:id',[ verifyToken, verifyAdmin ], (req, res) => {
    let id = req.params.id;
    let body = req.body;

    Product.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productDB) => {
        if(err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            productDB
        })
    })
})

router.delete('/producto/:id',[ verifyToken, verifyAdmin ], (req, res) => {
    let id= req.params.id;

    Product.findByIdAndUpdate(id,{ state: false }, { new: true, runValidators: true}, (err, productDB) => {
        if(err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        if(!productDB.state){
            return res.status(404).json({
                ok: false,
                err:{
                    message: 'El ID de producto no existe'
                }
            })
        }

        res.json({
            ok: true,
            product: productDB
        })
    })
})

module.exports = router;