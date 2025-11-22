import { Router } from 'express';
import {
  getAllInventory,
  getInventoryByProduct,
  updateInventory,
  addInventoryMovement,
  getInventoryMovements,
  getLowStockProducts
} from '../controllers/inventoryController';

const router = Router();

router.get('/', getAllInventory);
router.get('/low-stock', getLowStockProducts);
router.get('/product/:productId', getInventoryByProduct);
router.put('/product/:productId', updateInventory);
router.post('/movements', addInventoryMovement);
router.get('/movements', getInventoryMovements);
router.get('/movements/:productId', getInventoryMovements);

export default router;
