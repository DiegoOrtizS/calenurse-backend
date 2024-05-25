import express, { Response } from "express";
import { CustomRequest } from "../../../types/custom_request";
import { myDataSource } from "../../../app-data-source";
import { Area } from "../../../entity";

const router = express.Router();


router.get('/all', async (req: CustomRequest<{}, {}>, res: Response) => {
    try {
      const areaRepository = myDataSource.getRepository(Area)
      const areas = await areaRepository.find()
      res.json(areas)
  
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: 'INTERNAL_SERVER_ERROR' });
    }
});
export default router;