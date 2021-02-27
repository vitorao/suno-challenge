import { timeRulesRoutesControllers } from '../../controllers/timeRules/ITimeRulesRoutes';

export type AllControllers = timeRulesRoutesControllers;

export interface RouteDefinition {
  path: string;
  requestMethod: 'get' | 'post' | 'delete' | 'patch' | 'put';
  methodName: AllControllers
}
