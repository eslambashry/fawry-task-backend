import { Router } from 'express';
import { 
    createUser, 
    getAllUsers, 
    getUserById, 
} from './customer.controller.js';

const customerRouter = Router();


customerRouter.post('/create', createUser);
customerRouter.get('/', getAllUsers);
customerRouter.get('/:id', getUserById);

 

export default customerRouter;
