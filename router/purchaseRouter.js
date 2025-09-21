// 202136049 최준혁
const express = require('express');
var router = express.Router()
var purchase = require('../lib/purchase');

router.get('/detail/:prodId', (req,res)=> {
    purchase.purchaseDetail(req,res)
});

router.post('/', (req,res)=> {
    purchase.purchase(req,res)
});

router.get('/', (req,res)=> {
    purchase.purchaseList(req,res)
});

router.get('/cancel/:purchaseId', (req,res)=> {
    purchase.purchaseCancel(req,res)   
});

router.get('/cart', (req,res)=> {
    purchase.cart(req,res)
});

router.post('/cart_process', (req,res)=> {
    purchase.cart_process(req,res)
});

router.post('/cart_purchase', (req,res)=> {
    purchase.cart_purchase(req,res)
});
router.post('/cart_delete_process', (req,res)=> {
    purchase.cart_delete_process(req,res)
});

module.exports = router;