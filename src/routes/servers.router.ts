import express from 'express';
import { getServer, getServers } from '../controllers/servers.controller';

const router = express.Router();

router.get('/all', getServers);

router.get('/:ip', getServer);

export default router;
