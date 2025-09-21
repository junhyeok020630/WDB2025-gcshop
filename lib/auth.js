// 202136049 최준혁
const board = require('./board');
var db = require('./db');
var sanitizeHtml = require('sanitize-html');

function authIsOwner(req,res){
    var name = 'Guest';
    var login = false;
    var cls = 'NON';
    if(req.session.is_logined){
        name = req.session.name;
        login = true;
        cls = req.session.cls ;
    }
    return {name,login,cls}
}

module.exports = {
    login : (req,res)=>{
            var {name, login, cls} = authIsOwner(req,res);
            var sql = 'select * from boardtype;'
            var sql2 = 'select * from code;';
            db.query(sql + sql2, (error, results)=>{
                var context = {
                        /*********** mainFrame.ejs에 필요한 변수 ***********/
                        who : name,
                        login : login,
                        body : 'login.ejs',
                        cls : cls,
                        boardtypes : results[0],
                        categories : results[1],
                    };
                    req.app.render('mainFrame',context, (err, html)=>{
                        res.end(html); })
            });
        },
    login_process : (req,res)=>{
        var post = req.body;
        var sntzedLoginid = sanitizeHtml(post.loginid);
        var sntzedPassword = sanitizeHtml(post.password);

        db.query('select count(*) as num from person where loginid = ? and password = ?',
        [sntzedLoginid, sntzedPassword], (error, results)=>{
            if(results[0].num === 1){
                db.query('select name, class, loginid from person where loginid = ? and password = ?',
                [sntzedLoginid, sntzedPassword], (error, result)=>{
                    req.session.is_logined = true;
                    req.session.loginid = result[0].loginid;
                    req.session.name = result[0].name;
                    req.session.cls = result[0].class;
                    res.redirect('/');  
                })
            }
            else{
                req.session.is_logined = false;
                req.session.name = 'Guest';
                req.session.cls = 'NON';
                res.redirect('/auth/login');
            }
        })
    },
    logout_process : (req,res)=>{
        req.session.destroy((err)=>{
            res.redirect('/');
        })
    },
    register : (req,res)=>{
        var {name, login, cls} = authIsOwner(req,res);
        if (login){
            res.redirect('/');
            return;
        }
        var url = 'create';
        var sql = 'select * from boardtype;'
        var sql2 = 'select * from code;';
        db.query(sql + sql2, (error, results)=>{
            var context = {
                /*********** mainFrame.ejs에 필요한 변수 ***********/
                who : name,
                login : login,
                body : 'personCU.ejs',
                url : url,
                boardtypes : results[0],
                categories : results[1],
                cls : cls,
            };
            req.app.render('mainFrame',context, (err, html)=>{
                res.end(html); })
        });
    },
    register_process : (req,res)=>{
        var post = req.body;
        var sntzedLoginid = sanitizeHtml(post.loginid);
        var sntzedPassword = sanitizeHtml(post.password);
        var sntzedName = sanitizeHtml(post.name);
        var sntzedMF = sanitizeHtml(post.mf);
        var sntzedAddress = sanitizeHtml(post.address);
        var sntzedTel = sanitizeHtml(post.tel);
        var sntzedBirth = sanitizeHtml(post.birth);
        var sntzedClass = sanitizeHtml(post.class);

        db.query('insert into person values(?,?,?,?,?,?,?,?)',
        [sntzedLoginid, sntzedPassword, sntzedName, sntzedMF, sntzedAddress, sntzedTel, sntzedBirth, sntzedClass], (error, result)=>{
            if(error){
                console.log(error);
                res.redirect('/auth/register');
            }
            res.redirect('/auth/login');
        })
    }
}