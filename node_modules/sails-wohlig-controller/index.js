/**
 * CountryController
 *
 * @description :: Server-side logic for managing countries
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var mongoose = require("mongoose");
module.exports = {

    save: function (req, res) {
        req.model.saveData(req.body, res.callback);
    },
    delete: function (req, res) {
        if (req.body) {
            if (mongoose.Types.ObjectId.isValid(req.body._id)) {
                req.model.deleteData(req.body, res.callback);
            } else {
                res.json({
                    value: false,
                    data: "ObjectId Invalid"
                });
            }
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }

    },
    getOne: function (req, res) {
        if (req.body) {
            if (mongoose.Types.ObjectId.isValid(req.body._id)) {
                req.model.getOne(req.body, res.callback);
            } else {
                res.json({
                    value: false,
                    data: "ObjectId Invalid"
                });
            }
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },
    search: function (req, res) {
        req.model.search(req.body, res.callback);
    },
    generateExcel: function (req, res) {
        User.generateExcel(req.modelName, res);
    },
    import: function (req, res) {
        if (req.body.file) {
            Config.importGS(req.body.file, function (err, data) {
                if (err) {
                    callback(err, callback);
                } else {
                    req.model.import(data, res.callback);
                }
            });
        } else {
            res.callback("Incorrect Data Format");
        }
    }
};