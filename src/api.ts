import express, { Request, Response } from 'express';
import 'dotenv/config';
import cors from 'cors';
import axios from 'axios';
import { generateServerListener } from './listener';
import { IServerListData, IServerListener } from './ts/types';
import mongoose from 'mongoose';
import { ServerModel } from './db/models/ServerModel';
import { createServer, createServerSnapshot } from './db/utils';

const port = process.env.PORT!;

const app = express();
app.use(cors());

app.listen(port, async () => {
  await mongoose.connect(process.env.MONGODB_CON!);
  console.log(`App running on http://localhost:${port}`);
});

app.get('/servers', async (req: Request<{}, {}, {}, { ip: string }>, res: Response) => {
  const exclude = {
    _id: 0,
    __v: 0,
    expiresAt: 0,
  };
  const ip = req.query.ip;
  if (ip) {
    const result = await ServerModel.findOne({ address: ip }, { _id: 0, __v: 0 }).populate('snapshots', exclude);
    res.json(result);
  } else {
    const result = await ServerModel.find({}, { _id: 0, __v: 0 }).populate('snapshots', exclude);
    res.json(result);
  }
});

const fetchServerList = async () => {
  const ipList = await axios
    .get<IServerListData[]>('https://raw.githubusercontent.com/Anuken/Mindustry/master/servers_v7.json')
    .then(response => response.data);
  const serverList = ipList.flatMap(server => server.address.map(address => ({ group: server.name, address })));
  await Promise.all(
    serverList.map(async serverData => {
      const [ip, port = 6567] = serverData.address.split(':');
      const listener = generateServerListener({ group: serverData.group, ip, port: Number(port) });
      await updateDb(listener);
      setInterval(async () => await updateDb(listener), 1000 * 60 * 60);
    })
  );
};

fetchServerList();

const updateDb = async (listener: IServerListener) => {
  const data = await listener.getData();
  const { snapshot, ...info } = data;
  const serverId = await createServer(info);
  if (snapshot) await createServerSnapshot(serverId, snapshot);
};
