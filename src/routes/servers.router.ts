import express, { Request, Response } from 'express';
import { ServerModel } from '../models/ServerModel';
import { getServer, getServers } from '../controllers/servers.controller';

const router = express.Router();

router.get('/all', getServers);

router.get('/:ip', getServer);

export default router;
