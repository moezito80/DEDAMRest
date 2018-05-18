 var Connection = require('tedious').Connection;  
    var config = {  
        userName: 'sa',  
        password: 'k0Fax',  
        server: '172.16.250.14',  
        
        options: {encrypt: true, database: 'DEDAMDB'}  
    }; 
    
    
    TYPES = require('tedious').TYPES;
    
    var Request = require('tedious').Request;  
    
    
    var connection = new Connection(config);  
    connection.on('connect', function(err) {  
        console.log("Connected");  
         
    });  

exports.RetrieveUsers = function(callback){

        var result=new Array();
        request = new Request("SELECT * FROM users", function(err, rowCount) {  
          if (err) {
            console.log(err);
            callback(err, null);
          } else {
            console.log(rowCount + ' rows');
            callback(null, result);
          }
      
          
        });
      
        request.on('row', function(columns) {
          var user={};
          columns.forEach(function(column) {
            if (column.value === null) {
              console.log('NULL');
            } else {
              user[column.metadata.colName]=column.value;
              console.log(column.value);
              
            }
          });
          result.push(user);
        });
        
        connection.execSql(request);  

}


exports.RetrieveGroups = function(callback){

  var result=new Array();
  request = new Request("SELECT * FROM groups", function(err, rowCount) {  
    if (err) {
      console.log(err);
      callback(err, null);
    } else {
      console.log(rowCount + ' rows');
      callback(null, result);
    }

    
  });

  request.on('row', function(columns) {
    var user={};
    columns.forEach(function(column) {
      if (column.value === null) {
        console.log('NULL');
      } else {
        user[column.metadata.colName]=column.value;
        console.log(column.value);
        
      }
    });
    result.push(user);
  });
  
  connection.execSql(request);  

}

exports.RetrieveUserbyID = function(id, callback){

  var user={};
  console.log("id : "+ id);
  request = new Request("SELECT * FROM users WHERE id = " + id, function(err, rowCount) {  
    if (err) {
      console.log(err);
      callback(err, null);
    } else {
      console.log(rowCount + ' rows');
      callback(null, user);
    }

   
  });

  request.on('row', function(columns) {
    columns.forEach(function(column) {
      
        
        user[column.metadata.colName]=column.value;
        console.log(column.value);
        
      
    });
   
  });
  
  connection.execSql(request);  

}

exports.InsertUser = function(user,callback){

  
  var id;
  request = new Request("INSERT INTO users (alias, name, surname, age, phone) VALUES (@alias, @name, @surname, @age, @phone); select @@identity", function(err) {  
    if (err) {
      console.log(err);
      callback(err, null);
    } else {
      
      console.log("id dentro del insertuser "+ id);
      callback(null, id);
      
      
    } 
   });  
   request.addParameter('alias', TYPES.NChar,user.alias);  
   request.addParameter('name', TYPES.NChar,user.name); 
   request.addParameter('surname', TYPES.NChar,user.surname); 
   request.addParameter('age', TYPES.Int,user.age); 
   request.addParameter('phone', TYPES.NChar,user.phone); 

  
   request.on('row', function(columns) {  
       columns.forEach(function(column) {  
         if (column.value === null) {  
           console.log('NULL');  
         } else {  
           console.log("id of inserted user is " + column.value);
           id=column.value;  
         }  
       });  
   });       
   connection.execSql(request);  

}


exports.InsertGroup = function(group,callback){

  
  var name;
  request = new Request("INSERT INTO groups (name, self) VALUES (@name, @self)", function(err) {  
    if (err) {
      console.log(err);
      callback(err, null);
    } else {
      
      console.log("name del grupo "+ name);
      callback(null, name);
      
      
    } 
   });  
   request.addParameter('name', TYPES.NChar,group.name);  
   request.addParameter('self', TYPES.NChar,group.self); 
   

  
   request.on('row', function(columns) {  
       columns.forEach(function(column) {  
         if (column.value === null) {  
           console.log('NULL');  
         } else {  
           console.log("name of inserted group" + column.value);
           name=column.value;  
         }  
       });  
   });       
   connection.execSql(request);  

}





exports.RemoveUserbyID = function(id, callback){

  console.log("id : "+ id);
  request = new Request("DELETE FROM users WHERE id = " + id, function(err) {  
    if (err) {
      console.log(err);
      
    } 
    
      callback(err);
      
  });
 

  connection.execSql(request);  

}

exports.UpdateUser= function(id,prop,value,callback){

  var query="";
  if (prop==="age") 
  
  {
    query="UPDATE users Set "+ prop + "="+ value +" Where id="+id;

  }else 
  
  {

    if (value==null)

    {
      query="UPDATE users Set "+ prop + "="+ value +" Where id="+id;

    }
    else
    {
      query="UPDATE users Set "+ prop + "='"+ value +"' Where id="+id;

    }
    


  }

 
  
  request = new Request(query, function(err) {  
    if (err) {
      console.log(err);
      callback(err);
    } else {
      
      callback(null);
      
      
    } 
   });  
     
   connection.execSql(request);  

}







