var express = require('express');
var router = express.Router();
var fs=require('fs');
var mongodb=require('../public/javascripts/db.js');
/* GET users listing. */
//用户构造函数
function User(user){
    this.name=user.name;
    this.password=user.password;
}
//存储用户账号密码
User.prototype.save=function(callback){
    var user={
        name:this.name,
        password:this.password
    }
    mongodb.open(function(err,db){
        if(err) return callback(err);
        db.collection('movingPhoto',function(err,collection){
            if(err) {
                mongodb.close();
                return callback(err);
            }
            collection.insert(user,{
                safe:true
            },function(err,user){
                mongodb.close();
                if(err){
                    return callback(err);
                }

                callback(null,user)//user[0]
            })
        })
    })
};
//获取用户密码
User.get=function(name,callback){
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        db.collection('movingPhoto',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            collection.findOne({
                name:name},function(err,user){
                mongodb.close();
                if(err){
                    return callback(err);
                }
                callback(null,user);
            })
        })
    })
};

module.exports = User;
