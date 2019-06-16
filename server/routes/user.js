const express = require('express');
const User = require('../models/user');
const app = express();
const bcrypt = require('bcrypt');
const _ = require('underscore');

app.get('/usuario', (req, res) => {
    let from = Number(req.query.from) || 0;
    let limit = Number(req.query.limit) || 5;

    User.find({ state: true }, 'name email role state google')
        .skip(from)
        .limit(limit)
        .exec( (err, users) => {
            if(err){
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            User.count({ state: true }, (err, count) => {
                res.json({
                    ok: true,
                    count,
                    users
                })
            })
        } );
})

app.post('/usuario', (req, res) => {
    let body = req.body;

    let user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    })

    user.save((err, userDB) => {
        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }
        //userDB.password = null;
        res.json({
            ok: true,
            user: userDB
        })
    })
})

app.put('/usuario/:id', (req, res) => {
    let id = req.params.id;
    let body = _.pick( req.body, ['name', 'email', 'img', 'role', 'state'] );

    User.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, userDB) => {
        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            user: userDB
        });
    })

})

app.delete('/usuario/:id', (req, res) => {
    let id = req.params.id;

    //User.findByIdAndRemove(id, (err, deletedUser) => {
    User.findByIdAndUpdate(id, { state: false }, (err, deletedUser) => {
        if(err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        if(!deletedUser.state){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            user: deletedUser
        })
    })
})

module.exports = app;