import express from 'express';
import { AppDataSource } from './data-source';
import * as UserController from './controller/UserController';
import * as ScheduleController from './controller/ScheduleController';
import * as RequirementsController from './controller/RequirementsController';
import { TIMEZONE } from './utils/constants';
import { Settings } from "luxon";

AppDataSource.initialize().then(() => {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // User routes
  app.post('/users', UserController.createUser);
  app.get('/users', UserController.getAllUsers);
  app.get('/users/:id', UserController.getUser);
  app.put('/users/:id', UserController.updateUser);
  app.delete('/users/:id', UserController.deleteUser);

  // Nurse Schedule routes
  app.post('/nurse-schedules', ScheduleController.createSchedule);
  app.get('/nurse-schedules', ScheduleController.getAllSchedules);
  app.get('/nurse-schedules/:id', ScheduleController.getSchedules);
  app.put('/nurse-schedules/:id', ScheduleController.updateSchedule);
  app.delete('/nurse-schedules/:id', ScheduleController.deleteSchedule);

  // Nurse Requirements routes
  app.post('/nurse-requirements', RequirementsController.createRequirement);
  app.get('/nurse-requirements', RequirementsController.getAllRequirements);
  app.get('/nurse-requirements/:id', RequirementsController.getRequirements);
  app.put('/nurse-requirements/:id', RequirementsController.updateRequirement);
  app.delete('/nurse-requirements/:id', RequirementsController.deleteRequirement);

  // Root endpoint
  app.get('/', (req, res) => res.send('Nurse Scheduling API Root'));

  // Start the server
  app.listen(PORT, () => {
    Settings.defaultZoneName = TIMEZONE;
    console.log(`Server running on http://localhost:${PORT}`);
  });
}).catch(error => console.log('Error during Data Source initialization', error));
