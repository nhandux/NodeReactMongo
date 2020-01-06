var Category = require("../models/category");
var settup = require("../config/settup");

exports.listCategory = function(req, res, next) {
  let keyworks = req.query.keyworks;
  let search = {};
  let skip = 0;
  if (keyworks != "") {
    search.name =  new RegExp(keyworks, "i");
  } 
  if(req.query.status && req.query.status !== 'undefined') {
    search.status = req.query.status;
  }

  if (req.query.limit !== "-1") {
    skip = (Number(req.query.page) - 1) * Number(req.query.limit);
  }

  Category.find(search)
    .lean()
    .skip(skip)
    .limit(req.query.limit !== "-1" ? Number(req.query.limit) : null)
    .exec(function(err, category) {
      if (err) throw err;
      if (!category) {
        res.json({ message: "Authenticated!." });
      } else if (category) {
        res.json(category);
      }
    });
};

exports.countListCategory = function(req, res, next) {
    let keyworks = req.query.keyworks; 
    let search = {};
    if(keyworks != '') {
        search = {
            name: new RegExp(keyworks, 'i') 
        }
    }
    Category.countDocuments(search).exec((err, count) => {
        if (err) {
          res.json({ message: "Had error in process.", success: false });
        }
        res.json(count);
    });
};

exports.createCategory = function(req, res, next) {
  Category.find(
    { $or: [{ name: req.body.name }, { slug: req.body.slug }] },
    function(err, category) {
      if (err) throw err;
      if (!category || category.length == 0) {
        var category = new Category();
        category.name = req.body.name;
        category.slug = req.body.slug;
        category.parent = req.body.parent;
        category.description = req.body.description;
        category.status = req.body.status;
        category.created_time = settup.now;
        category.save(function(err, result) {
          if (!err)
            res.json({ message: "Data save success!.", success: true });
          else {
            res.json({
              message: "Had error in process.",
              success: false
            });
          }
        });
      } else if (category) {
        res.json({ message: "Had error in process.", success: false });
      }
    }
  );
};

exports.delCategory = function(req, res, next) {
  Category.deleteMany(
    {
      _id: {
        $in: req.body
      }
    },
    function(err, result) {
      if (!err) {
        res.json({ message: "Data delete success.", success: true });
      } else {
        res.json({ message: "Had error in process.", success: false });
      }
    }
  );
};

exports.detailCategory = function(req, res, next) {
  Category.findOne({ _id: req.query.id }, function(err, category) {
    if (err) throw err;
    if (!category) {
      res.json({ message: "Data not found in server." });
    } else if (category) {
      res.json(category);
    }
  });
};

exports.updateCategory = function(req, res, next) {
  Category.findOneAndUpdate(
    { _id: req.params.id },
    req.body,
    { new: true },
    (err, doc) => {
      if (!err) {
        res.json({ message: "Data save success.", success: true });
      } else {
        res.json({ message: "Had error in server.", success: false });
      }
    }
  );
};
