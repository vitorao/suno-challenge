import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import * as moment from 'moment';

export default class TimeRulesModel {

  constructor() {}

  private listOfdaysOfWeek = ["sunday", "monday", "tuesday", "wendnesday", "thursday", "friday", "saturday"];
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

  private async updateTimeRules(data: ITimeRules[]) {
    fs.writeFile(this.databaseFileName, JSON.stringify({rules: data}), err => {
      if(err) throw new Error('Error on save file')
    });
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

  public async deleteTimeRule(ruleId: string): Promise<Boolean> {
    const databaseValues = await this.getFileData();
    const ruleIndex = databaseValues.rules
      .map((rule, index) => ruleId === rule.id ? index : null)
      .filter(index => index || index === 0)[0];

    if(ruleIndex) {
      databaseValues.rules.splice(ruleIndex, 1);
      await this.updateTimeRules(databaseValues.rules);
      return true;
    }

    return false;
  }

  public async listAllTimeRules(): Promise<ITimeRules[]> {
    const databaseValues = await this.getFileData();
    return databaseValues.rules;
  }

  private listUniqueRule(rule: ITimeRules, start: moment.Moment, end: moment.Moment): ITimeRulesResponse[] {
    let timeRulesUnique: ITimeRulesResponse[] = [];
    const isBetweenDates = moment(rule.date, "DD-MM-YYYY").isBetween(start, end, 'day', "[]");
    
    if(rule.type === 'unique' && isBetweenDates) {
      timeRulesUnique.push({
        day: rule.date,
        intervals: rule.intervals
      });
    }
    
    return timeRulesUnique;
  }

  private listDailyRule(rule: ITimeRules, start: moment.Moment, end: moment.Moment): ITimeRulesResponse[] {
    let timeRulesDaily: ITimeRulesResponse[] = [];

    const daysBetweenDays = moment(end).diff(start, 'days');
    for(let n = 0; n < daysBetweenDays; n++) {
      const nextDay = moment(start, "DD-MM-YYYY").add(n, 'days').format("DD-MM-YYYY");
      timeRulesDaily.push({
        day: nextDay,
        intervals: rule.intervals
      });
    }

    return timeRulesDaily;
  }

  private listWeeklyRule(rule: ITimeRules, start: moment.Moment, end: moment.Moment): ITimeRulesResponse[] {
    let timeRulesWeekly: ITimeRulesResponse[] = [];
    const daysBetweenDays = moment(end).diff(start, 'days');

    for(let n = 0; n < daysBetweenDays; n++) {
      const nextDay = moment(start, "DD-MM-YYYY").add(n, 'days').format("DD-MM-YYYY");
      const weekday = moment(nextDay, "DD-MM-YYYY").weekday();
      const hasDayOfWeek = rule.daysOfWeek && !!rule.daysOfWeek.filter(day => 
        this.listOfdaysOfWeek[weekday] === day).length; 
      
      if(hasDayOfWeek) {
        timeRulesWeekly.push({
          day: nextDay,
          intervals: rule.intervals
        });
      }
    }

    return timeRulesWeekly;
  }

  public async listAvailableTimeRules(start: string, end: string): Promise<ITimeRulesResponse[]> {
    const databaseValues = await this.getFileData();
    let timeRulesResponse: any = [];
    const momentStart = moment(start, "DD-MM-YYYY");
    const momentEnd = moment(end, "DD-MM-YYYY");

    databaseValues.rules.map(rule => {
      switch(rule.type) {
        case 'unique':
          const uniqueList = this.listUniqueRule(rule, momentStart, momentEnd);
          timeRulesResponse = timeRulesResponse.concat(uniqueList);
          break;
        case 'daily':
          const dailyList = this.listDailyRule(rule, momentStart, momentEnd);
          timeRulesResponse = timeRulesResponse.concat(dailyList);
          break;
        case 'weekly':
          const weeklyList = this.listWeeklyRule(rule, momentStart, momentEnd);
          timeRulesResponse = timeRulesResponse.concat(weeklyList);
          break;
      }
    });

    return timeRulesResponse;
  }
}

export interface IIntervals {
  start: string,
  end: string
}

type TypeRules = "weekly" | "daily" | "unique";
type DaysOfWeek = "monday" | "tuesday" | "wendnesday" | "thursday" | "friday" | "saturday" | "sunday";

export interface ITimeRules {
  id: string,
  intervals: IIntervals[],
  type: TypeRules,
  date: string,
  daysOfWeek: DaysOfWeek[] | null,
}

interface ITimeRulesResponse {
  day: string,
  intervals: IIntervals[],
}