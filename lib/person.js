// 202136049 최준혁
// person 관련 코드로 수정해야함
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
    view : (req,res)=>{
        var {name, login, cls} = authIsOwner(req,res);
        if (cls !== 'MNG') {
            res.redirect('/auth/login');
        }
        var sql = 'select * from boardtype;';
        var sql1 = 'select * from code;';
        db.query(sql + sql1 + 'select * from person', (error, results)=>{
            if(error){
                console.log(error);
                res.redirect('/person/view');
            }
            var context = {
                /*********** mainFrame.ejs에 필요한 변수 ***********/
                who : name,
                login : login,
                body : 'person.ejs',
                cls : cls,
                boardtypes: results[0],
                categories: results[1],
                person: results[2]
            };
            req.app.render('mainFrame',context, (err, html)=>{
                res.end(html); })
        });
    },
    create : (req,res)=>{
        var {name, login, cls} = authIsOwner(req,res);
        var url = 'create';
        if (cls !== 'MNG') {
            res.redirect('/auth/login');
        }
        var sql = 'select * from boardtype;';
        var sql1 = 'select * from code;';
        db.query(sql + sql1, (error, results)=>{
            var context = {
                /*********** mainFrame.ejs에 필요한 변수 ***********/
                who : name,
                login : login,
                body : 'personCU.ejs',
                cls : cls,
                url : url,
                boardtypes: results[0],
                categories: results[1],
            };
            req.app.render('mainFrame',context, (err, html)=>{
                res.end(html); })
        });
    },
    create_process : (req,res)=>{
        var {name, login, cls} = authIsOwner(req,res);
        if (cls !== 'MNG') {
            res.redirect('/auth/login');
        }
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
                    res.redirect('/person/create');
                }
                res.redirect('/person/view');
        });
    },
    update : (req,res)=>{
        var {name, login, cls} = authIsOwner(req,res);
        var url = 'update';
        if (cls !== 'MNG') {
            res.redirect('/auth/login');
        }
        var sql = 'select * from person where loginid = ?;';
        var sql2 = 'select * from boardtype;';
        var sql3 = 'select * from code;';
        db.query(sql + sql2 + sql3, [req.params.loginId], (error, results)=>{
            if(error){
                console.log(error);
                res.redirect('/person/view');
            }
            var context = {
                /*********** mainFrame.ejs에 필요한 변수 ***********/
                who : name,
                login : login,
                body : 'personCU.ejs',
                cls : cls,
                person: results[0],
                boardtypes: results[1],
                categories: results[2],
                url : url,
            };
            req.app.render('mainFrame',context, (err, html)=>{
                res.end(html); })
        });
    },
    update_process : (req,res)=>{
        var {name, login, cls} = authIsOwner(req,res);
        if (cls !== 'MNG') {
            res.redirect('/auth/login');
        }
        var post = req.body;
        var sntzedLoginid = sanitizeHtml(post.loginid);
        var sntzedPassword = sanitizeHtml(post.password);
        var sntzedName = sanitizeHtml(post.name);
        var sntzedMF = sanitizeHtml(post.mf);
        var sntzedAddress = sanitizeHtml(post.address);
        var sntzedTel = sanitizeHtml(post.tel);
        var sntzedBirth = sanitizeHtml(post.birth);
        var sntzedClass = sanitizeHtml(post.class);

        db.query('update person set password=?, name=?, mf=?, address=?, tel=?, birth=?, class=? where loginid=?',
            [sntzedPassword, sntzedName, sntzedMF, sntzedAddress, sntzedTel, sntzedBirth, sntzedClass, sntzedLoginid], (error, result)=>{
                if(error){
                    console.log(error);
                    res.redirect('/person/update');
                }
                res.redirect('/person/view');
        });
    },
    delete : (req,res)=>{
        var {name, login, cls} = authIsOwner(req,res);
        if (cls !== 'MNG') {
            res.redirect('/auth/login');
        }
        var sql = 'delete from person where loginid = ?';
        db.query(sql, [req.params.loginId], (error, results)=>{
            if(error){
                console.log(error);
                res.redirect('/person/view');
            }
            res.redirect('/person/view');
        });
    }
}