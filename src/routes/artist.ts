import { Router } from "express";
import * as artistController from "../controllers/artistController";

const router = Router();
router.get("/", artistController.getArtists);
router.post("/", artistController.createArtist);

export default router;
