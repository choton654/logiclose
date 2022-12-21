import fs from 'fs'
import util from 'util'
const unlinkFile = util.promisify(fs.unlink)

const deleteFromServer = async (files) => {
    // unlink if error happens
    const unlinkPromises = files.map(file => unlinkFile(file.path))
    await Promise.all(unlinkPromises)
}

export default deleteFromServer
