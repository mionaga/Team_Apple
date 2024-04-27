const express = require('express');
const morgan = require('morgan');
const path = require('path');
const engine = require('ejs-mate');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Travel = require('./models/travels');

mongoose.connect('mongodb://localhost:27017/teamApple', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFinsAndModify: false
})
.then(() => {
    console.log('mongodbコネクションok!!!!');
})
.catch(err => {
    console.log('mongodbコネクションエラー!!!!!');
    console.log(err);
});

const app = express();
const requestTime = function(req, res, next) {
    req.requestTime = Date.now();
    next();
}

app.use(morgan('dev'));
app.use(requestTime);
app.use(express.urlencoded({extended: true}));
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));

app.get('/', (req, res) => {
    let responseText = 'Welcome To The Travel Blogs!<br>'
    responseText += '<small>Requested at: ' + req.requestTime + '</small>'
    res.send(responseText);
    // res.send('<h1>Home</h1>')
});

app.get('/travels', async(req, res) => {
    const travels = await Travel.find({});
    res.render('travels/index', { travels });
});

app.get('/travels/new', (req, res) => {
    res.render('travels/new');
});

app.get('/travels/:id', async(req, res) => {
    const travel = await Travel.findById(req.params.id);
    res.render('travels/show', { travel });
})

app.post('/travels', async(req, res) => {
    const travel = new Travel(req.body.travel);
    console.log(travel);
    await travel.save();
    res.redirect(`/travels/${travel._id}`);
});

app.get('/travels/:id/edit', async(req, res) => {
    const travel = await Travel.findById(req.params.id);
    res.render('travels/edit', { travel });
});

app.put('/travels/:id', async(req, res) => {
    const { id } = req.params;
    const travel = await Travel.findByIdAndUpdate(id, { ...req.body.travel });
    res.redirect(`/travels/${travel._id}`);
});

app.delete('/travels/:id', async(req, res) => {
    const { id } = req.params;
    await Travel.findByIdAndDelete(id);
    res.redirect('/travels');
})

app.listen(3000, () => {
    console.log('ポート5000でリクエスト待受中...')
});