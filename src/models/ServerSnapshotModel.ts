import mongoose from 'mongoose';

const ServerSnapshotSchema = new mongoose.Schema(
  {
    mapName: String,
    players: Number,
    wave: Number,
    timestamp: Number,
    expiresAt: {
      type: Date,
      default: () => new Date(new Date().getTime() + 604800000),
    },
  },
  { collection: 'servers_snapshots' }
);

const ServerSnapshotModel = mongoose.model('ServerSnapshotModel', ServerSnapshotSchema);
export { ServerSnapshotModel };
