import express from "express"
import { myDataSource } from "./app-data-source"
import apiV1 from "./routes/v1"
import { TIMEZONE } from "./utils/constants"
import { Settings } from "luxon";
import http from 'http';
import cors from "cors"
import { WebSocketServer, WebSocket } from 'ws'
import serverless from 'serverless-http';
import { loadDefaultValuesIfNeeded } from "./fixtures";


// establish database connection
myDataSource
    .initialize()
    .then((r) => {
        console.log("Data Source has been initialized!")
        return r.synchronize()
    })
    .then((r) => {
        console.log("Data Source has been synchronized!")
        return loadDefaultValuesIfNeeded()
    })
    .then(() => {
        console.log("Valores por defecto cargados correctamente (si era necesario)");
    })
    .catch((err) => {
        console.error("Error during Data Source initialization:", err)
    })

// create and setup express app
const app = express()
app.use(express.json())
app.use(cors())
const server = http.createServer(app);

const wss = new WebSocketServer({ server: server });
interface Client {
    ws: WebSocket;
    isBoss: boolean;
  }
  
const clients = new Map<string, Client>();

wss.on('connection', (ws: WebSocket, req: http.IncomingMessage) => {
    const queryParams = new URLSearchParams(req.url.split('?')[1]);
    const nurseId = queryParams.get('nurseId');
    const isBoss = queryParams.get('isBoss') === 'true'; // Assuming isBoss is a boolean in the URL

    // Set additional properties for the connected client
    const local_client: Client = { ws, isBoss };

    // Add the client to the object using nurseId as the key
    clients.set(nurseId!, local_client);

    console.log(`Nuevo cliente conectado - Nurse ID: ${nurseId}, isBoss: ${isBoss}`);

    ws.on('message', (data) => {
        const message = JSON.parse(data.toString("utf8"));

        if (message.event === 'startSchedule') {
            ws.send(JSON.stringify({ event: 'startSchedule', data: message.data }));
        }
        else if (message.event === 'createSchedule' || message.event === 'requestScheduleChange') {
            clients.forEach((client: Client) => {
                if (client.isBoss) {
                    client.ws.send(JSON.stringify({ event: message.event, data: message.data }));
                }
            });
        }
        else if (message.event === "scheduleAccepted" || message.event === "scheduleRejected") {
            const client = clients.get(message.data.nurseId);
            if (client) {
                client.ws.send(JSON.stringify({ event: message.event, data: message.data }));
            }
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

module.exports.handler = serverless(app);
