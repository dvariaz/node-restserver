const mongoose = require('mongoose');

const Schema = mongoose.Schema;

mongoose.set('useFindAndModify', false);

let categorySchema = new Schema({
    name: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

module.exports = mongoose.model('Category', categorySchema);