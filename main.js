// 202136049 최준혁
// 1. import 코드들
const express = require('express');
const app = express();
var db = require('./lib/db');
var bodyParser = require('body-parser');
const rootRouter = require('./router/rootRouter');
const authRouter = require('./router/authRouter');
const codeRouter = require('./router/codeRouter');
const productRouter = require('./router/productRouter');
const personRouter = require('./router/personRouter');
const boardRouter = require('./router/boardRouter');
const purchaseRouter = require('./router/purchaseRouter');
var session = require('express-session');
var MySqlStore = require('express-mysql-session')(session);

// 2. 모든 경로에 대해서 실행되어야 할 모듈들
var options = {
    host : 'localhost',
    user : 'root',
    password : 'root',
    database : 'webdb2025'
};
var sessionStore = new MySqlStore(options);

app.set('views', __dirname+'/views');
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static('public'));

app.use(session({
    secret : 'keyboard cat',
    resave : false,
    saveUninitialized : true,
    store : sessionStore
}));

// 3. 개발자 정의 라우터
app.use('/', rootRouter);
app.use('/auth', authRouter);
app.use('/code', codeRouter);
app.use('/product', productRouter);
app.use('/person', personRouter);
app.use('/board', boardRouter);
app.use('/purchase', purchaseRouter);

app.get('/favicon.ico', (req, res) => res.writeHead(404))

app.listen(3000, () => console.log('Example app listening on port 3000!'));