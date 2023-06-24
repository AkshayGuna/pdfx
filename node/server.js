const express = require('express')
const path = require('path')
const app = express()
const multer = require('multer')
const PDFMerger = require('pdf-merger-js');
const upload = multer({ dest: 'uploads/' })
app.use('/static', express.static('pdfs'))
app.use(express.static(path.join(__dirname, 'public')));
const port = 3000

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "templates/index.html"))
})

app.post('/merge', upload.array('pdfs', 1000), async(req, res, next) => {
    const uploadedFiles = req.files; // Array of uploaded files
    // console.log(uploadedFiles)

    // Check if the number of uploaded files is more than 1000
    if (uploadedFiles.length > 1000) {
        return res.status(400).send('You can upload a maximum of 1000 files.');
    }

    const files = async(uploadedFile) => {
        let merger = new PDFMerger(); // Create a new instance for each merge operation

        for (const file of uploadedFile) {
            await merger.add(file);
        }

        let d = new Date().getTime();
        await merger.save(`pdfs/${d}.pdf`); //save under given name and reset the internal document
        return d
    }

    let d = await files(req.files.map(file => path.join(__dirname, file.path)))
    res.redirect(`http://localhost:3000/static/${d}.pdf`)

});

app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`)
})