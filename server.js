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

app.post('/merge', upload.array('pdfs', 2), async(req, res, next) => {
    const uploadedFiles = req.files; // Array of uploaded files
    // console.log(uploadedFiles)

    const files = async(p1, p2) => {
        let merger = new PDFMerger(); // Create a new instance for each merge operation

        await merger.add(p1);
        await merger.add(p2);

        let d = new Date().getTime();
        await merger.save(`pdfs/${d}.pdf`); //save under given name and reset the internal document
        return d
    }

    let d = await files(path.join(__dirname, req.files[0].path), path.join(__dirname, req.files[1].path))
    res.redirect(`http://localhost:3000/static/${d}.pdf`)

});

app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`)
})