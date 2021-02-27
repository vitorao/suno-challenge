import * as fs from 'fs';
import * as path from 'path';

export default class TimeRulesModel {
  private databaseFileName = path.join(__dirname, '..', 'models','database.json');
  private modelReference = 'rules';

  private async getFileData(): Promise<string> {
    return new Promise((resolve, reject) => {
      fs.readFile(this.databaseFileName, (err, fsData) => {
        if (err) reject(err);

        resolve(fsData.toString());
      });
    });
  }

  private async addToDB(data: Object) {
    const dbData = await this.getFileData();

    const databaseValues = JSON.parse(dbData);
    databaseValues[this.modelReference].push(data);
    
    fs.writeFile(this.databaseFileName, JSON.stringify(databaseValues), err => {
      if(err) throw new Error('Error on save file')
    });
  }

  public inserTimeRule(timeRules: ITimeRules) {
    this.addToDB(timeRules);
  }
}

interface IIntervals {
  start: string,
  end: string
}

type TypeRules = "weekly" | "daily" | "unique";
type DaysOfWeek = "monday" | "tuesday" | "wendnesday" | "thursday" | "Friday" | "Saturday" | "sunday"

interface ITimeRules {
  intervals: IIntervals[],
  type: TypeRules,
  date: Date,
  daysOfWeek: DaysOfWeek[] | null,
}
