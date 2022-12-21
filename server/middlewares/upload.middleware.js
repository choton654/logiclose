import multer from "multer";
import path from "path";
import { Storage } from '@google-cloud/storage'
// import deleteFromServer from "../utils/unlinkFile.js";

const bucket = new Storage({
    keyFilename: process.env.GCLOUD_STORAGE_BUCKET_KEY,
    projectId: "logiclose"
}).bucket(process.env.GCLOUD_STORAGE_BUCKET)

// const storage = multer.diskStorage({
//     destination: "./server/uploads",
//     filename: (_, file, cb) => {
//         cb(
//             null,
//             `file_${Date.now()}_${Date.now().toString(36) + Math.random().toString(36).slice(2)}.${file.originalname.split(".")[file.originalname.split('.').length - 1]}`
//         );
//     },
// });

const multerUpload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 200000000 }
}).array("uploads")

const checkFileType = (files, filetype) => {
    try {
        //check ext
        const extname = files.map(file =>
            filetype.test(path.extname(file.originalname).toLowerCase())
        )
        //check mime
        const mimetype = files.map(file =>
            filetype.test(file.mimetype) ||
            file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
        // check both mimetype and extname
        if (mimetype.includes(false) || extname.includes(false)) {
            return false
        }
        return true
    } catch (error) {
        console.log(error);
        return false
    }
}

export const handleMulter = (req, res) => {
    return new Promise((resolve, reject) => {
        multerUpload(req, res, (err) => {
            //Allowed text
            const filetype = /jpeg|png|gif|jpg|pdf|xlsx|xls/;
            // multer error check ===========
            if (err instanceof multer.MulterError) {
                reject({ message: err.message })
            } else if (!checkFileType(req.files, filetype)) {
                reject({ message: "Only images are allowed" })
            } else {
                resolve('Files has been successfully uploaded')
            }
        })
    })
}

export const gcpUploads = async (req) => {
    try {
        // const bucketPromises = req.files.map(file =>
        //     gcpStorage.bucket(process.env.GCLOUD_STORAGE_BUCKET).upload(file.path, { destination: file.filename }))
        // const resolvedFileUpload = await Promise.all(bucketPromises)
        // const images = resolvedFileUpload.map(file => {
        //     let replacedStr = file[1].selfLink.replace('https://www.googleapis.com/storage/v1/b/logiclose/o', 'https://storage.cloud.google.com/logiclose')
        //     replacedStr = `${replacedStr}?authuser=1`
        //     return replacedStr
        // })
        // Create a new blob in the bucket and upload the file data.
        const allBlobArr = req.files.map(file =>
            new Promise((resolve, reject,) => {
                const blob = bucket.file(file.originalname)
                const blobStream = blob.createWriteStream();
                let publicUrl = ''
                blobStream.on('error', err => {
                    console.log(err);
                    reject()
                })
                blobStream.on('finish', () => {
                    // https://storage.googleapis.com/logiclose/CompsPreview5.png
                    // The public URL can be used to directly access the file via HTTP.
                    publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`
                })
                blobStream.end(file.buffer, () => {
                    resolve(publicUrl)
                });
            })
        )
        const publicUrlArr = await Promise.all(allBlobArr)
        // await deleteFromServer(req.files)
        return [null, publicUrlArr]
    } catch (error) {
        console.log(error.message)
        // await deleteFromServer(req.files)
        const errObj = {
            code: 400,
            message: error.message
        }
        return [errObj, null]
    }
}