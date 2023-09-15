import express from 'express';
import cors from 'cors';

import { decoratorParams } from './middlewares';
import { isAliveHandler, isReadyHandler } from './handlers/livenessHandlers';
import {
  driftsmeldingerHandler,
  searchHandler,
  menuHandler,
} from './handlers/serviceHandlers';
import { dataHandlers, inspectData } from './handlers/dataHandlers';
import {
  mockAuthHandler,
  mockLoginHandler,
  mockLogoutHandler,
  mockSessionHandler,
  refreshMockSessionHandler,
} from './handlers/mockHandlers';
import {
  footerHandler,
  headerHandler,
  indexHandler,
} from './handlers/domHandlers';
import { env } from './env/server';

const port = env.PORT || 8089;
const app = express();

console.log(port);

// Setup middleware
app.use(cors());
app.use(express.static('public'));
app.use(decoratorParams);

// Liveness and mock handlers
app.use('/api/isReady', isReadyHandler);
app.use('/api/isAlive', isAliveHandler);
app.use('/api/auth', mockAuthHandler);
app.get('/api/oauth2/session', mockSessionHandler);
app.get('/api/oauth2/session/refresh', refreshMockSessionHandler);

app.get('/oauth2/login', mockLoginHandler);
app.get('/oauth2/logout', mockLogoutHandler);

// Service handlers
app.use('/api/sok', searchHandler);
app.use('/api/menu', menuHandler);
app.use('/api/driftsmeldinger', driftsmeldingerHandler);

// Data handlers
app.use('/data/inspect-data', inspectData);
app.get('/data/:key', dataHandlers);

// DOM handlers
app.use('/footer', footerHandler);
app.use('/header', headerHandler);
//app.use(assetsHandler);
app.use('/', indexHandler);

app.listen(port, function () {
  console.log(`
  Decorator server started:
  Environment: ${process.env.NODE_ENV}
  Listening on http://localhost:${port}`);
});
