import { Router } from 'express';
import * as controller from '../controllers/product.controller';

export const productRouter = Router();

productRouter.get('/', controller.getAll);
productRouter.get('/:id', controller.getById);
productRouter.post('/', controller.create);
productRouter.put('/:id', controller.update);
productRouter.delete('/:id', controller.remove);
