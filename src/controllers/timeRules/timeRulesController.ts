import { Controller } from '../../decorators/controller';
import { Get, Post, Delete } from '../../decorators/methods';
import { Request, Response } from 'express';
import TimeRulesModel, { ITimeRules } from '../../models/timeRules/timeRules';
import { CheckTimeConflict } from './checkTimeConflicts';

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
          return res.status(409).json({ message: "Your time rule generate a conflict with a existing rule" });
        }

        const ruleId = await this.timeRulesModel.inserTimeRule({...rule});
        return res.json({ id: ruleId });
      });

    } catch (error) {
      return res.status(400).send('Bad request');
    }
  }

  @Delete('/:id')
  public async deleteTimeRule(req: Request, res: Response) {
    try {
      const id = req.params.id;

      if(!id) {
        return res.status(400).json({ message: "missing param id" });
      }

      const success = await this.timeRulesModel.deleteTimeRule(id);
      return res.json({ success });
    } catch (error) {
      return res.status(400).send('Bad request');
    }
  }

  @Get('/')
  public async listAllTimeRules(_req: Request, res: Response) {
    const rules = await this.timeRulesModel.listAllTimeRules();
    return res.json(rules);
  }

  @Get('/availables')
  public async listAvailableTimeRules(req: Request, res: Response) {
    const start = JSON.stringify(req.query.start);
    const end = JSON.stringify(req.query.end);

    if(!start || !end) {
      return res.status(400).json({ message: "missing param start or end" });
    }

    const availableList = await this.timeRulesModel.listAvailableTimeRules(start, end);
    return res.json(availableList);
  }
}
