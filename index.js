var express = require('express');
var bodyParser = require('body-parser');
var db = require('./DBConnection.js');

var app = express();
app.use(bodyParser.json());




var testunit = require('./unittests.js');


app.get('/rest/testunitUser', function(req, res) {
    testunit.TestCreateUser();
    res.statusCode=200;
    res.send('ok');
})


app.get('/rest/testunitGroup', function(req, res) {
    testunit.TestCreateGroup();
    res.statusCode=200;
    res.send('ok');
})


//  Implementation GET Users


app.get('/rest/usuario', function(req, res) {
    
    var callback = function(err, users){
        if(err){
            res.statusCode = 400;
            res.send(err.message);
            return;
        }

        users.forEach( function(user){
            
            if(user.group!=null)
            
                user.group = {  name: user.group, href: '/rest/grupo/' + user.group };
        })
        
        res.send(users);
    }


    db.RetrieveUsers(callback);
})


//  Implementation Post Users


app.post('/rest/usuario', function(req, res) {
    
    var user = JSON.parse(JSON.stringify(req.body));

    var callback = function(err, userid){

        if(err){

            res.statusCode = 400;
            res.send(err.message);
            return;
        }

        db.RetrieveUserbyID(userid, function(err, userdata){

            res.statusCode = 201;
            res.send(userdata);

        });
        
    }

    db.InsertUser(user, callback);
})


//  Implementation GET Groups


app.get('/rest/grupo', function(req, res) {

    var callback = function(err, groups){
        if(err){
            
            res.statusCode = 400;
            res.send(err.message);
            return;
        }

        res.send(groups);
    }
    db.RetrieveGroups(callback);
})




//  Implementation Post Groups

app.post('/rest/grupo', function(req, res) {
    
    var grupo = JSON.parse(JSON.stringify(req.body));

    var callback = function(err, data){
        if(err){
            res.statusCode = 400;
            res.send(err.message);
            return;
        }
        res.statusCode = 201;
        res.send(data);
    }

    db.InsertGroup(grupo, callback);
})



//  Implementation GET User by ID


app.get('/rest/usuario/:id', function(req, res){
    
    var callback = function(err, userdata){
        if(err){
            
            res.statusCode = 400;
            res.send(err.message);
            return;
        }

        res.statusCode = 200;
        res.send(userdata);
    }
    db.RetrieveUserbyID(req.params.id, callback);
})


//  Implementation Delete User by ID

app.delete('/rest/usuario/:id', function(req, res){
    var callback = function(err){
        
        if(err){
        
            res.statusCode = 400;
            res.send(err.message);
            return;
        }
        
        res.statusCode = 204;
        res.send();
    }

    db.RemoveUserbyID(req.params.id,callback);
})


//  Implementation Put User by Property

app.put('/rest/usuario/:id/:property', function(req, res) {
    
    var propers=["name", "surname", "age", "phone", "groupid", "photo"];
    
    
    
    if (propers.indexOf(req.params.property)<0){

        res.statusCode=400;
        res.send("property not valid: " + req.params.property);
        
        return;
    }

        var callback = function(err){
            if(err){
                res.statusCode = 400;
                res.send(err.message);
        
                return;

            }
            res.statusCode = 204;
            res.send();
        }
        db.UpdateUser(req.params.id, req.params.property, req.body.value, callback);
    
})


//  Implementation GET property from User


app.get('/rest/usuario/:id/:prop', function(req, res) {
    

    var propers=["name", "surname", "age", "phone", "group", "photo"];
    
    if (propers.indexOf(req.params.prop)<0){
        
        res.statusCode=400;
        res.send("property not valid: " + req.params.prop);
        return;
    }

    var callback = function(err, data){
        if(err){
            res.statusCode = 400;
            res.send(err.message);
            return;
        }
        
        

        if(req.params.prop=="group")
            data = { name: data.group, href: data.self };

        res.statusCode = 200;
        var retjson={};
        retjson[req.params.prop]=data[req.params.prop];
        retjson.self= '/rest/usuario/' + req.params.id + '/' + req.params.prop;
        res.send(retjson);
    }

    db.RetrieveUserbyID(req.params.id,callback);
})


//  Implementation Delete Property from User

app.delete('/rest/usuario/:id/:prop', function(req, res) {
    
    
    var propers=["name", "surname", "age", "phone", "group", "photo"];
    
    if (propers.indexOf(req.params.prop)<0){
        res.statusCode=400;
        res.send("Property not valid: " + req.params.prop);
        return;
    }

    var callback = function(err, data){
        if(err){
            res.statusCode = 400;
            res.send(err.message);
            return;
        }
        res.statusCode = 204;
        res.send();
    }

    db.UpdateUser(req.params.id, req.params.prop,null, callback);
})

var server = app.listen(3001, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})
