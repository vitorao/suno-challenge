import { userRoutesControllers } from '../../controllers/userControllers/IUserRoutes';

export type AllControllers = userRoutesControllers;

export interface RouteDefinition {
  path: string;
  requestMethod: 'get' | 'post' | 'delete' | 'patch' | 'put';
  methodName: AllControllers
}
