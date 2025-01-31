import express from 'express';
import { QRCodeController } from '../controllers/QRCodeController';
import { MongoQRCodeRepository } from '../../infrastructure/database/MongoQRCodeRepository';
import { QRCodeUseCase } from '../../application/usecases/QRCodeUseCase';

const router = express.Router();
const qrRepository = new MongoQRCodeRepository();
const qrUseCases = new QRCodeUseCase(qrRepository);
const qrController = new QRCodeController(qrUseCases);

router.post('/generate', (req, res) => qrController.generateQRCode(req, res));
router.get('/verify/:token', (req, res) => qrController.verifyQRCode(req, res));
router.get('/:id', (req, res) => qrController.getToken(req, res));

export default router;