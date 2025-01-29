import express from 'express';
import { MongoHallRepository } from '../../infrastructure/database/MongoHallRepository';
import { HallController } from '../controllers/HallController';
import { HallUseCase } from '../../application/usecases/HallUseCase';
import { upload, uploadImageArrayToCloudinary } from '../../infrastructure/middlewares/uploadImageToCloudinary';

const router = express.Router();

// Initialize dependencies
const hallRepository = new MongoHallRepository();
const hallUseCase = new HallUseCase(hallRepository);
const hallController = new HallController(hallUseCase);

// Define routes
router.post('/create',(req, res, next) => {
    upload.array('images', 5)(req, res, err => {
      if (err) {
        console.error('Multer error:', err);
        return res.status(400).send({ error: 'File upload failed' });
      }
      next();
    });
  }, uploadImageArrayToCloudinary,(req, res, next) => hallController.createHall(req, res, next));
router.put('/update/:id', (req, res, next) => hallController.updateHall(req, res, next));
router.delete('/delete/:id', (req, res, next) => hallController.deleteHall(req, res, next));

router.get('/', (req, res, next) => hallController.getAllHalls(req, res, next));
router.get('/:id', (req, res, next) => hallController.getHallById(req, res, next));

router.get('/available', (req, res, next) => hallController.getAvailableHalls(req, res, next));

export default router;