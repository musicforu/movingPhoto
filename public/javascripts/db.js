/**
 * Created  on 2015/6/2.
 */
//设置mongodb数据库参数
var mongodb=require('mongodb');
var server=new mongodb.Server('127.0.0.1',27017,{});
module.exports=new mongodb.Db('movingPhoto',server,{w:1});

