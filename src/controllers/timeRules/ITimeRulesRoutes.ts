import { strEnum } from '../../decorators/utils';

const timeRulesRoutesControllers = strEnum([
  'insertTimeRule',
  'deleteTimeRule',
  'listAllTimeRules',
  'listAvailableTimeRules',
]);

export type timeRulesRoutesControllers = keyof typeof timeRulesRoutesControllers;
