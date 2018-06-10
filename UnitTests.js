var express = require('express');
var bodyParser = require('body-parser');
var database = require('./DBConnection.js');

var app = express();
app.use(bodyParser.json());

    exports.TestCreateUser = function(){
    var user = {
        alias: "Dedamtest",
        name: "Dedamtest name",
        surname: "Dedamtest surname"
    }


    database.InsertUser(user, function(err, userdata){
        if(err){
            console.log(err);
            return;
        }

        console.log('Usuario Creado:');
        console.log(JSON.stringify(userdata));

        database.RemoveUserbyID(userdata.id, function(err){
            if(err){
                console.log(err);
                return;
            }

            console.log('Usuario Borrado');
        });
    });
    exports.TestCreateGroup = function(){
        var group = {
            name: "DedamtestGroup",
            self: "DedamtestGroup Self",
        }
    
    
        database.InsertGroup(group,function(err){
            if(err){
                console.log(err);
                return;
            }
    
            console.log('Grupo Creado:');
            
    
        });

}}
