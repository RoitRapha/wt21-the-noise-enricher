const fs = require("fs");
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require("path");
const runPython = require("../controllers/run-python")



const audioFile = {};

// const limits = { fileSize: 1024 * 1024 * 1024 }
const upload = multer({
    dest: path.join(__dirname, '../../client/public/uploads/'),
    // limits: limits
});

router.get('/', (req, res) => {
    res.render('index');
});

router.get('/pro', (req, res) => {
    res.render('generate/generate_pro');
});

router.post('/', upload.single('audio'), async (req, res) => {
    if (req.file) {
        audioFile.file = req.file;
        res.redirect(302, 'generate/spectrogram');
    }
    else
        res.redirect(302, '/');
});

router.get('/spectrogram', async (req, res) => {
    if (audioFile.file) {
        res.render('generate/spectrogram', {filepath: audioFile.file.filename});
        // TODO: make link to results active after results are generated
        // await new Promise(resolve => setTimeout(resolve, 1000));
    }
    else
        res.redirect(302, '/');
});

router.get('/results', async (req, res) => {
    if(audioFile.file) {
        fs.unlink(path.join(__dirname, '../../client/public/uploads/' + audioFile.file.filename), (err) => {
            if (err) throw err;
        });
    }

    await runPython.drawPythonPlot();

    // await new Promise(resolve => setTimeout(resolve, 3000));

    const generated_file = "http://jplayer.org/audio/mp3/RioMez-01-Sleep_together.mp3"

    if (generated_file) { // && python_response_code === 0
        res.render('generate/results', {
            image: '../../public/uploads/test.png',
            filepath: generated_file,});
    } else
        res.redirect(302, '/');
});

module.exports = router;

