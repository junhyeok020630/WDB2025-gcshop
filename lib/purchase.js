// 202136049 최준혁
const db = require('./db');
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
    purchaseDetail : (req,res)=>{
        var {login, name, cls} = authIsOwner(req,res);
        if (cls !== 'CST') {
            res.redirect('/auth/login');
        }
        var sql1 = 'select * from boardtype;'
        var sql2 = `select * from product where prod_id = ${req.params.prodId};`
        var sql3 = 'select * from code;'
        db.query(sql1 + sql2 + sql3, (error, results)=>{
            var context = {
                /*********** mainFrame.ejs에 필요한 변수 ***********/
                who : name,
                login : login,
                boardtypes : results[0],
                pDetail : results[1],
                categories : results[2],
                body : 'purchaseDetail.ejs',
                cls : cls,
            };
            res.render('mainFrame',context,(err,html)=>{
                res.end(html)
            });
        });
    },
    purchase : (req,res)=>{
        var {name, login, cls} = authIsOwner(req,res);
        if (cls !== 'CST') {
            res.redirect('/auth/login');
        }
        var post = req.body;
        var sntzedProdId = post.prod_id;
        var sntzedLoginid = req.session.loginid;
        var now = new Date();
        var sntzedDate = now.getFullYear() + '.' 
            + ((now.getMonth() + 1) < 10 ? '0' : '') + (now.getMonth() + 1) + '.'
            + (now.getDate() < 10 ? '0' : '') + now.getDate() + ' : '
            + now.getHours() + '시 ' + now.getMinutes() + '분 ' + now.getSeconds() + '초';
        var sntzedPrice = post.price;
        var sntzedQty = post.qty;
        var sntzedTotal = sntzedPrice * sntzedQty;
        var sql = 'select * from product where prod_id = ?;'
        db.query(sql, [sntzedProdId], (error, results)=>{
            if (error) {
                console.log(error);
                res.redirect('/purchase');
            }
            if (results[0].stock < sntzedQty) {
                res.redirect('/purchase');
                return;
            }
            var sql1 = 'insert into purchase (loginid, prod_id, date, price, qty, total) values(?,?,?,?,?,?);'
            var sql2 = 'update product set stock = stock - ? where prod_id = ?;'
            db.query(sql1 + sql2,
                [sntzedLoginid, sntzedProdId, sntzedDate, sntzedPrice, sntzedQty, sntzedTotal, sntzedQty, sntzedProdId], (error, results)=>{
                    if (error) {
                        console.log(error);
                        res.redirect('/purchase');
                    }
                    res.redirect('/purchase');
            });
        });
    },
    purchaseList : (req,res)=>{
        var {name, login, cls} = authIsOwner(req,res);
        if (cls !== 'CST') {
            res.redirect('/auth/login');
        }
        var sql1 = 'select * from boardtype;'
        var sql2 = `select * from purchase inner join product on purchase.prod_id = product.prod_id where loginid = '${req.session.loginid}';`
        var sql3 = 'select * from code;'
        db.query(sql1 + sql2 + sql3, (error, results)=>{
            if (error) {
                console.log(error);
                res.redirect('/auth/login');
            }
            var context = {
                who : name,
                login : login,
                boardtypes : results[0],
                purchases : results[1],
                categories : results[2],
                body : 'purchase.ejs',
                cls : cls,
            };
            res.render('mainFrame',context,(err,html)=>{
                res.end(html)
            });
        });
    },
    purchaseCancel : (req,res)=>{
        var {name, login, cls} = authIsOwner(req,res);
        if (cls !== 'CST') {
            res.redirect('/auth/login');
        }
        var sql1 = `update purchase set cancel = "Y" where purchase_id = ${req.params.purchaseId};`
        var sql2 = `select prod_id, qty from purchase where purchase_id = ${req.params.purchaseId};`
        db.query(sql1 + sql2, (error, results)=>{
            if (error) {
                console.log(error);
                res.redirect('/auth/login');
            }
            db.query('update product set stock = stock + ? where prod_id = ?;',
                [results[1][0].qty, results[1][0].prod_id], (error2, results2)=>{
                    if (error2) {
                        console.log(error2);
                        res.redirect('/auth/login');
                    }
                    res.redirect('/purchase');
                });
        });
    },
    cart : (req,res)=>{
        var {name, login, cls} = authIsOwner(req,res);
        if (cls !== 'CST') {
            res.redirect('/auth/login');
        }
        var sql = 'select * from boardtype;'
        var sql1 = 'select * from code;'
        var sql2 = `select * from cart c inner join product p on c.prod_id = p.prod_id where c.loginid = '${req.session.loginid}';`
        db.query(sql + sql1 + sql2, (error, results)=>{
            if (error) {
                console.log(error);
                res.redirect('/auth/login');
            }
            var context = {
                who : name,
                login : login,
                boardtypes : results[0],
                categories : results[1],
                carts : results[2],
                body : 'cart.ejs',
                cls : cls,
            };
            res.render('mainFrame',context,(err,html)=>{
                res.end(html)
            });
        });
    },
    cart_process : (req,res)=>{
        var {name, login, cls} = authIsOwner(req,res);
        if (cls !== 'CST') {
            res.redirect('/auth/login');
        }
        var post = req.body;
        var sntzedProdId = post.prod_id;
        var sntzedLoginid = req.session.loginid;
        var sql = `select * from cart where prod_id = ${sntzedProdId} and loginid = '${sntzedLoginid}';`;
        db.query(sql, (error, results)=>{
            if (error) {
                console.log(error);
                res.redirect('/purchase/cart');
            }
            if (results.length !== 0) {
                // 이미 장바구니에 있는 상품이면 추가하지 않고 리다이렉트
                res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                return res.end(`<script language=JavaScript type="text/javascript">alert("장바구니에 이미 있는 제품입니다.")
                        setTimeout("location.href='http://localhost:3000/purchase/cart'", 1000)
                        </script>`)
            }
            var now = new Date();
            var sntzedDate = now.getFullYear() + '.' 
                + ((now.getMonth() + 1) < 10 ? '0' : '') + (now.getMonth() + 1) + '.'
                + (now.getDate() < 10 ? '0' : '') + now.getDate() + ' : '
                + now.getHours() + '시 ' + now.getMinutes() + '분 ' + now.getSeconds() + '초';
            var sql1 = 'insert into cart (loginid, prod_id, date) values(?,?,?);'
            db.query(sql1,
                [sntzedLoginid, sntzedProdId, sntzedDate], (error, results)=>{
                    if (error) {
                        console.log(error);
                        res.redirect('/purchase/cart');
                    }
                    res.redirect('/purchase/cart');
            });
        });
    },
    cart_purchase : (req,res)=>{
        var {name, login, cls} = authIsOwner(req,res);
        if (cls !== 'CST') {
            res.redirect('/auth/login');
        }
        console.log(req.body);
        var post = req.body;
        var selected = post.selected;
        var sntzedLoginid = req.session.loginid;
        if (!selected) selected = [];                      // 0개 → 빈 배열
        else if (!Array.isArray(selected)) selected = [selected]; // 1개 → 배열화
        
        if (selected.length === 0) {
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
            return res.end(`<script language=JavaScript type="text/javascript">alert("구매할 상품을 선택해주세요.")
                    setTimeout("location.href='http://localhost:3000/purchase/cart'", 1000)
                    </script>`)
        }  
        for (let i = 0; i < selected.length; i++) {
            const sntzedProdId = post.selected[i];
            console.log(sntzedProdId); // 1 번째 : 4, 2번째 5
            const sntzedQty = parseInt(post.qty[i]);
            console.log(sntzedQty);
            const now = new Date();
            const sntzedDate = now.getFullYear() + '.' 
                + ((now.getMonth() + 1) < 10 ? '0' : '') + (now.getMonth() + 1) + '.'
                + (now.getDate() < 10 ? '0' : '') + now.getDate() + ' : '
                + now.getHours() + '시 ' + now.getMinutes() + '분 ' + now.getSeconds() + '초';
            const sql = `select * from product where prod_id = ${sntzedProdId};`
            console.log(sql);
            db.query(sql, (error, results)=>{
                if (error) {
                    console.log(error);
                    res.redirect('/purchase/cart');
                }
                const sntzedPrice = results[0].price;
                const sntzedTotal = sntzedPrice * sntzedQty;
                const sql1 = 'insert into purchase (loginid, prod_id, date, price, qty, total) values(?,?,?,?,?,?);'
                const sql2 = 'update product set stock = stock - ? where prod_id = ?;'
                const sql3 = 'delete from cart where loginid = ? and prod_id = ?;'
                db.query(sql1 + sql2 + sql3,
                    [sntzedLoginid, sntzedProdId, sntzedDate, sntzedPrice, sntzedQty, sntzedTotal, sntzedQty, sntzedProdId, sntzedLoginid, sntzedProdId], (error, results)=>{
                        if (error) {
                            console.log(error);
                            res.redirect('/purchase/cart');
                        }
                });
            });
        }
        res.redirect('/purchase');
    },
    cart_delete_process : (req,res)=>{
        var {name, login, cls} = authIsOwner(req,res);
        if (cls !== 'CST') {
            res.redirect('/auth/login');
        }
        console.log(req.body);
        var post = req.body;
        var selected = post.selected;
        var sntzedLoginid = req.session.loginid;
        if (!selected) selected = [];                      // 0개 → 빈 배열
        else if (!Array.isArray(selected)) selected = [selected]; // 1개 → 배열화
        
        if (selected.length === 0) {
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
            return res.end(`<script language=JavaScript type="text/javascript">alert("삭제할 상품을 선택해 주세요.")
                    setTimeout("location.href='http://localhost:3000/purchase/cart'", 1000)
                    </script>`)
        }  
        for (let i = 0; i < selected.length; i++) {
            const sntzedProdId = post.selected[i];
            console.log(sntzedProdId); // 1 번째 : 4, 2번째 5
            const sql = `delete from cart where loginid = '${sntzedLoginid}' and prod_id = ${sntzedProdId};`;
            db.query(sql, (error, results)=>{
                if (error) {
                    console.log(error);
                    res.redirect('/purchase/cart');
                }
            });
        }
        res.redirect('/purchase/cart');
    }
}