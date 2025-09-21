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
    typeview : (req,res)=>{
        var {name, login, cls} = authIsOwner(req,res);
        if (cls !== 'MNG') {
            res.redirect('/auth/login');
        }
        var sql1 = 'select * from boardtype;';
        var sql2 = 'select * from code;';
        db.query(sql1 + sql2, (error, results)=>{
            if(error){
                console.log(error);
                res.redirect('/board/type/view');
            }
            var context = {
                /*********** mainFrame.ejs에 필요한 변수 ***********/
                who : name,
                login : login,
                body : 'boardtype.ejs',
                cls : cls,
                boardtypes: results[0],
                boardtype: results[0],
                categories: results[1],
            };
            req.app.render('mainFrame',context, (err, html)=>{
                res.end(html); })
        });
    },
    typecreate : (req,res)=>{
        var {name, login, cls} = authIsOwner(req,res);
        var url = 'create';
        if (cls !== 'MNG') {
            res.redirect('/auth/login');
        }
        var sql = 'select * from boardtype;';
        var sql2 = 'select * from code;';
        db.query(sql + sql2, (error, results)=>{
            var context = {
                /*********** mainFrame.ejs에 필요한 변수 ***********/
                who : name,
                login : login,
                body : 'boardtypeCU.ejs',
                cls : cls,
                boardtypes: results[0],
                categories: results[1],
                url : url,
            };  
        req.app.render('mainFrame',context, (err, html)=>{
            res.end(html); })
        });
    },
    typecreate_process : (req,res)=>{
        var {name, login, cls} = authIsOwner(req,res);
        if (cls !== 'MNG') {
            res.redirect('/auth/login');
        }
        var post = req.body;
        // title, description, numPerPage, write_YN, re_YN
        var sntzedTitle = sanitizeHtml(post.title);
        var sntzedDescription = sanitizeHtml(post.description);
        var sntzedNumPerPage = sanitizeHtml(post.numPerPage);
        var sntzedWrite_YN = sanitizeHtml(post.write_YN);
        var sntzedRe_YN = sanitizeHtml(post.re_YN);

        db.query('insert into boardtype(title,description,numPerPage,write_YN,re_YN) values(?,?,?,?,?)',
            [sntzedTitle,sntzedDescription,sntzedNumPerPage,sntzedWrite_YN,sntzedRe_YN], (error, result)=>{
                if(error){
                    console.log(error);
                    res.redirect('/board/type/create');
                }
                res.redirect('/board/type/view');
        });
    },
    typeupdate : (req,res)=>{
        var {name, login, cls} = authIsOwner(req,res);
        var url = 'update';
        if (cls !== 'MNG') {
            res.redirect('/auth/login');
        }
        var sql = 'select * from boardtype where type_id = ?;';
        var sql2 = 'select * from boardtype;';
        var sql3 = 'select * from code;';
        db.query(sql + sql2 + sql3, [req.params.typeId], (error, results)=>{
            if(error){
                console.log(error);
                res.redirect('/board/type/view');
            }
            var context = {
                /*********** mainFrame.ejs에 필요한 변수 ***********/
                who : name,
                login : login,
                body : 'boardtypeCU.ejs',
                cls : cls,
                boardtype: results[0],
                boardtypes: results[1],
                categories: results[2],
                url : url,
            };
            req.app.render('mainFrame',context, (err, html)=>{
                res.end(html); })
        });
    },
    typeupdate_process : (req,res)=>{
        var {name, login, cls} = authIsOwner(req,res);
        if (cls !== 'MNG') {
            res.redirect('/auth/login');
        }
        var post = req.body;
        // title, description, numPerPage, write_YN, re_YN
        var sntzedTypeId = post.type_id;
        var sntzedTitle = sanitizeHtml(post.title);
        var sntzedDescription = sanitizeHtml(post.description);
        var sntzedNumPerPage = sanitizeHtml(post.numPerPage);
        var sntzedWrite_YN = sanitizeHtml(post.write_YN);
        var sntzedRe_YN = sanitizeHtml(post.re_YN);

        db.query('update boardtype set title=?, description=?,numPerPage=?,write_YN=?,re_YN=? where type_id=?',
            [sntzedTitle, sntzedDescription, sntzedNumPerPage, sntzedWrite_YN, sntzedRe_YN, sntzedTypeId], (error, result)=>{
                if(error){
                    console.log(error);
                    res.redirect('/board/type/update');
                }
                res.redirect('/board/type/view');
        });
    },
    typedelete_process : (req,res)=>{
        var {name, login, cls} = authIsOwner(req,res);
        if (cls !== 'MNG') {
            res.redirect('/auth/login');
        }
        var sql = 'delete from boardtype where type_id = ?';
        db.query(sql, [req.params.typeId], (error, results)=>{
            if(error){
                console.log(error);
                res.redirect('/board/type/view');
            }
            res.redirect('/board/type/view');
        });
    },
    view : (req,res)=>{
        var {name, login, cls} = authIsOwner(req,res);
        var sntzedTypeId = sanitizeHtml(req.params.typeId);
        var pNum = req.params.pNum;
        var sql1 = `select * from boardtype;` // results[0]
        var sql2 = ` select * from boardtype where type_id = ${sntzedTypeId};` // results[1]
        var sql3 = ` select count(*) as total from board where type_id = ${sntzedTypeId};` // results[2]
        var sql4 = `select * from code;` // results[3]
        db.query(sql1 + sql2 + sql3 + sql4, (error,results)=>{
        /******페이지 기능 구현 *********/
            var numPerPage = results[1][0].numPerPage;
            var offs = (pNum-1)*numPerPage;
            var totalPages = Math.ceil(results[2][0].total / numPerPage);
            db.query(`select b.board_id as board_id, b.title as title, b.date as date, p.name as name
                    from board b inner join person p on b.loginid = p.loginid
                    where b.type_id = ? ORDER BY p_id desc, board_id asc LIMIT ? OFFSET ?`,
                [sntzedTypeId, numPerPage, offs], (err,boards)=>{
                    if(err){
                        console.log(err);
                        res.redirect('/');
                    }
                    var context = {
                        /*********** mainFrame.ejs에 필요한 변수 ***********/
                        who : name,
                        login : login,
                        body : 'board.ejs',
                        cls : cls,
                        boardtype : results[1],
                        boardtypes: results[0],
                        categories: results[3],
                        board: boards,
                        pNum: pNum,
                        totalPages: totalPages,
                    };
                    req.app.render('mainFrame',context, (err, html)=>{
                        res.end(html); })
                });
        });
    },
    create : (req,res)=>{
        var {name, login, cls} = authIsOwner(req,res);
        var url = 'create';
        if (cls !== 'MNG' && cls !== 'CST') {
            res.redirect('/auth/login');
        }
        var pNum = 1;
        var loginid = req.session.loginid;
        var sql = 'select * from boardtype;'
        var sql2 = 'select * from boardtype where type_id = ?;'
        var sql3 = 'select * from code;';
        db.query(sql + sql2 + sql3, [req.params.typeId], (error, results)=>{
            var context = {
                /*********** mainFrame.ejs에 필요한 변수 ***********/
                who : name,
                login : login,
                body : 'boardCRU.ejs',
                cls : cls,
                boardtypes: results[0],
                boardtype: results[1],
                categories: results[2],
                loginid: loginid,
                url : url,
                pNum: pNum,
            };  
        req.app.render('mainFrame',context, (err, html)=>{
            res.end(html); })
        });
    },
    create_process : (req,res)=>{
        var {name, login, cls} = authIsOwner(req,res);
        if (cls !== 'MNG' && cls !== 'CST') {
            res.redirect('/auth/login');
        }
        var post = req.body;
        // p_id, type_id, loginid, password, title, date, content
        var sntzedPId = post.p_id; // 답글을 위한 p_id
        var sntzedTypeId = post.type_id;
        var sntzedLoginid = post.loginid;
        var sntzedPassword = sanitizeHtml(post.password);
        var sntzedTitle = sanitizeHtml(post.title); 
        var now = new Date();
        var sntzedDate = now.getFullYear() + '.' 
            + ((now.getMonth() + 1) < 10 ? '0' : '') + (now.getMonth() + 1) + '.'
            + (now.getDate() < 10 ? '0' : '') + now.getDate() + ' : '
            + now.getHours() + '시 ' + now.getMinutes() + '분 ' + now.getSeconds() + '초';
        var sntzedContent = sanitizeHtml(post.content);


        db.query('insert into board(type_id,p_id,loginid,password,title,date,content) values (?,?,?,?,?,?,?)',
            [sntzedTypeId,sntzedPId,sntzedLoginid,sntzedPassword,sntzedTitle,sntzedDate, sntzedContent], (error, result)=>{
                if(error){
                    console.log(error);
                    res.redirect('/board/view' + sntzedTypeId + '/1');
                }
                res.redirect('/board/view/' + sntzedTypeId + '/1');
        });
    },
    detail : (req,res)=>{
        var {name, login, cls} = authIsOwner(req,res);
        var url = 'read';
        var loginid = req.session.loginid;
        var sql = 'select * from boardtype;'
        var sql2 = 'select * from board inner join person on person.loginid = board.loginid where board_id = ?;'
        var sql3 = 'select * from code;';
        var pNum = parseInt(req.params.pNum);
        var reYN = req.params.reYN;
        db.query(sql + sql2 + sql3, [req.params.boardId], (error, results)=>{
            console.log(results[1]);
            var context = {
                /*********** mainFrame.ejs에 필요한 변수 ***********/
                who : name,
                login : login,
                body : 'boardCRU.ejs',
                cls : cls,
                boardtypes: results[0],
                board: results[1],
                categories: results[2],
                loginid: loginid,
                url : url,
                pNum: pNum,
                reYN: reYN,
            };  
        req.app.render('mainFrame',context, (err, html)=>{
            res.end(html); })
        });
    },
    update : (req,res)=>{
        var {name, login, cls} = authIsOwner(req,res);
        var url = 'update';
        var pNum = req.params.pNum;
        var loginid = req.session.loginid;
        if (cls !== 'MNG' && cls !== 'CST') {
            res.redirect('/auth/login');
        }
        var sql = 'select * from board b inner join person p on p.loginid = b.loginid where b.board_id = ?;';
        var sql1 = 'select * from boardtype where type_id = ?;';
        var sql2 = 'select * from boardtype;';
        var sql3 = 'select * from board where board_id = ?;';
        var sql4 = 'select * from code;';
        db.query(sql + sql1 + sql2 + sql3 + sql4, [req.params.boardId, req.params.typeId, req.params.boardId], (error, results)=>{
            if(error){
                console.log(error);
                res.redirect('/board/type/view');
            }
            var context = {
                /*********** mainFrame.ejs에 필요한 변수 ***********/
                who : name,
                login : login,
                body : 'boardCRU.ejs',
                cls : cls,
                boardperson: results[0],
                boardtype: results[1],
                boardtypes: results[2],
                board: results[3],
                categories: results[4],
                url : url,
                pNum : pNum,
                loginid: loginid,
            };
            req.app.render('mainFrame',context, (err, html)=>{
                res.end(html); })
        });
    },
    update_process : (req,res)=>{
        var {name, login, cls} = authIsOwner(req,res);
        if (cls !== 'MNG' && cls !== 'CST') {
            res.redirect('/auth/login');
        }
        var post = req.body;
        // type_id, loginid, board_id, password, title, date, content
        var sntzedTypeId = post.type_id;
        var sntzedBoardId = post.board_id;
        var sntzedPassword = sanitizeHtml(post.password);
        var sntzedTitle = sanitizeHtml(post.title); 
        var sntzedpNum = post.pNum;
        var now = new Date();
        var sntzedDate = now.getFullYear() + '.' 
            + ((now.getMonth() + 1) < 10 ? '0' : '') + (now.getMonth() + 1) + '.'
            + (now.getDate() < 10 ? '0' : '') + now.getDate() + ' : '
            + now.getHours() + '시 ' + now.getMinutes() + '분 ' + now.getSeconds() + '초';
        var sntzedContent = sanitizeHtml(post.content);

        var sql1 = 'select password from board where board_id = ?;';
        var sql2 = 'update board set title=?, date=?, content=? where type_id=? and board_id=?';

        db.query(sql1 + sql2,
            [sntzedBoardId, sntzedTitle, sntzedDate, sntzedContent, sntzedTypeId, sntzedBoardId], (error, result)=>{
            if(result[0][0].password !== null && result[0][0].password !== sntzedPassword){
                res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                return res.end(`<script language=JavaScript type="text/javascript">alert("비밀번호가 일치하지 않습니다.")
                        setTimeout("location.href='http://localhost:3000/board/update/${sntzedBoardId}/${sntzedTypeId}/${sntzedpNum}/'", 1000)
                        </script>`)
                
            }
            if(error){
                console.log(error);
                res.redirect('/board/view' + sntzedTypeId + '/' + sntzedpNum);
            }
            res.redirect('/board/view/' + sntzedTypeId + '/' + sntzedpNum);
        });
    },
    delete_process : (req,res)=>{
        var {name, login, cls} = authIsOwner(req,res);
        if (cls !== 'MNG' && cls !== 'CST') {
            res.redirect('/auth/login');
        }
        var sql = 'delete from board where board_id = ?';
        var typeId = req.params.typeId;
        var pNum = req.params.pNum;
        db.query(sql, [req.params.boardId], (error, results)=>{
            if(error){
                console.log(error);
                res.redirect('/board/view/'+ typeId + '/' + pNum);
            }
            res.redirect('/board/view/' + typeId + '/' + pNum);
        });
    },
    answer : (req,res)=>{
        var {name, login, cls} = authIsOwner(req,res);
        var url = 'answer';
        var pNum = req.params.pNum;
        var loginid = req.session.loginid;
        if (cls !== 'MNG') {
            res.redirect('/auth/login');
        }
        var sql = 'select * from board b inner join person p on p.loginid = b.loginid where b.board_id = ?;';
        var sql2 = 'select * from boardtype;';
        var sql3 = 'select * from board where board_id = ?;';
        var sql4 = 'select * from code;';
        db.query(sql + sql2 + sql3 + sql4, [req.params.boardId, req.params.boardId], (error, results)=>{
            if(error){
                console.log(error);
                res.redirect('/board/view/' + req.params.typeId + '/' + pNum);
            }
            var context = {
                /*********** mainFrame.ejs에 필요한 변수 ***********/
                who : name,
                login : login,
                body : 'boardAnswer.ejs',
                cls : cls,
                boardperson: results[0],
                boardtypes: results[1],
                board: results[2],
                categories: results[3],
                url : url,
                pNum : pNum,
                loginid: loginid,
            };
            req.app.render('mainFrame',context, (err, html)=>{
                res.end(html); })
        });
    },
    answer_process : (req,res)=>{
        var {name, login, cls} = authIsOwner(req,res);
        if (cls !== 'MNG') {
            res.redirect('/auth/login');
        }
        var post = req.body;
        // p_id, type_id, loginid, password, title, date, content
        var sntzedBoardId = post.board_id; // 답글을 위한 board_id
        var sntzedPId = post.p_id; // 답글을 위한 p_id
        var sntzedTypeId = post.type_id;
        var sntzedLoginid = post.loginid;
        var sntzedPassword = sanitizeHtml(post.password);
        var sntzedTitle = sanitizeHtml(post.title); 
        var now = new Date();
        var sntzedDate = now.getFullYear() + '.' 
            + ((now.getMonth() + 1) < 10 ? '0' : '') + (now.getMonth() + 1) + '.'
            + (now.getDate() < 10 ? '0' : '') + now.getDate() + ' : '
            + now.getHours() + '시 ' + now.getMinutes() + '분 ' + now.getSeconds() + '초';
        var sntzedContent = sanitizeHtml(post.content);

        var sql1 = 'insert into board(type_id,p_id,loginid,password,title,date,content) values (?,?,?,?,?,?,?);';
        var sql2 = `update board set p_id = ${sntzedPId} where board_id = ${sntzedBoardId}`

        db.query(sql1 + sql2,
            [sntzedTypeId,sntzedPId,sntzedLoginid,sntzedPassword,sntzedTitle,sntzedDate, sntzedContent], (error, result)=>{
                if(error){
                    console.log(error);
                    res.redirect('/board/view' + sntzedTypeId + '/1');
                }
                res.redirect('/board/view/' + sntzedTypeId + '/1');
        });
    },
}