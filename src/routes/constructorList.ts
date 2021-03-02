import CheckTimeConflict from "../models/timeRules/checkTimeConflicts";
import TimeRulesModel from "../models/timeRules/timeRules";

export const constructorList = (type: string, controller: any) => {
  switch(type) {
    case 'TimeRulesController':
      return new controller(new TimeRulesModel(), new CheckTimeConflict())
    default:
      throw new Error('Constructor was not declared');
  }
}
