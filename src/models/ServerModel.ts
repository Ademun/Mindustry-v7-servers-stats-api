import mongoose, { Types } from 'mongoose';

const ServerSchema = new mongoose.Schema(
  {
    address: String,
    group: String,
    serverName: String,
    snapshots: [
      {
        type: Types.ObjectId,
        ref: 'ServerSnapshotModel',
      },
    ],
    build: Number,
    versionType: String,
    gameMode: String,
    playerLimit: Number,
    description: String,
    modeName: String,
  },
  { collection: 'servers' }
);

const ServerModel = mongoose.model('ServerModel', ServerSchema);
export { ServerModel };
