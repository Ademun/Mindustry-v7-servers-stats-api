import { RequestHandler } from 'express';
import { ServerModel } from '../models/ServerModel';

const exclude = {
  _id: 0,
  __v: 0,
  expiresAt: 0,
};

const getServers: RequestHandler<unknown, unknown, unknown, { group: string; limit: number }> = async (req, res) => {
  const { group, limit } = req.query;
  const result = await ServerModel.find(group ? { group: group } : {}, exclude).populate({
    path: 'snapshots',
    select: exclude,
    perDocumentLimit: limit,
  });
  res.json(result);
};

const getServer: RequestHandler<{ ip: string }, unknown, unknown, { limit: number }> = async (req, res) => {
  const ip = req.params.ip;
  const limit = req.query.limit;
  const result = await ServerModel.findOne({ address: ip }, exclude).populate({
    path: 'snapshots',
    select: exclude,
    perDocumentLimit: limit,
  });
  res.json(result);
};

export { getServers, getServer };
