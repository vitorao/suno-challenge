import { strEnum } from '../../decorators/utils';

const userRoutesControllers = strEnum([
  'index',
  'setUser',
  'updateUser',
  'replaceUser',
  'removeUser',
])

export type userRoutesControllers = keyof typeof userRoutesControllers;
