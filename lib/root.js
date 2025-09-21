// 202136049 최준혁
const db = require('./db');
var sanitizeHtml = require('sanitize-html');
const purchase = require('./purchase');

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
    home : (req,res)=>{
        var {login, name, cls} = authIsOwner(req,res);
        var sql1 = 'select * from boardtype;'
        var sql2 = 'select * from product;'
        var sql3 = 'select * from code;'
        db.query(sql1 + sql2 + sql3, (error, results)=>{
            var context = {
                /*********** mainFrame.ejs에 필요한 변수 ***********/
                who : name,
                login : login,
                boardtypes : results[0],
                product : results[1],
                categories : results[2],
                body : 'product.ejs',
                cls : cls,
            };
            res.render('mainFrame',context,(err,html)=>{
                res.end(html)
            });
        });
    },
    categoryview : (req,res)=>{
        var {login, name, cls} = authIsOwner(req,res);
        var productMainId = req.params.categ.substr(0,4);
        var productSubId = req.params.categ.substr(4,4);
        var sql1 = 'select * from boardtype;'
        var sql2 = `select * from product where main_id = ${productMainId} and sub_id = ${productSubId};`
        var sql3 = 'select * from code;'
        db.query(sql1 + sql2 + sql3, (error, results)=>{
            var context = {
                /*********** mainFrame.ejs에 필요한 변수 ***********/
                who : name,
                login : login,
                boardtypes : results[0],
                product : results[1],
                categories : results[2],
                body : 'product.ejs',
                cls : cls,
            };
            res.render('mainFrame',context,(err,html)=>{
                res.end(html)
            });
        });
    },
    search : (req,res)=>{
        var {login, name, cls} = authIsOwner(req,res);
        var body = req.body;
        var sql1 = 'select * from boardtype;'
        var sql2 = `select * from product
                    where name like '%${body.search}%' or
                        brand like '%${body.search}%' or
                        supplier like '%${body.search}%';`
        var sql3 = 'select * from code;'
        db.query(sql1 + sql2 + sql3, (error, results)=>{
            var context = {
                /*********** mainFrame.ejs에 필요한 변수 ***********/
                who : name,
                login : login,
                boardtypes : results[0],
                product : results[1],
                categories : results[2],
                body : 'product.ejs',
                cls : cls,
            };
            res.render('mainFrame',context,(err,html)=>{
                res.end(html)
            });
        });
    },
    detail : (req,res)=>{
        var {login, name, cls} = authIsOwner(req,res);
        var sql1 = 'select * from boardtype;'
        var sql2 = `select * from product where prod_id = ${req.params.prodId};`
        var sql3 = 'select * from code;'
        if (cls === 'CST') {
            var p = 'Y';
        } else {
            var p = 'N';
        }
        db.query(sql1 + sql2 + sql3, (error, results)=>{
            var context = {
                /*********** mainFrame.ejs에 필요한 변수 ***********/
                who : name,
                login : login,
                boardtypes : results[0],
                pDetail : results[1],
                p : p,
                categories : results[2],
                body : 'productDetail.ejs',
                cls : cls,
            };
            res.render('mainFrame',context,(err,html)=>{
                res.end(html)
            });
        });
    },
    cartview : (req,res)=>{
        var {login, name, cls} = authIsOwner(req,res);
        if (cls !== 'MNG') {
            res.redirect('/auth/login');
        }
        var sql1 = 'select * from boardtype;'
        var sql2 = `select 
                    cart_id,
                    cart.loginid as loginid, 
                    person.name as person_name, 
                    cart.prod_id as prod_id, 
                    product.name as product_name, 
                    cart.date as cart_date 
                    from cart 
                    inner join person on cart.loginid = person.loginid 
                    inner join product on cart.prod_id = product.prod_id;`
        var sql3 = 'select * from code;';
        db.query(sql1 + sql2 + sql3, (error, results)=>{
            console.log(results[1]);
            var context = {
                /*********** mainFrame.ejs에 필요한 변수 ***********/
                who : name,
                login : login,
                boardtypes : results[0],
                carts : results[1],
                categories : results[2],
                body : 'cartView.ejs',
                cls : cls,
            };
            res.render('mainFrame',context,(err,html)=>{
                res.end(html)
            });
        });
    },
    cartupdate : (req,res)=>{
        var {login, name, cls} = authIsOwner(req,res);
        if (cls !== 'MNG') {
            res.redirect('/auth/login');
        }
        var cartId = req.params.cartId;
        var sql1 = 'select * from boardtype;'
        var sql2 = `select
                    *
                    from cart
                    where cart_id = ${cartId};`
        var sql3 = 'select * from code;';
        var sql4 = 'select * from product;';
        var sql5 = 'select * from person where class = "CST";';
        db.query(sql1 + sql2 + sql3 + sql4 + sql5, (error, results)=>{
            var context = {
                /*********** mainFrame.ejs에 필요한 변수 ***********/
                who : name,
                login : login,
                boardtypes : results[0],
                cart : results[1],
                categories : results[2],
                products : results[3],
                persons : results[4],
                body : 'cartU.ejs',
                cls : cls,
            };
            res.render('mainFrame',context,(err,html)=>{
                res.end(html)
            });
        });
    },
    cartupdate_process : (req,res)=>{
        var {login, name, cls} = authIsOwner(req,res);
        if (cls !== 'MNG') {
            res.redirect('/auth/login');
        }
        var post = req.body;
        var sntzedCartId = sanitizeHtml(post.cart_id);
        var sntzedLoginid = sanitizeHtml(post.loginid);
        var sntzedProdId = sanitizeHtml(post.prod_id);
        var sntzedDate = sanitizeHtml(post.date);
        db.query('update cart set loginid = ?, prod_id = ?, date = ? where cart_id = ?',
            [sntzedLoginid, sntzedProdId, sntzedDate, sntzedCartId], (error, result)=>{
                if(error){
                    console.log(error);
                    res.redirect('/cart/update/' + sntzedCartId);
                }
                res.redirect('/cartview');
        });
    },
    cartdelete : (req,res)=>{
        var {login, name, cls} = authIsOwner(req,res);
        if (cls !== 'MNG') {
            res.redirect('/auth/login');
        }
        var cartId = req.params.cartId;
        var sql = `delete from cart where cart_id = ${cartId};`;
        db.query(sql, (error, result)=>{
            if(error){
                console.log(error);
                res.redirect('/cartview');
            }
            res.redirect('/cartview');
        });
    },
    purchaseview : (req,res)=>{
        var {login, name, cls} = authIsOwner(req,res);
        if (cls !== 'MNG') {
            res.redirect('/auth/login');
        }
        var sql1 = 'select * from boardtype;'
        var sql2 = `select 
                    purchase_id,
                    purchase.loginid as loginid, 
                    person.name as person_name, 
                    purchase.prod_id as prod_id, 
                    product.name as product_name, 
                    purchase.date as purchase_date,
                    purchase.price as price,
                    qty,
                    total,
                    payYN,
                    cancel,
                    refund
                    from purchase
                    inner join person on purchase.loginid = person.loginid 
                    inner join product on purchase.prod_id = product.prod_id;`
        var sql3 = 'select * from code;';
        db.query(sql1 + sql2 + sql3, (error, results)=>{
            console.log(results[1]);
            var context = {
                /*********** mainFrame.ejs에 필요한 변수 ***********/
                who : name,
                login : login,
                boardtypes : results[0],
                purchases : results[1],
                categories : results[2],
                body : 'purchaseView.ejs',
                cls : cls,
            };
            res.render('mainFrame',context,(err,html)=>{
                res.end(html)
            });
        });
    },
    purchaseupdate : (req,res)=>{
        var {login, name, cls} = authIsOwner(req,res);
        if (cls !== 'MNG') {
            res.redirect('/auth/login');
        }
        var purchaseId = req.params.purchaseId;
        var sql1 = 'select * from boardtype;'
        var sql2 = `select
                    *
                    from purchase
                    where purchase_id = ${purchaseId};`
        var sql3 = 'select * from code;';
        var sql4 = 'select * from product;';
        var sql5 = 'select * from person where class = "CST";';
        db.query(sql1 + sql2 + sql3 + sql4 + sql5, (error, results)=>{
            console.log(results[1]);
            var context = {
                /*********** mainFrame.ejs에 필요한 변수 ***********/
                who : name,
                login : login,
                boardtypes : results[0],
                purchase : results[1],
                categories : results[2],
                products : results[3],
                persons : results[4],
                body : 'purchaseU.ejs',
                cls : cls,
            };
            res.render('mainFrame',context,(err,html)=>{
                res.end(html)
            });
        });
    },
    purchaseupdate_process : (req,res)=>{
        var {login, name, cls} = authIsOwner(req,res);
        if (cls !== 'MNG') {
            res.redirect('/auth/login');
        }
        var post = req.body;
        var sntzedPurchaseId = sanitizeHtml(post.purchase_id);
        var sntzedLoginid = sanitizeHtml(post.loginid);
        var sntzedProdId = sanitizeHtml(post.prod_id);
        var sntzedDate = sanitizeHtml(post.date);
        var sntzedPrice = sanitizeHtml(post.price);
        var sntzedQty = sanitizeHtml(post.qty);
        var sntzedTotal = sanitizeHtml(post.total);
        var sntzedPayYN = sanitizeHtml(post.payYN);
        var sntzedCancel = sanitizeHtml(post.cancel);
        var sntzedRefund = sanitizeHtml(post.refund);
        db.query('update purchase set loginid = ?, prod_id = ?, date = ?, price = ?, qty = ?, total = ?, payYN = ?, cancel = ?, refund = ? where purchase_id = ?',
            [sntzedLoginid,sntzedProdId,sntzedDate,sntzedPrice,sntzedQty,sntzedTotal,sntzedPayYN,sntzedCancel,sntzedRefund,sntzedPurchaseId],(error, results)=>{
                if(error){
                    console.log(error);
                    res.redirect('/purchaseupdate/' + sntzedPurchaseId);
                }
                res.redirect('/purchaseview');
        });

    },
    purchasedelete : (req,res)=>{
        var {login, name, cls} = authIsOwner(req,res);
        if (cls !== 'MNG') {
            res.redirect('/auth/login');
        }
        var purchaseId = req.params.purchaseId;
        var sql = `delete from purchase where purchase_id = ${purchaseId};`;
        db.query(sql, (error, result)=>{
            if(error){
                console.log(error);
                res.redirect('/purchaseview');
            }
            res.redirect('/purchaseview');
        });
    },
    table : (req,res)=>{
        var {login, name, cls} = authIsOwner(req,res);
        if (cls !== 'MNG') {
            res.redirect('/auth/login');
        }
        var sql1 = 'select * from boardtype;'
        var sql2 = `SELECT * FROM INFORMATION_SCHEMA.TABLES where table_schema = 'webdb2025';`
        var sql3 = 'select * from code;';
        db.query(sql1 + sql2 + sql3, (error, results)=>{
            var context = {
                /*********** mainFrame.ejs에 필요한 변수 ***********/
                who : name,
                login : login,
                boardtypes : results[0],
                tables : results[1],
                categories : results[2],
                body : 'tableManage.ejs',
                cls : cls,
            };
            res.render('mainFrame',context,(err,html)=>{
                res.end(html)
            });
        });
    },
    tableview : (req,res)=>{
        var {login, name, cls} = authIsOwner(req,res);
        if (cls !== 'MNG') {
            res.redirect('/auth/login');
        }
        var tableName = req.params.tableName;
        var sql1 = 'select * from boardtype;'
        var sql2 = `SELECT  * FROM information_schema.columns WHERE table_schema = 'webdb2025' and  table_name='${tableName}' ;`
        var sql3 = 'select * from code;';
        var sql4 = `select * from ${tableName};`
        db.query(sql1 + sql2 + sql3 + sql4, (error, results)=>{
            console.log(results[1]);
            console.log (results[3]);
            var context = {
                /*********** mainFrame.ejs에 필요한 변수 ***********/
                who : name,
                login : login,
                boardtypes : results[0],
                columns : results[1],
                categories : results[2],
                tableData : results[3],
                body : 'tableView.ejs',
                cls : cls,
            };
            res.render('mainFrame',context,(err,html)=>{
                res.end(html)
            });
        });
    },
    customeranal : (req,res)=>{
        var {login, name, cls} = authIsOwner(req,res);
        if (cls !== 'CEO') {
            res.redirect('/auth/login');
        }
        var sql1 = 'select * from boardtype;';
        var sql2 = `select address,ROUND(( count(*) / ( select count(*) from person )) * 100, 2) as rate
                    from person group by address;`;
        var sql3 = 'select * from code;';
        db.query(sql1 + sql2 + sql3, (error, results)=>{
            var context = {
                /*********** mainFrame.ejs에 필요한 변수 ***********/
                who : name,
                login : login,
                boardtypes : results[0],
                percentage : results[1],
                categories : results[2],
                body : 'customerAnal.ejs',
                cls : cls,
            };
            res.render('mainFrame',context,(err,html)=>{
                res.end(html)
            });
        });
    },
}