import { Types } from 'mongoose';
import { IServer, IServerSnapshot } from '../ts/types';
import { ServerSnapshotModel } from '../models/ServerSnapshotModel';
import { ServerModel } from '../models/ServerModel';

const createServer = async (server: Omit<IServer, 'snapshots'>) => {
  const response = await ServerModel.findOneAndUpdate({ address: server.address }, server, { upsert: true, new: true });
  return response._id;
};

const createServerSnapshot = async (parentId: Types.ObjectId, snapshot: IServerSnapshot) => {
  await ServerSnapshotModel.create(snapshot).then(async serverSnapshot => {
    await ServerModel.findByIdAndUpdate(parentId, { $push: { snapshots: serverSnapshot._id } });
  });
};

export { createServer, createServerSnapshot };
