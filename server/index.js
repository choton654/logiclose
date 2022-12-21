import 'dotenv/config'
import next from "next"
import app from "./app.js"
import http from "http"
import "./db.js"

const dev = process.env.NODE_ENV !== 'production'
const PORT = process.env.PORT
const nextApp = next({ dev })
const handle = nextApp.getRequestHandler()

nextApp.prepare().then(() => {

    const server = http.createServer(app)

    app.all('*', (req, res) => {
        return handle(req, res)
    })
    server.listen(PORT, () => console.log(`App is running on port ${PORT}`))
}).catch(err => console.log(err))