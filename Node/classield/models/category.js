var mongoose = require('mongoose');

var categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: 'Name Required'
    },
    slug: {
        type: String,
        required: 'Slug Required'
    },
    status: {
        type: Number
    },
    parent: {
        type: String
    },
    description: {
        type: String
    },
    created_time: {
        type: String
    }
});

module.exports = mongoose.model('Category', categorySchema);