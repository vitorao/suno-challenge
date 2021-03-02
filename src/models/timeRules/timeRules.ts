import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

export default class TimeRulesModel {

  constructor() {}

  private databaseFileName = path.join(__dirname, '..','database.json');

  public async getFileData(): Promise<{ rules: ITimeRules[] }> {
    return new Promise((resolve, reject) => {
      fs.readFile(this.databaseFileName, (err, fsData) => {
        if (err) reject(err);
        resolve(JSON.parse(fsData.toString()));
      });
    });
  }

  private async addToDB(data: ITimeRules): Promise<string | null> {
    const databaseValues = await this.getFileData();
    const timeRuleId = uuidv4();

    databaseValues["rules"].push({
      ...data,
      id: timeRuleId,
    });
    
    fs.writeFile(this.databaseFileName, JSON.stringify(databaseValues), err => {
      if(err) throw new Error('Error on save file')
    });

    return timeRuleId;
  }

  public async inserTimeRule(timeRules: ITimeRules): Promise<string> {
    try {
      const id = await this.addToDB(timeRules);
      if(!id) throw new Error('Error to register rule');

      return id;
    } catch (error) {
      throw new Error('Error to save rules on DataBase')
    }
  }
}

export interface IIntervals {
  start: string,
  end: string
}

type TypeRules = "weekly" | "daily" | "unique";
type DaysOfWeek = "monday" | "tuesday" | "wendnesday" | "thursday" | "Friday" | "Saturday" | "sunday";

export interface ITimeRules {
  id: string,
  intervals: IIntervals[],
  type: TypeRules,
  date: string,
  daysOfWeek: DaysOfWeek[] | null,
}
