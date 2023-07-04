import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import axios from 'axios';
import { generateServerListener } from './listener';
import { IServerListData, IServerListener } from './ts/types';
import mongoose from 'mongoose';
import { createServer, createServerSnapshot } from './services/servers';
import router from './routes/servers.router';

const port = process.env.PORT!;

const app = express();
app.use(cors());

app.listen(port, async () => {
  await mongoose.connect(process.env.MONGODB_CON!).catch(err => console.log(err));
  console.log(`App running on port:${port}`);
});

app.use('/servers', router);

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
