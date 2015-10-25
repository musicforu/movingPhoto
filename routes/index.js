var express = require('express');
var router = express.Router();
var fs=require('fs');
var multiparty=require('multiparty');

var User=require('./users.js');
var mongodb=require('../public/javascripts/db.js');
var crypto=require('crypto');
var session=require('express-session');
var flash=require('connect-flash');

/* 主页为注册页 */
router.get('/',function(req,res,next){
    res.render('index',{
        title:'Regesister'
        //success:req.flash('success').toString(),
        //error:req.flash('error').toString
    })
});
//注册账号密码
router.post('/',function(req,res,next){
    var name=req.body.name;
    var password=req.body.password;
    var password_re=req.body['password-repeat'];
    if(password!=password_re){
        //req.flash('error','密码不一致');
        return res.redirect('/');
    }
    //密码加密
    var md5=crypto.createHash('md5');
     password=md5.update(req.body.password).digest('hex');
    var newUser=new User({
        name:req.body.name,
        password:password
    });
    User.get(req.body.name,function(err,user){
        //console.log(user);
        if(user){
           // req.flash('error','用户已经存在');
            return res.redirect('/');
        }
        newUser.save(function(err,user){
            if(err){
                //req.flash('error',err);
                return res.redirect('/')
            }
            req.session.user=user;//newUser
            //console.log(user);
            //req.flash('success','注册成功！');
            res.redirect('/upload');
        })
    })
});
//登录页
router.get('/login',function(req,res){
    res.render('login',{
        user:req.session.user,
        title:'login'
        //success:req.flash('success').toString(),
        //error:req.flash('error').toString
    })
})
//登录账号密码
router.post('/login',function(req,res){
    var md5=crypto.createHash('md5');
    var password=md5.update(req.body.password).digest('hex');
    User.get(req.body.name,function(err,user){
        if(!user){
            //req.flash('error','Not found the user');
            return res.redirect('/');
        }
        if(password!=user.password){
            //req.flash('error','Password not right');
            return res.redirect('/login')
        }
        req.session.user=user;
        //req.flash('success','Right');
        res.redirect('/upload');
    })
});
//登出
router.get('/logout',function(req,res){
    req.session.user=null;
    //req.flash('success','deng chu cheng gong');
    res.redirect('/');
});
//跳转至上传照片页面前判断用户是否已经登录
router.get('/upload',checkLogin);
router.get('/upload', function(req, res, next) {
  //渲染模板
  res.render('upload', {
      title: 'Photo Test',
      user:req.session.user
      //success:req.flash('success').toString(),
      //error:req.flash('error').toString()
  });
});
//上传照片
router.post('/upload',function(req,res){
  //设置上传路径
  var form=new multiparty.Form({uploadDir:'./public/images/'});
  //解析上传文件
  form.parse(req,function(err,fields,files){
      var filesTmp=JSON.stringify(files,null,2);
      var fieldsTmp=JSON.stringify(fields);
      var name=Object.keys(fields).forEach(function(name){
          return name;
      })
      if(err){
          console.log('Parse Error: '+err);
      }else{
          console.log('Parse File '+filesTmp);
          console.log('Parse Field '+fieldsTmp);
      }
          var uploadedPath=files.photo[0].path;//上传文件路径
          var type=files.photo[0].headers['content-type'].slice(6);//上传文件类型
          var dstPath='./public/images/'+fields.name[0]+'.'+type;//目标路径
          fs.rename(uploadedPath,dstPath,function(err){
              if(err){
                  console.log('Error: '+err);
              }else{
                  console.log('Rename OK');
              }
          })
    });
  req.flash('success','Success');
  res.redirect('/test');
});
//检查登录状态
router.get('/test',checkLogin);
//中间页
router.get('/test',function(req,res){
    res.render('test',{
        title:'Go',
        user:req.session.user,
        success:req.flash('success').toString(),
        error:req.flash('error').toString
    });
});
//登录前检查登录状态
router.get('/users',checkLogin);
//根据背景音乐强度，照片墙动态旋转变换页面
router.get('/users',function(req,res,next){
  //获取音乐文件目录
    fs.readdir('./public/media',function(err,music){
        console.log(music)
        //获取照片目录
        fs.readdir('./public/images',function(err,photos){
            console.log(photos)
            res.render('photo', {
                title: 'MyPhoto',
                photos: photos,
                music:music,
                user:req.session.user
            })

        })
    })
})
module.exports = router;
//检查登录状态函数
function checkLogin(req,res,next){
    if(!req.session.user){
        //req.flash('error','Not Login In');
        console.log('back');
        return res.redirect('/');
    }
    next();
}

