import { ITimeRules, IIntervals } from "./timeRules";

export default class CheckTimeConflict {

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
      const isDailyRule = registeredRule.type === 'daily';
      const isSameDay = registeredRule.type === 'unique' && rule.date === registeredRule.date;
      const shouldCheckDaysOfWeek = registeredRule.type === 'weekly' &&
        !!rule.daysOfWeek && !!registeredRule.daysOfWeek &&
        this.checkDaysOfWeek(registeredRule.daysOfWeek, rule.daysOfWeek);

      if(isDailyRule || isSameDay || shouldCheckDaysOfWeek) {
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
