import express from 'express';
import { QRCodeController } from '../controllers/QRCodeController';
import { QRCodeService } from '../../infrastructure/services/QRCodeService';

const router = express.Router();
const secretKey = process.env.SECRET_KEY || 'default-secret-key';
const qrCodeService = new QRCodeService(secretKey);
const qrCodeController = new QRCodeController(qrCodeService);

router.post('/generate-qr', (req, res, next) => qrCodeController.generateQRCode(req, res, next));
router.post('/verify-qr', (req, res, next) => qrCodeController.verifyQRCode(req, res, next));

export default router;