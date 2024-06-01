import express, { Response } from "express";
import { CustomRequest } from "../../../types/custom_request";
import { myDataSource } from "../../../app-data-source";
import { Area } from "../../../entity";
import { GetAreaNursesParams } from "./dto";
import { Equal, Not } from "typeorm";

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

router.get('/nurses', async (req: CustomRequest<{}, GetAreaNursesParams>, res: Response) => {
  try {
    const { area_id, user_id } = req.query;

    const areaRepository = myDataSource.getRepository(Area)
    const area = await areaRepository.findOne(
      {
        where : {
          id: Equal(area_id),
          nurses: {
            isBoss: Equal(false),
            id: Not(user_id)
          }
        },
        relations: ['nurses'],
      }
    )
    const nurses = area.nurses.map(nurse => ({ id: nurse.id, name: nurse.name }));
     
    res.json(nurses)

  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'INTERNAL_SERVER_ERROR' });
  }
});
export default router;