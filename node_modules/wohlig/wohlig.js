#!/usr/bin/env node

var _ = require('lodash');
var program = require('commander');
var download = require('url-download');
var fs = require("fs");
var extract = require('extract-zip');
var del = require('delete');
var mv = require('mv');

// async



program
    .version('0.0.12')
    .option('-a, --angular [foldername]', 'Angular Frontend Framework')
    .option('-g, --generate [foldername]', 'Generate Frontend Framework')
    .parse(process.argv);

var i = 0;

function complete() {
    i++;
    if (i == 2) {
        console.log('Angular Frontend Framework is successfully installed');
    }
}

if (program.generate) {

    if (program.generate === true) {
        console.log("Please provide a name for the Controller and Service");
    } else {
        console.log("Copying the Content");
        var apiName = _.upperFirst(program.generate);

        var controller = fs.readFileSync(__dirname + "/lib/Controller.js");
        fs.exists('api/controllers', function(isExist) {
            if (isExist) {
                controller = _.replace(controller, new RegExp('NewController', "g"), apiName);
                var write = fs.writeFileSync("api/controllers/" + apiName + "Controller.js", controller);
                console.log("Controller " + apiName + " Generated");
            } else {
                console.log("Controller Folder not found");

            }

        });

        var service = fs.readFileSync(__dirname + "/lib/Service.js");
        fs.exists('./api/services', function(isExist) {
            if (isExist) {
                service = _.replace(service, new RegExp('NewService', "g"), apiName);
                var write = fs.writeFileSync("api/services/" + apiName + ".js", service);
                console.log("Service " + apiName + " Generated");
            } else {
                console.log("Service Folder not found");
            }

        });


    }
}

if (program.angular) {
    if (program.angular === true) {
        console.log("Please provide a Folder Name");
    } else {
        console.log('Downloading Angular Framework Frontend');
        download('https://github.com/WohligTechnology/AngularFrameworkFrontend/archive/master.zip', './')
            .on('close', function(err) {
                if (err) {
                    console.log("Error Downloading Angular Framework Frontend");
                    console.log(err);
                } else {
                    console.log("Downloading Completed");
                    extract("master.zip", {
                        dir: "./"
                    }, function(err) {
                        if (err) {
                            console.log("Error while Extracting");
                            console.log(err);
                        } else {
                            console.log("Completed Extraction");
                            mv('AngularFrameworkFrontend-master', program.angular, function(err) {
                                if (err) {
                                    console.log("Error Renaming the folder");
                                    console.log(err);
                                } else {
                                    complete();
                                }

                            });
                            del(['master.zip'], function(err) {
                                if (err) {
                                    console.log("Error Deleting the Zip");
                                    console.log(err);
                                } else {
                                    complete();
                                }
                            });
                        }
                    });
                }
            });
    }
}
