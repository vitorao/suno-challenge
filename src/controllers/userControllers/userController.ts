import { Controller } from '../../decorators/controller';
import { Get, Post, Patch, Put, Delete } from '../../decorators/methods';
import { Request, Response } from 'express';

@Controller('/user')
export default class UserController {
  @Get('/')
  public index(_req: Request, res: Response) {
    return res.send('User overview');
  }

  @Post('/new')
  public setUser(req: Request, res: Response) {
    return res.send(`You are registering a new user: ${JSON.stringify(req.body)}`);
  }

  @Patch('/update/:id')
  public updateUser(req: Request, res: Response) {
    return res.send(`You are updating a user ${req.params.id}`);
  }

  @Put('/replace/:id')
  public replaceUser(req: Request, res: Response) {
    return res.send(`You are replacing user ${req.params.id}`);
  }

  @Delete('/delete/:id')
  public removeUser(req: Request, res: Response) {
    return res.send(`You are removing at the profile of ${req.params.id}`);
  }
}
