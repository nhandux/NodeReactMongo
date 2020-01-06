var Article = require("../models/article");
var settup = require("../config/settup");

exports.listArticle = function(req, res, next) {
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
  Article.find(search)
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

exports.countListArticle = function(req, res, next) {
    let keyworks = req.query.keyworks; 
    let search = {};
    if(keyworks != '') {
        search = {
            name: new RegExp(keyworks, 'i') 
        }
    }
    Article.countDocuments(search).exec((err, count) => {
        if (err) {
          res.json({ message: "Had error in processs.", success: false });
        }
        res.json(count);
    });
};

function decodeBase64Image(dataString) {
    var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    var response = {};
    if (matches.length !== 3) {
      return new Error('Invalid input string');
    }
    response.type = matches[1];
    response.data = new Buffer(matches[2], 'base64');
    return response;
  }
  
exports.createArticle = function(req, res, next) {
    if(req.body.images && req.body.images != '') {
        var crypto                          = require('crypto');
        var uniqueSHA1String                = crypto.createHash('sha1').update(crypto.randomBytes(20)).digest('hex');
        var imageBuffer                     = decodeBase64Image(req.body.images)
        var imageTypeDetected               = imageBuffer.type.match(/\/(.*?)$/);
        var random = 'image-' + uniqueSHA1String + '.' + imageTypeDetected[1];
        var userUploadedImagePath           = 'public/images/' + random;
        var imgSave                         = 'images/' + random;
    }
    var article = new Article();
    article.name = req.body.name,
    article.slug = req.body.slug,
    article.category = req.body.category,
    article.created_time = req.body.created_time ? req.body.created_time : settup.now,
    article.comment = req.body.comment,
    article.content = req.body.content,
    article.title = req.body.title,
    article.author = req.body.author,
    article.keyworks = req.body.keyworks,
    article.description = req.body.description,
    article.status = req.body.status,
    article.hot = req.body.hot,
    article.images = req.body.images ? imgSave : '',
    article.comment_images = req.body.comment_images,
    article.save(function(err, result) {
      if (!err) {
        if(req.body.images && req.body.images != '') {
            try{
                require('fs').writeFile(userUploadedImagePath, imageBuffer.data, function() {
                    console.log('Success:', userUploadedImagePath);
                });
            } catch(error) {
                console.log('ERROR:', error);
            }
        }
        res.json({ message: "Data save success!.", success: true });
      } else {
        res.json({ message: "Had error in process.",success: false });
      }
    });
};

exports.delArticle = function(req, res, next) {
  Article.deleteMany(
    {
      _id: {
        $in: req.body
      }
    },
    function(err, result) {
      if (!err) {
        res.json({ message: "Delete data success!.", success: true });
      } else {
        res.json({ message: "Had error in process.", success: false });
      }
    }
  );
};

exports.detailArticle = function(req, res, next) {
  Article.findOne({ _id: req.query.id }, function(err, article) {
    if (err) throw err;
    if (!article) {
      res.json({ message: "Data not found in server!." });
    } else if (article) {
      res.json(article);
    }
  });
};

exports.updateArticle = function(req, res, next) {
	  var isBase64 = require('is-base64');
	  let base64 = false;
   	if(req.body.images != '') {
		base64 = isBase64(req.body.images, { mimeRequired: true });
		if(base64) {
			var crypto                          = require('crypto');
			var uniqueSHA1String                = crypto.createHash('sha1').update(crypto.randomBytes(20)).digest('hex');
			var imageBuffer                     = decodeBase64Image(req.body.images)
			var imageTypeDetected               = imageBuffer.type.match(/\/(.*?)$/);
			var random = 'image-' + uniqueSHA1String + '.' + imageTypeDetected[1];
			var userUploadedImagePath           = 'public/images/' + random;
			var imgSave                         = 'images/' + random;
			try{
				require('fs').writeFile(userUploadedImagePath, imageBuffer.data, function() {
					console.log('Success');
				});
			} catch(error) {
				res.json({ message: "Upload images error!", success: false });
			}
			req.body.images = imgSave;
		}
  	} 
	Article.findOneAndUpdate(
		{ _id: req.params.id },
		req.body,
		{ new: true },
		(err, doc) => {
			if (!err) {
				res.json({ message: "Data save success!.", success: true });
			} else {
				res.json({ message: "Had error in process.", success: false });
			}
		}
	);
};
