var schema = new Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    title: {
        type: String,
        required: true
    },
    like: [{
        likedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        timestamps: {
            type: Date,
            default: Date.now
        }
    }],
    comment: [{
        comentBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        timestamp: {
            type: Date,
            default: Date.now
        },
        comment: String
    }],
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    }
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Article', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {
    getArticleList: function (reqbody, callback) {
        var category = reqbody.category;
        var searchText = reqbody.searchText;
        var skip = reqbody.skip;
        var queryString = {};
        var resObject = {
            message: "",
            statusCode: -1,
            result: {}
        };

        if (category == "All" & searchText == null) {
            queryString = {}
        } else if (category == "All" & searchText != null) {
            queryString = {
                $or: [{
                    title: searchText
                }, {
                    name: searchText
                }]
            }
        } else if (category != "All" & searchText == null) {
            queryString = {
                category: category,
                $or: [{
                    title: searchText
                }, {
                    name: searchText
                }]
            }
        } else if (category != "All" & searchText != null) {
            queryString = {
                category: category,
                $or: [{
                    title: searchText
                }, {
                    name: searchText
                }]
            }
        }

        Article.find(queryString).skip(skip).limit(10).exec(function (err, result) {
            if (err) {
                resObject.message = err;
                callback(err,resObject);
            } else if (result.length > 0) {
                resObject.message = "Success";
                resObject.statusCode = 1;
                resObject.result = result;
                callback(err,resObject);
            } else {
                resObject.message = "NO record found";
                resObject.statusCode = 1;
                resObject.result = result;
                callback(err,resObject);
            }
        });

    },

    getHighestComments: function(reqbody, callback){
        var totalComments = 0;
        var highest = 0;
        var resObject = {
            message: "",
            statusCode: -1,
            result: {}
        };

        Article.count().exec(function(err, result){
            if(err){
                resObject.message = err;
                callback(err, resObject);
             }else if(result != null || result != undefined){
                 totalComments = result;
             }

             _.forEach(Article, function(value){
                 if(value.text.length > totalComments)
                 {                     
                    totalComments = value.text.length;
                    article_id = value._id;
                 }
             })
            

        });
    },

    getHighestLikes: function(reqbody, callback){

    }
};

module.exports = _.assign(module.exports, exports, model);