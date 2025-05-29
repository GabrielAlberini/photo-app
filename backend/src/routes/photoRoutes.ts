import { Router } from 'express';
import {
  createPhoto,
  getAllPhotos,
  updatePhoto,
  deletePhoto,
  uploadMiddleware
} from '../controllers/photoController';
import { protect } from '../middleware/authMiddleware'; // tu middleware que añade req.user

const router = Router();

router.use(protect);               // todas requieren auth
router.get('/', getAllPhotos);
router.post('/', uploadMiddleware, createPhoto);
router.put('/:id', updatePhoto);
router.delete('/:id', deletePhoto);

export default router;
