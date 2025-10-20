import { Request, Response } from "express";
import * as artistService from "../services/artistService";

export const getArtists = async (req: Request, res: Response) => {
  const artists = await artistService.getAllArtists();
  res.json(artists);
};

export const createArtist = async (req: Request, res: Response) => {
  const artist = await artistService.createArtist(req.body);
  res.json(artist);
};
