import * as moment from 'moment';
import { ITimeRules, IIntervals, TypeRules, DaysOfWeek } from "../../../models/timeRules/timeRules";

export default class CheckTimeConflict {
  private listOfdaysOfWeek = [
    DaysOfWeek.sunday,
    DaysOfWeek.monday,
    DaysOfWeek.tuesday,
    DaysOfWeek.wendnesday,
    DaysOfWeek.thursday,
    DaysOfWeek.friday,
    DaysOfWeek.saturday
  ];

  private checkIntervals(rule: ITimeRules, intervals: IIntervals[]): boolean {
    const hasConflict = rule.intervals.map(registerInterval => {
      return intervals.map(interval => {
        const checkStartInterval = interval.start >= registerInterval.start && interval.start <= registerInterval.end;
        const checkEndInterval = interval.end >= registerInterval.start && interval.end <= registerInterval.end;

        if(checkStartInterval || checkEndInterval) {
          return true;
        }
      }).filter(hasConflict => hasConflict)[0];
    }).filter(hasConflict => hasConflict)[0];

    return hasConflict ? true : false;
  }

  private checkDaysOfWeek(registeredDaysOfWeek: DaysOfWeek[], daysOfWeek: DaysOfWeek[]) {
    const hasDayOfWeek = registeredDaysOfWeek.map(registeredDaysOfWeek => 
      !!daysOfWeek.filter(dayOfWeek => registeredDaysOfWeek === dayOfWeek).length
    ).filter(checker => checker);

    return !!hasDayOfWeek.length;
  }

  public check(registeredRules: ITimeRules[], rule: ITimeRules): Boolean {
    const hasConflict = registeredRules.map(registeredRule => {
      let shouldCheckUniqueRule = false;
      const isDailyRule = rule.type === TypeRules.daily;
      const isUniqueRule = rule.type === TypeRules.unique;
      const hasSameDaysOfWeek = !!rule.daysOfWeek && !!registeredRule.daysOfWeek &&
        this.checkDaysOfWeek(registeredRule.daysOfWeek, rule.daysOfWeek);

      if(isUniqueRule && registeredRule.daysOfWeek) {
        const weekday = moment(rule.date, "DD-MM-YYYY").weekday();
        shouldCheckUniqueRule = this.checkDaysOfWeek(registeredRule.daysOfWeek, [this.listOfdaysOfWeek[weekday]])
      } else if (rule.date === registeredRule.date || registeredRule.type == TypeRules.daily) {
        shouldCheckUniqueRule = true;
      }

      if(isDailyRule || shouldCheckUniqueRule || hasSameDaysOfWeek) {
        return this.checkIntervals(registeredRule, rule.intervals);
      }
    }).filter(hasConflict => hasConflict)[0];

    return hasConflict ? true : false;
  }
}

export interface TimeValidation {
  conflicted: boolean,
  rule: ITimeRules | null,
}
