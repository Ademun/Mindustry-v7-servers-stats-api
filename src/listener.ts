import { createSocket } from 'dgram';
import { IServerListInfo, IServerListener, IServerListenerData } from './ts/types';

export const generateServerListener = (server: IServerListInfo): IServerListener => {
  const requestBuffer = Buffer.from([-2, 1]);
  const socket = createSocket('udp4');
  return {
    getData: async (): Promise<IServerListenerData> => {
      socket.send(requestBuffer, server.port, server.ip, () => {});

      const response = await new Promise((resolve, reject) => {
        socket.once('message', resolve);
        setTimeout(() => {
          socket.removeAllListeners('message');
          reject('Timeout');
          return {
            address: `${server.ip}:${server.port}`,
            group: server.group,
          };
        }, 10000);
      }).catch(err => err);

      if (!(response instanceof Buffer)) {
        return {
          address: `${server.ip}:${server.port}`,
          group: server.group,
        };
      }
      const decodingGenerator = decodeDataGenerator(response);

      return {
        address: `${server.ip}:${server.port}`,
        group: server.group,
        serverName: decodingGenerator.next('string'),
        snapshot: {
          mapName: decodingGenerator.next('string'),
          players: decodingGenerator.next('int'),
          wave: decodingGenerator.next('int'),
          timestamp: roundDate(new Date()).getTime(),
        },
        build: decodingGenerator.next('int'),
        versionType: decodingGenerator.next('string'),
        gameMode: decodingGenerator.next('byte'),
        playerLimit: decodingGenerator.next('int'),
        description: decodingGenerator.next('string'),
        modeName: decodingGenerator.next('string'),
      };
    },
  };
};

const decodeDataGenerator = (buffer: Buffer) => {
  let unmutBuffer = Buffer.alloc(buffer.length);
  buffer.copy(unmutBuffer);

  return {
    next: <T extends 'string' | 'int' | 'byte'>(nextType: T): T extends 'string' | 'byte' ? string : number => {
      const dataView = new DataView(new Int8Array(unmutBuffer).buffer);
      if (nextType === 'string') {
        const dataLength = unmutBuffer.readInt8(0);
        const dataBuffer = Buffer.alloc(dataLength);
        unmutBuffer.copy(dataBuffer, 0, 1, dataLength + 1);
        unmutBuffer = unmutBuffer.slice(dataLength + 1);
        return dataBuffer.toString() as any;
      } else if (nextType === 'int') {
        unmutBuffer = unmutBuffer.slice(4);
        return dataView.getInt32(0) as any;
      } else {
        unmutBuffer = unmutBuffer.slice(1);
        const gamemode = dataView.getInt8(0);
        return gamemode === 0
          ? ('survival' as any)
          : gamemode === 1
          ? ('sandbox' as any)
          : gamemode === 2
          ? ('attack' as any)
          : gamemode === 3
          ? ('pvp' as any)
          : ('editor' as any);
      }
    },
  };
};

const roundDate = (date: Date) => {
  const time = 60 * 60 * 1000;
  return new Date(Math.round(date.getTime() / time) * time);
};
