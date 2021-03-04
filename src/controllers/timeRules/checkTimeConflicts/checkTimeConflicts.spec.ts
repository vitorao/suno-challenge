import CheckTimeConflict from "./checkTimeConflicts";
import { TypeRules, DaysOfWeek } from "../../../models/timeRules/timeRules";

describe('CheckTimeConflicts', () => {
  const mockRegisteredRules = [
    {
      date: "04-03-2021",
      daysOfWeek: null,
      type: TypeRules.unique,
      id: "mocked-id-of-rule",
      intervals: [
        { start: "09:00", end: "12:00" },
        { start: "13:00", end: "18:00" }
      ]
    },
    {
      date: null,
      daysOfWeek: [DaysOfWeek.friday, DaysOfWeek.saturday, DaysOfWeek.sunday],
      type: TypeRules.weekly,
      id: "mocked-id-of-rule",
      intervals: [
        { start: "08:00", end: "08:59" },
        { start: "18:01", end: "20:00" }
      ]
    },
    {
      date: null,
      daysOfWeek: null,
      type: TypeRules.daily,
      id: "mocked-id-of-rule",
      intervals: [
        { start: "01:00", end: "03:00" },
      ]
    }
  ];

  it('should check if exists conflicts with unique rule and pass', () => {
    const checkTimeConflict = new CheckTimeConflict();
    const mockUniqueRule = {
      date: "04-03-2021",
      daysOfWeek: null,
      type: TypeRules.unique,
      id: "mocked-id-of-rule",
      intervals: [
        { start: "21:00", end: "23:59" }
      ]
    };
    const hasConflict = checkTimeConflict.check(mockRegisteredRules, mockUniqueRule);
    expect(hasConflict).toBeFalsy();
  });

  it('should check if exists conflicts with unique rule and do not pass', () => {
    const checkTimeConflict = new CheckTimeConflict();
    const mockUniqueRule = {
      date: "04-03-2021",
      daysOfWeek: null,
      type: TypeRules.unique,
      id: "mocked-id-of-rule",
      intervals: [
        { start: "09:00", end: "13:30" }
      ]
    };
    const hasConflict = checkTimeConflict.check(mockRegisteredRules, mockUniqueRule);
    expect(hasConflict).toBeTruthy();
  });

  it('should check if exists conflicts with weekly rule pass', () => {
    const checkTimeConflict = new CheckTimeConflict();
    const mockUniqueRule = {
      date: null,
      daysOfWeek: [DaysOfWeek.friday, DaysOfWeek.saturday, DaysOfWeek.sunday],
      type: TypeRules.unique,
      id: "mocked-id-of-rule",
      intervals: [
        { start: "21:00", end: "23:59" }
      ]
    };
    const hasConflict = checkTimeConflict.check(mockRegisteredRules, mockUniqueRule);
    expect(hasConflict).toBeFalsy();
  });

  it('should check if exists conflicts with weekly rule and do not pass', () => {
    const checkTimeConflict = new CheckTimeConflict();
    const mockUniqueRule = {
      date: null,
      daysOfWeek: [DaysOfWeek.friday, DaysOfWeek.saturday, DaysOfWeek.sunday],
      type: TypeRules.unique,
      id: "mocked-id-of-rule",
      intervals: [
        { start: "18:00", end: "19:00" }
      ]
    };
    const hasConflict = checkTimeConflict.check(mockRegisteredRules, mockUniqueRule);
    expect(hasConflict).toBeTruthy();
  });

  it('should check if exists conflicts with daily rule and pass', () => {
    const checkTimeConflict = new CheckTimeConflict();
    const mockUniqueRule = {
      date: null,
      daysOfWeek: null,
      type: TypeRules.daily,
      id: "mocked-id-of-rule",
      intervals: [
        { start: "21:00", end: "23:59" }
      ]
    };
    const hasConflict = checkTimeConflict.check(mockRegisteredRules, mockUniqueRule);
    expect(hasConflict).toBeFalsy();
  });

  it('should check if exists conflicts with daily rule and do not pass', () => {
    const checkTimeConflict = new CheckTimeConflict();
    const mockUniqueRule = {
      date: null,
      daysOfWeek: null,
      type: TypeRules.daily,
      id: "mocked-id-of-rule",
      intervals: [
        { start: "09:00", end: "13:30" }
      ]
    };
    const hasConflict = checkTimeConflict.check(mockRegisteredRules, mockUniqueRule);
    expect(hasConflict).toBeTruthy();
  });
})