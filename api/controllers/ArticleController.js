module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {
    getArticleList: function(req, res){   
        Article.getArticleList(req.body, res.callback);
    },

    getHighestComments:function(req, res){
        Article.getHighestComments(req.body, res.callback);
    },

    getHighestLikes:function(req, res){
        Article.getHighestLikes(req.body, res.callback);
    }
};
module.exports = _.assign(module.exports, controller);
