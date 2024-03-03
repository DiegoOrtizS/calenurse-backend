import express from "express"
import { myDataSource } from "./app-data-source"
import apiV1 from "./routes/v1"
import { TIMEZONE } from "./utils/constants"
import { Settings } from "luxon";
import http from 'http';
import { WebSocketServer } from 'ws'

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
const server = http.createServer(app);

const wss = new WebSocketServer({ server: server });
wss.on('connection', (ws) => {
  console.log('Nuevo cliente conectado');
  ws.on('message', (data) => {
    const message = JSON.parse(data.toString("utf8"));
    if (message.event === 'connectionInfo') {

    }
    else if (message.event === 'startSchedule') {
      
    }
    else if (message.event === 'requestScheduleChange') {

    }
  });
});

// Permitir todas las conexiones
wss.on('headers', (headers, req) => {
    headers.push('Access-Control-Allow-Origin: *');
    headers.push('Access-Control-Allow-Headers: Content-Type');
});

app.use("/api/v1", apiV1)

// start express server
app.listen(3000, () => {
    Settings.defaultZoneName = TIMEZONE;
    console.log(`Server running on http://localhost:3000`);
})