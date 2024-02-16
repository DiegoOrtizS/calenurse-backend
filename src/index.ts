import express from "express"
import { myDataSource } from "./app-data-source"
import apiV1 from "./routes/v1"

// establish database connection
myDataSource
    .initialize()
    .then((r) => {
        console.log("Data Source has been initialized!")
        //return r.synchronize()
    })
    /*.then((r) => {
        console.log("Data Source has been synchronized!")
    })*/
    .catch((err) => {
        console.error("Error during Data Source initialization:", err)
    })

// create and setup express app
const app = express()
app.use(express.json())

app.use("/api/v1", apiV1)

// start express server
app.listen(3000)