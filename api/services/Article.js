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
        commentedBy: {
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

    //To get highest comments 
    getHighestComments: function(reqbody, callback){
        var response = {}
        response.highestComments = 0;
        var resObject = {
            message: "",
            statusCode: -1,
            result: []
        };

        Article.find().exec(function(error, record){
            if(error){
                resObject.message = error;
                callback(error,resObject);
            }else if(record.length>0){
                var arrayLength = record.length;
                var counter = 0;

                _.forEach(record, function(value){
                    if(value.comment.length >= response.highestComments)
                    {         
                        if(value.comment.length > response.highestComments){
                            response.highestComments = value.comment.length;
                            response.article = value;
                            resObject.result.push(response);
                        }else if(value.comment.length == response.highestComments){
                            response.highestComments = value.comment.length;
                            response.article = value;
                            resObject.result.push(response);
                        }            
                        
                    }
                    counter++;

                    if(counter == arrayLength){
                        resObject.message = "Success";
                        resObject.statusCode = 200;
                        callback(error,resObject);
                    }
                })

            }
        });  
    },

    getHighestLikes: function(reqbody, callback){
        var response = {}
        response.highestLikes = 0;
        var resObject = {
            message: "",
            statusCode: -1,
            result: []
        };

        Article.aggregate({
            $group:{
                _id:"$author",
                totalLikes:{
                    $push:{
                        $size:"$like"
                    }
                }
            }
        }).exec(function(error, record){
             if(error){
                resObject.message = error;
                callback(error,resObject);
            }else if(record.length>0){
                var arrayLength = record.length;
                var authorArray= [];
                var authorObj = {};
                var authorWithMaxLike = [];
                var counter = 0;

                _.forEach(record,function(value){

                        authorObj.authorId = value._id;
                        authorObj.TotalLikes = _.sum(value.totalLikes);
                        authorArray.push(authorObj);
                        counter++;

                        if(arrayLength == counter){
                            
                            authorWithMaxLike.push(_.maxBy(authorArray, 'TotalLikes'));
                            var onlyId = [];
                            console.log(authorArray);
                            console.log(authorWithMaxLike);
                            _.forEach(authorWithMaxLike,function(n){
                                onlyId.push(n.authorId);
                            });
                            console.log(onlyId);
                        
                           User.find({ _id: onlyId}).exec(function(err,finalRecord){
                                console.log(finalRecord);
                                if(err){
                                    resObject.message = err;
                                    callback(error,resObject);
                                }else if(finalRecord.length>0){

                                    
                                    resObject.message = "Success";
                                    resObject.statusCode = 200;
                                    resObject.result = finalRecord;
                                    callback(error,resObject);
                                }
                            });  
                        }

                })
                
            }     
        });            
    }
} 


module.exports = _.assign(module.exports, exports, model);