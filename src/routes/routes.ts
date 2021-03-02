import { Request, Response } from 'express';
import TimeRulesController from '../controllers/timeRules/timeRulesController';

import { RouteDefinition } from '../decorators/types/routeDefinition';
import { constructorList } from './constructorList';

export default class Routes {

  constructor(app: any){
    [
      TimeRulesController,
    ].forEach(controller => {
      const instance = constructorList(controller.name, controller);
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
