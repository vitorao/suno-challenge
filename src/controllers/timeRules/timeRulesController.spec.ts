import * as request from 'supertest';
import * as app from "../../app";
import TimeRulesModel, { DaysOfWeek, TypeRules } from '../../models/timeRules/timeRules';
import { expectDailyResponse } from './fixtures';

describe('TimeRulesController', () => {
  const timeRulesModel = new TimeRulesModel();

  afterEach(() => {
    timeRulesModel.updateTimeRules([]);
  });

  it('should register a rule and return a id', async () => {
    await request(app)
      .post('/rules')
      .send([
        {
          "intervals": [{"start": "20:30", "end": "22:30"}],
          "type": "unique",
          "date": "09-03-2021",
          "daysOfWeek": null
        }
      ])
      .expect(200)
      .then((response) => {
        expect(response.body.id).toHaveLength(36);
      })
  });

  it('should register a rule and delete it', async () => {
    const id = "5f92ae78-b642-47bd-a517-f99b444f86f2"
    timeRulesModel.updateTimeRules([
      {
        "id": id,
        "intervals": [{"start": "20:30", "end": "22:30"}],
        "type": TypeRules.weekly,
        "date": "09-03-2021",
        "daysOfWeek": null
      }
    ]);

    await request(app)
      .delete(`/rules/${id}`)
      .expect(200)
      .then((response) => {
        expect(response.body.success).toBe(true);
      });
  });

  it('should list it correctly', async () => {
    const registeredContent = [
      {
        "id": "5f92ae78-b642-47bd-a517-f99b444f86f2",
        "intervals": [{"start": "20:30", "end": "22:30"}],
        "type": TypeRules.weekly,
        "date": null,
        "daysOfWeek": [DaysOfWeek.sunday]
      }
    ];
    timeRulesModel.updateTimeRules(registeredContent);

    await request(app)
      .get(`/rules/`)
      .expect(200)
      .then((response) => {
        expect(response.body).toStrictEqual(registeredContent);
      });
  });

  it('should list it correctly a available rule', async () => {
    const registeredContent = [
      {
        "id": "5f92ae78-b642-47bd-a517-f99b444f86f2",
        "intervals": [{"start": "20:30", "end": "22:30"}],
        "type": TypeRules.daily,
        "date": null,
        "daysOfWeek": null
      }
    ];
    timeRulesModel.updateTimeRules(registeredContent);

    await request(app)
      .get(`/rules/availables?start=03-03-2021&end=06-03-2021`)
      .expect(200)
      .then((response) => {
        expect(response.body).toStrictEqual(expectDailyResponse);
      });
  });

  it('should register a rule and return a error with conflict', async () => {
    const registeredContent = [
      {
        "id": "5f92ae78-b642-47bd-a517-f99b444f86f2",
        "intervals": [{"start": "20:30", "end": "22:30"}],
        "type": TypeRules.daily,
        "date": null,
        "daysOfWeek": null
      }
    ];
    await timeRulesModel.updateTimeRules(registeredContent);

    await request(app)
      .post('/rules')
      .send([
        {
          "intervals": [{"start": "20:30", "end": "22:30"}],
          "type": "unique",
          "date": "09-03-2021",
          "daysOfWeek": null
        }
      ])
      .expect(409)
      .then((response) => {
        expect(response.body).toStrictEqual({ message: "Your time rule generate a conflict with a existing rule" });
      })
  });

  it('should return a error if is missing param', async () => {
    await request(app)
      .get(`/rules/availables?start=03-03-2021`)
      .expect(400)
      .then((response) => {
        expect(response.body).toStrictEqual({ message: "missing param start or end" });
      });
  });

});

