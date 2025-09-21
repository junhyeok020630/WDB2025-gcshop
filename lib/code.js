// 202136049 최준혁
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
        db.query(sql + 'select * from code;', (error, results)=>{
            if(error){
                console.log(error);
                res.redirect('/code/view');
            }
            var context = {
                /*********** mainFrame.ejs에 필요한 변수 ***********/
                who : name,
                login : login,
                body : 'code.ejs',
                cls : cls,
                boardtypes: results[0],
                code: results[1],
                categories: results[1],
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
                body : 'codeCU.ejs',
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
        var sntzedMainId = post.main_id;
        var sntzedSubId = post.sub_id;
        var sntzedMainName = post.main_name;
        var sntzedSubName = post.sub_name;
        var sntzedStart = post.start;
        var sntzedEnd = post.end;

        db.query('insert into code values(?,?,?,?,?,?)',
            [sntzedMainId, sntzedSubId, sntzedMainName, sntzedSubName, sntzedStart, sntzedEnd], (error, result)=>{
                if(error){
                    console.log(error);
                    res.redirect('/code/create');
                }
                res.redirect('/code/view');
        });
    },
    update : (req,res)=>{
        var {name, login, cls} = authIsOwner(req,res);
        var url = 'update';
        if (cls !== 'MNG') {
            res.redirect('/auth/login');
        }
        var sql = 'select * from code where main_id = ? and sub_id = ? and start = ? and end = ?;';
        var sql2 = 'select * from boardtype;';
        var sql3 = 'select * from code;';
        db.query(sql + sql2 + sql3, [req.params.main, req.params.sub, req.params.start, req.params.end], (error, results)=>{
            if(error){
                console.log(error);
                res.redirect('/code/view');
            }
            var context = {
                /*********** mainFrame.ejs에 필요한 변수 ***********/
                who : name,
                login : login,
                body : 'codeCU.ejs',
                cls : cls,
                code: results[0],
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
        var sntzedMainId = post.main_id;
        var sntzedSubId = post.sub_id;
        var sntzedMainName = post.main_name;
        var sntzedSubName = post.sub_name;
        var sntzedStart = post.start;
        var sntzedEnd = post.end;

        db.query('update code set main_name=?, sub_name=?, start=?, end=? where main_id=? and sub_id=?',
            [sntzedMainName, sntzedSubName, sntzedStart, sntzedEnd, sntzedMainId, sntzedSubId], (error, result)=>{
                if(error){
                    console.log(error);
                    res.redirect('/code/update');
                }
                res.redirect('/code/view');
        });
    },
    delete : (req,res)=>{
        var {name, login, cls} = authIsOwner(req,res);
        if (cls !== 'MNG') {
            res.redirect('/auth/login');
        }
        var sql = 'delete from code where main_id = ? and sub_id = ? and start = ? and end = ?';
        db.query(sql, [req.params.main, req.params.sub, req.params.start, req.params.end], (error, results)=>{
            if(error){
                console.log(error);
                res.redirect('/code/view');
            }
            res.redirect('/code/view');
        });
    }
}