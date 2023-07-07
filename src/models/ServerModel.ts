import mongoose, { Types } from 'mongoose';

const ServerSchema = new mongoose.Schema(
  {
    address: String,
    group: String,
    name: String,
    snapshots: [
      {
        type: Types.ObjectId,
        ref: 'ServerSnapshotModel',
      },
    ],
    build: Number,
    version: String,
    gamemode: String,
    limit: Number,
    description: String,
    mode: String,
  },
  { collection: 'servers' }
);

const ServerModel = mongoose.model('ServerModel', ServerSchema);
export { ServerModel };
