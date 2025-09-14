import express, { Router } from 'express';
import AuthController from '../controller/auth.controller';

class AuthRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post('/login', AuthController.login);
    this.router.post('/signup', AuthController.register);
  }


  public getRouter(): Router {
    return this.router;
  }
}

export default AuthRoutes;
