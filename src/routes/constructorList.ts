import TimeRulesModel from "../models/timeRules";

export const controllerList: IConstructorList = {
  'TimeRulesController': new TimeRulesModel()
}

export const constructorList = (type: string) => {
  switch(type) {
    case 'TimeRulesController':
      return controllerList.TimeRulesController;
    default:
      throw new Error('Constructor was not declared');
  }
}

type IConstructorList = {
  TimeRulesController: TimeRulesModel;
}