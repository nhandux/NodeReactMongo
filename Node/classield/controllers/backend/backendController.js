
// var mongoose = require('mongoose');

// var category = mongoose.model('Category');
var Category = require('../../models/category');

exports.categoryForm = function(req, res, next) {
    res.render('backend/category_form', {
        layout: 'backend',
        title: 'Form Category Page',
    });
}

exports.postCategory = function(req, res, next) {
    if(!req.body._id) insertRecord(req, res);
    else updateRecore(req, res);         
}


exports.categoryEdit = function(req, res, next) {
    Category.findById(req.params.id, (err, docs) =>{
        if(!err){
            res.render('backend/category_form', {
                layout: 'backend',
                title: 'Edit Category Page',
                category: docs
            });
        }else{
            console.log('Cannot find by ID');
        }
    })
}

exports.categoryDelete = function(req, res, next) {
    Category.findByIdAndRemove({_id: req.params.id}, (err, docs)=>{
        if(!err){
            res.redirect('/admin/category');
        }else{
            console.log('Cannot find data');
        }
    })
}

exports.category_list = function(req, res, next) {
    Category.find((err, docs)=>{
        if(!err){
            res.render('backend/category', {
                layout: 'backend',
                title: 'Category Page',
                category: docs
            });
        }else{
            console.log('errors Function');
        }
    })
}

function insertRecord(req, res){
    var category = new Category();
    category.name = req.body.name;
    category.slug = req.body.slug;
    category.is_active = req.body.is_active;
    category.save(function(err, result){
        if(!err) res.redirect('/admin/category');
        else {
            if(err.name = 'ValidationError'){
                handleValidationError(err, req.body);
                res.render("backend/category_form", {
                    title: 'Add Category',
                    category: req.body
                });
            }else{
                console.log('Has errors');
            }
        }
    });
}

function handleValidationError(err, body){
    for(field in err.errors){
        switch (err.errors[field].path) {
            case 'name' : body['nameError'] = err.errors[field].message;
            break;
            case 'slug' : body['slugError'] = err.errors[field].message; 
            break;
            default : break;
        }
    }
}

function updateRecore(req, res){
    Category.findOneAndUpdate({_id: req.body._id}, req.body, {new: true}, (err, doc)=>{
        if(!err){
            res.redirect('/admin/category');
        }else{
            if(err.name = 'ValidationError'){
                handleValidationError(err, req.body);
                res.render("backend/category_form", {
                    title: 'Edit Category',
                    category: req.body
                });
            }else{
                console.log('Has errors');
            }
        }
    })
}

