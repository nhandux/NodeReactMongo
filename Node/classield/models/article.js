var mongoose = require("mongoose");

var Schema = new mongoose.Schema({
    name: {
        type: String,
        required: "Name Required"
    },
    slug: {
        type: String,
        required: "Slug Required"
    },
    category: {
        type: String
    },
    created_time: {
        type: String
    },
    comment: {
        type: String
    },
    content: {
        type: String
    },
    title: {
        type: String
    },
    keyworks: {
        type: String
    },
    description: {
        type: String
    },
    status: {
        type: Number
    },
    hot: {
        type: Number
    },
    images: {
        type: String
    },
    author: {
        type: String
    },
    comment_images: {
        type: String
    },
});

module.exports = mongoose.model("Article", Schema);
