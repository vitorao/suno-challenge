import { Controller } from '../../decorators/controller';
import { Get, Post, Delete } from '../../decorators/methods';
import { Request, Response } from 'express';
import TimeRulesModel, { ITimeRules } from '../../models/timeRules/timeRules';
import CheckTimeConflict from '../../models/timeRules/checkTimeConflicts';

@Controller('/rules')
export default class TimeRulesController {

  constructor(
    private timeRulesModel: TimeRulesModel,
    private checkTimeConflict: CheckTimeConflict
  ) {}

  @Post('/')
  public async insertTimeRule(req: Request, res: Response) {
    try {
      const { body: requestData } = req;

      requestData.forEach(async (rule: ITimeRules) => {
        const { rules } = await this.timeRulesModel.getFileData();
        const conflicted = this.checkTimeConflict.check(rules, rule);

        if(conflicted) {
          return res.json({ message: "Your time rule generate a conflict with a existing rule" }).sendStatus(409);
        }

        const ruleId = await this.timeRulesModel.inserTimeRule({...rule});
        return res.json({ id: ruleId });          
      });

    } catch (error) {
      return res.send('Bad request').sendStatus(400);  
    }
  }

  @Delete('/:id')
  public async deleteTimeRule(req: Request, res: Response) {
    try {
      const id = req.params.id;

      if(!id) {
        return res.json({ message: "missing param id" }).sendStatus(400);   
      }

      const success = await this.timeRulesModel.deleteTimeRule(id);
      res.json({ success });
    } catch (error) {
      return res.send('Bad request').sendStatus(400);  
    }
  }

  @Get('/')
  public async listAllTimeRules(_req: Request, res: Response) {
    const rules = await this.timeRulesModel.listAllTimeRules();
    res.json(rules);
  }

  @Get('/availables')
  public listAvailableTimeRules(_req: Request, res: Response) {
    return res.send('listAvailableTimeRules');
  }
}
