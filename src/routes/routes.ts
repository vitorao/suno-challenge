import { Request, Response } from 'express';
import TimeRulesController from '../controllers/timeRules/timeRulesController';

import { RouteDefinition } from '../decorators/types/routeDefinition';

export default class Routes {

  constructor(app: any){
    [
      TimeRulesController,
    ].forEach(controller => {
      const instance = new controller();
      const prefix = Reflect.getMetadata('prefix', controller);
      const routes: Array<RouteDefinition> = Reflect.getMetadata('routes', controller);

      routes.forEach(route => {
        app[route.requestMethod](prefix + route.path, (req: Request, res: Response) => {
          instance[route.methodName](req, res);
        });
      });
    });
  }
}
