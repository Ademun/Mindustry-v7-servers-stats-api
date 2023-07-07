interface IServerListData {
  name: string;
  address: string[];
}

interface IServerListEntry {
  group: string;
  ip: string;
  port: number;
}

interface IServerListener {
  getData(): Promise<IServer>;
}

interface IServer {
  address: string;
  group: string;
  name: string;
  snapshot?: IServerSnapshot;
  build: number;
  version: string;
  gamemode: string;
  limit: number;
  description: string;
  mode: string;
}

interface IServerSnapshot {
  map: string;
  players: number;
  wave: number;
  timestamp: number;
}

export { IServerListData, IServerListEntry, IServerListener, IServer, IServerSnapshot };
