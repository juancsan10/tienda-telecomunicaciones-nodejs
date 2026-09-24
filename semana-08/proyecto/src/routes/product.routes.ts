import { Router } from 'express';
import { getAll, getById, create, update, remove } from '../controllers/product.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/requireRole.js';

const router = Router();

// Política de acceso — tienda de telecomunicaciones:
// el catálogo es público (cualquiera puede ver planes/dispositivos sin cuenta),
// pero crear, editar y eliminar requieren autenticación.

// GET — público: cualquiera puede ver el catálogo
router.get('/', getAll);
router.get('/:id', getById);

// POST — crear producto requiere autenticación
router.post('/', authMiddleware, create);

// PATCH — actualizar: autenticado (service verifica si es dueño o admin)
router.patch('/:id', authMiddleware, update);

// DELETE — eliminar: solo admin
router.delete('/:id', authMiddleware, requireRole('admin'), remove);

export default router;
