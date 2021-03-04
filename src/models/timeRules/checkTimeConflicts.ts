import * as moment from 'moment';
import { ITimeRules, IIntervals } from "./timeRules";

export default class CheckTimeConflict {
  private listOfdaysOfWeek = ["sunday", "monday", "tuesday", "wendnesday", "thursday", "friday", "saturday"];

  private checkIntervals(rule: ITimeRules, intervals: IIntervals[]): boolean {
    let hasConflict = false;

    rule.intervals.forEach(registerInterval => {
      intervals.forEach(interval => {
        const checkStartInterval = interval.start >= registerInterval.start && interval.start <= registerInterval.end;
        const checkEndInterval = interval.end >= registerInterval.start && interval.end <= registerInterval.end;

        if(checkStartInterval || checkEndInterval) {
          hasConflict = true;
        }
      });
    });

    return hasConflict;
  }

  private checkDaysOfWeek(registeredDaysOfWeek: string[], daysOfWeek: string[]) {
    const hasDayOfWeek = registeredDaysOfWeek.map(registeredDaysOfWeek => 
      !!daysOfWeek.filter(dayOfWeek => registeredDaysOfWeek === dayOfWeek).length
    ).filter(checker => checker);

    return !!hasDayOfWeek.length;
  }

  public check(registeredRules: ITimeRules[], rule: ITimeRules): Boolean {
    let hasConflict = false;

    registeredRules.forEach(registeredRule => {
      let shouldCheckUniqueRule = false;
      const isDailyRule = rule.type === 'daily';
      const isUniqueRule = rule.type === 'unique';
      const hasSameDaysOfWeek = !!rule.daysOfWeek && !!registeredRule.daysOfWeek &&
        this.checkDaysOfWeek(registeredRule.daysOfWeek, rule.daysOfWeek);

      if(isUniqueRule && registeredRule.daysOfWeek) {
        const weekday = moment(rule.date, "DD-MM-YYYY").weekday();
        shouldCheckUniqueRule = this.checkDaysOfWeek(registeredRule.daysOfWeek, [this.listOfdaysOfWeek[weekday]])
      } else if (rule.date === registeredRule.date) {
        shouldCheckUniqueRule = true;
      }

      if(isDailyRule || shouldCheckUniqueRule || hasSameDaysOfWeek) {
        hasConflict = this.checkIntervals(registeredRule, rule.intervals);
      }
    });

    return hasConflict;
  }
}

export interface TimeValidation {
  conflicted: boolean,
  rule: ITimeRules | null,
}
