import { Controller } from '../../decorators/controller';
import { Get, Post, Delete } from '../../decorators/methods';
import { Request, Response } from 'express';
import TimeRulesModel from '../../models/timeRules';

@Controller('/rules')
export default class TimeRulesController {

  constructor(private timeRulesModel: TimeRulesModel) {}

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
    this.timeRulesModel.inserTimeRule({
      type: 'daily',
      date: new Date,
      intervals: [{
        start: "00:00",
        end: "10:00",
      }],
      daysOfWeek: null,
    });
    return res.send('listAllTimeRules');
  }

  @Get('/availables')
  public listAvailableTimeRules(_req: Request, res: Response) {
    return res.send('listAvailableTimeRules');
  }
}
