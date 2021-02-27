import { Controller } from '../../decorators/controller';
import { Get, Post, Delete } from '../../decorators/methods';
import { Request, Response } from 'express';

@Controller('/rules')
export default class TimeRulesController {
  @Post('/')
  public insertTimeRule(_req: Request, res: Response) {
    return res.send('insertTimeRule');
  }

  @Delete('/:id')
  public deleteTimeRule(_req: Request, res: Response) {
    return res.send('deleteTimeRule');
  }

  @Get('/')
  public listAllTimeRules(_req: Request, res: Response) {
    return res.send('listAllTimeRules');
  }


  @Get('/availables')
  public listAvailableTimeRules(_req: Request, res: Response) {
    return res.send('listAvailableTimeRules');
  }
}
