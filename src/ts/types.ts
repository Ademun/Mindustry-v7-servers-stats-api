interface IServerListData {
  name: string;
  address: string[];
}

interface IServerListInfo {
  group: string;
  ip: string;
  port: number;
}

interface IServerListener {
  getData(): Promise<IServerListenerData>;
}

interface IServerListenerData extends IServerListenerInfo {
  snapshot?: IServerListenerSnapshot;
}

interface IServerListenerInfo {
  address: string;
  group: string;
  serverName?: string;
  build?: number;
  versionType?: string;
  gameMode?: string;
  playerLimit?: number;
  description?: string;
  modeName?: string;
}

interface IServerListenerSnapshot {
  mapName: string;
  players: number;
  wave: number;
  timestamp: number;
}

export { IServerListData, IServerListInfo, IServerListener, IServerListenerData, IServerListenerInfo, IServerListenerSnapshot };
