const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');

const mb = 1024 * 1025;

const saveFolderPath = 'uploads/images/';

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, saveFolderPath);
    },
    filename: (req, file, callback) => {
        const extension = file.mimetype.split('/')[1];
        const fileName = `image-${Date.now()}.${extension}`;
        callback(null, fileName);
    }
});

const isImage = (req, file, callback) => {
    if (file.mimetype.startsWith('image')) {
        callback(null, true);
    }
    else {
        callback(null, false);
    }
}

const upload = multer({
    storage: storage,
    fileFilter: isImage,
    limits: {
        fileSize: mb * 5
    }
});

const uploadImage = upload.single('photo');


router.post('/', uploadImage, (req, res) => {
    const file = req.file;
    if (file === undefined) {
        res.status(400).json({
            statusCode: 400,
            success: "Unsuccessful",
            message: "Only Image is Allowed."
        });
    }
    else {
        const path = file.path;
        const nameArray = path.split('\\');
        const fileName = nameArray[nameArray.length - 1];
        console.log(fileName);

        res.status(200).json({
            statusCode: 200,
            success: "Success",
            fileName: fileName,
            path: path
        });
    }

});



router.get('/', async (req, res) => {
    const fileNames = [];

    fs.readdirSync(saveFolderPath).forEach(file => {
        fileNames.push(saveFolderPath + file);
    });

    ///async way of reading file names
    /*
    fs.readdir(saveFolderPath, (err, files) => {
        files.forEach(file => {
            fileNames.push(file);
            console.log(file);
        });
    });
    */


    console.log(fileNames);

    res.status(200).json({
        statusCode: 200,
        success: "Success",
        fileNames: fileNames
    });
})



module.exports = router;