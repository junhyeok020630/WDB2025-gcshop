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
        var sql1 = 'select * from code;';
        db.query(sql + sql1 +'select * from product', (error, results)=>{
            if(error){
                console.log(error);
                res.redirect('/product/view');
            }
            var context = {
                /*********** mainFrame.ejs에 필요한 변수 ***********/
                who : name,
                login : login,
                body : 'product.ejs',
                cls : cls,
                boardtypes: results[0],
                categories: results[1],
                product: results[2]
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
        db.query(sql + 'select * from code', (error, results)=>{
            if(error){
                console.log(error);
                res.redirect('/product/create');
            }
            var context = {
            /*********** mainFrame.ejs에 필요한 변수 ***********/
            who : name,
            login : login,
            body : 'productCU.ejs',
            cls : cls,
            url : url,
            boardtypes: results[0],
            code: results[1],
            categories: results[1],
            };
            req.app.render('mainFrame',context, (err, html)=>{
                res.end(html); })
            });

    },
    create_process : (req,res)=>{
        var {name, login, cls} = authIsOwner(req,res);
        var file = '/images/' + req.file.filename
        if (cls !== 'MNG') {
            res.redirect('/auth/login');
        }
        var post = req.body;
        var [sntzedMainId, sntzedSubId] = post.category.split(":");
        var sntzedName = post.name;
        var sntzedPrice = post.price;
        var sntzedStock = post.stock;
        var sntzedBrand = post.brand;
        var sntzedSupplier = post.supplier;
        var sntzedImage = file;

        

        db.query('insert into product(main_id,sub_id,name,price,stock,brand,supplier,image) values(?,?,?,?,?,?,?,?)',
            [sntzedMainId,sntzedSubId,sntzedName,sntzedPrice,sntzedStock,sntzedBrand,sntzedSupplier,sntzedImage], (error, result)=>{
                if(error){
                    console.log(error);
                    res.redirect('/product/create');
                }
                res.redirect('/product/view');
        });
    },
    update : (req,res)=>{
        var {name, login, cls} = authIsOwner(req,res);
        var url = 'update';
        if (cls !== 'MNG') {
            res.redirect('/auth/login');
        }
        var sql = 'select * from boardtype;';
        db.query(sql + 'select * from code', (error, results)=>{
            if(error){
                console.log(error);
                res.redirect('/product/update');
            }
            var sql2 = 'select * from product where prod_id = ?;';
            db.query(sql2, [req.params.prodId], (error, result)=>{
                if(error){
                    console.log(error);
                    res.redirect('/product/view');
                }
                var context = {
                    /*********** mainFrame.ejs에 필요한 변수 ***********/
                    who : name,
                    login : login,
                    body : 'productCU.ejs',
                    cls : cls,
                    product : result[0],
                    boardtypes: results[0],
                    code: results[1],
                    categories: results[1],
                    url : url,
                };
                req.app.render('mainFrame',context, (err, html)=>{
                    res.end(html); })
            });
        });
    },
    update_process : (req,res)=>{
        var {name, login, cls} = authIsOwner(req,res);
        if (cls !== 'MNG') {
            res.redirect('/auth/login');
        }
        var post = req.body;
        var [sntzedMainId, sntzedSubId] = post.category.split(":");
        var sntzedName = post.name;
        var sntzedPrice = post.price;
        var sntzedStock = post.stock;
        var sntzedBrand = post.brand;
        var sntzedSupplier = post.supplier;
        var sntzedProdId = post.prod_id;
        if (req.file) {
            var sntzedImage = '/images/' + req.file.filename;
        } else {
            var sntzedImage = post.notUpdatedImage;
        }

        db.query('update product set main_id=?, sub_id=?, name=?, price=?, stock=?, brand=?, supplier=?, image=? where prod_id=?',
            [sntzedMainId, sntzedSubId, sntzedName, sntzedPrice, sntzedStock, sntzedBrand, sntzedSupplier, sntzedImage, sntzedProdId], (error, results)=>{
            if(error){
                console.log(error);
                res.redirect('/product/update');
            }
            res.redirect('/product/view');
        });
    },
    delete : (req,res)=>{
        var {name, login, cls} = authIsOwner(req,res);
        if (cls !== 'MNG') {
            res.redirect('/auth/login');
        }
        var sql = 'delete from product where prod_id = ?';
        db.query(sql, [req.params.prodId], (error, results)=>{
            if(error){
                console.log(error);
                res.redirect('/prodcut/view');
            }
            res.redirect('/product/view');
        });
    }
}