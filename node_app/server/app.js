const express = require('express');
const multer = require('multer');
const bodyParser = require("body-parser");
const ejsMate = require('ejs-mate');
const app = express();
const router = express.Router();
const morgan = require('morgan');
const path = require('path');

const upload = multer({ dest: 'uploads/' })

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/../client/views'));

app.use(express.static(path.join(__dirname, '/../client')));

app.use('/',router);
app.use(morgan('dev'));

app.use(bodyParser.json());

router.route('/')
    .get((req, res) => {
        res.render('home');
    })
    .post(upload.single('audio'), (req, res) => {
        console.log(req.file, req.body);
        res.redirect(303, '/');
        // res.status(301)
})

const port = process.env.PORT || 3030;

app.listen(port, () => {
    console.log(`Serving on port ${port}`);
})