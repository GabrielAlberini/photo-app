import { IUser } from '../../models/User';  // ajusta la ruta a donde tengas tu interfaz/modelo

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}