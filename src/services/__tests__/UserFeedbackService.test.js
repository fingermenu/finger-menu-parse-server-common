// @flow

import Chance from 'chance';
import Immutable, { List, Map, Range } from 'immutable';
import '../../../bootstrap';
import { UserFeedbackService } from '../';
import { createUserFeedbackInfo, expectUserFeedback } from '../../schema/__tests__/UserFeedback.test';
import TestHelper from '../../../TestHelper';

const chance = new Chance();
const serviceTimeService = new UserFeedbackService();

const createCriteriaWthoutConditions = () =>
  Map({
    fields: List.of('questionAndAnswers', 'others', 'submittedAt', 'addedByUser'),
    include_addedByUser: true,
  });

const createCriteria = object =>
  Map({
    conditions: Map({
      questionAndAnswers: object ? object.get('questionAndAnswers') : TestHelper.createRandomList(),
      others: object ? object.get('others') : chance.string(),
      submittedAt: object ? object.get('submittedAt') : new Date(),
      addedByUserId: object ? object.get('addedByUserId') : chance.string(),
    }),
  }).merge(createCriteriaWthoutConditions());

const createUserFeedbacks = async (count, useSameInfo = false) => {
  let serviceTime;

  if (useSameInfo) {
    const { serviceTime: tempUserFeedback } = await createUserFeedbackInfo();

    serviceTime = tempUserFeedback;
  }

  return Immutable.fromJS(
    await Promise.all(
      Range(0, count)
        .map(async () => {
          let finalUserFeedback;

          if (useSameInfo) {
            finalUserFeedback = serviceTime;
          } else {
            const { serviceTime: tempUserFeedback } = await createUserFeedbackInfo();

            finalUserFeedback = tempUserFeedback;
          }

          return serviceTimeService.read(await serviceTimeService.create(finalUserFeedback), createCriteriaWthoutConditions());
        })
        .toArray(),
    ),
  );
};

export default createUserFeedbacks;

describe('create', () => {
  test('should return the created user feedback Id', async () => {
    const serviceTimeId = await serviceTimeService.create((await createUserFeedbackInfo()).serviceTime);

    expect(serviceTimeId).toBeDefined();
  });

  test('should create the user feedback', async () => {
    const { serviceTime } = await createUserFeedbackInfo();
    const serviceTimeId = await serviceTimeService.create(serviceTime);
    const fetchedUserFeedback = await serviceTimeService.read(serviceTimeId, createCriteriaWthoutConditions());

    expect(fetchedUserFeedback).toBeDefined();
  });
});

describe('read', () => {
  test('should reject if the provided user feedback Id does not exist', async () => {
    const serviceTimeId = chance.string();

    try {
      await serviceTimeService.read(serviceTimeId);
    } catch (ex) {
      expect(ex.message).toBe(`No user feedback found with Id: ${serviceTimeId}`);
    }
  });

  test('should read the existing user feedback', async () => {
    const { serviceTime: expectedUserFeedback, addedByUser: expectedAddedByUser } = await createUserFeedbackInfo();
    const serviceTimeId = await serviceTimeService.create(expectedUserFeedback);
    const serviceTime = await serviceTimeService.read(serviceTimeId, createCriteriaWthoutConditions());

    expectUserFeedback(serviceTime, expectedUserFeedback, {
      serviceTimeId,
      expectedAddedByUser,
    });
  });
});

describe('update', () => {
  test('should reject if the provided user feedback Id does not exist', async () => {
    const serviceTimeId = chance.string();

    try {
      const serviceTime = await serviceTimeService.read(
        await serviceTimeService.create((await createUserFeedbackInfo()).serviceTime),
        createCriteriaWthoutConditions(),
      );

      await serviceTimeService.update(serviceTime.set('id', serviceTimeId));
    } catch (ex) {
      expect(ex.message).toBe(`No user feedback found with Id: ${serviceTimeId}`);
    }
  });

  test('should return the Id of the updated user feedback', async () => {
    const { serviceTime: expectedUserFeedback } = await createUserFeedbackInfo();
    const serviceTimeId = await serviceTimeService.create((await createUserFeedbackInfo()).serviceTime);
    const id = await serviceTimeService.update(expectedUserFeedback.set('id', serviceTimeId));

    expect(id).toBe(serviceTimeId);
  });

  test('should update the existing user feedback', async () => {
    const { serviceTime: expectedUserFeedback, addedByUser: expectedAddedByUser } = await createUserFeedbackInfo();
    const serviceTimeId = await serviceTimeService.create((await createUserFeedbackInfo()).serviceTime);

    await serviceTimeService.update(expectedUserFeedback.set('id', serviceTimeId));

    const serviceTime = await serviceTimeService.read(serviceTimeId, createCriteriaWthoutConditions());

    expectUserFeedback(serviceTime, expectedUserFeedback, {
      serviceTimeId,
      expectedAddedByUser,
    });
  });
});

describe('delete', () => {
  test('should reject if the provided user feedback Id does not exist', async () => {
    const serviceTimeId = chance.string();

    try {
      await serviceTimeService.delete(serviceTimeId);
    } catch (ex) {
      expect(ex.message).toBe(`No user feedback found with Id: ${serviceTimeId}`);
    }
  });

  test('should delete the existing user feedback', async () => {
    const serviceTimeId = await serviceTimeService.create((await createUserFeedbackInfo()).serviceTime);
    await serviceTimeService.delete(serviceTimeId);

    try {
      await serviceTimeService.delete(serviceTimeId);
    } catch (ex) {
      expect(ex.message).toBe(`No user feedback found with Id: ${serviceTimeId}`);
    }
  });
});

describe('search', () => {
  test('should return no user feedback if provided criteria matches no user feedback', async () => {
    const serviceTimes = await serviceTimeService.search(createCriteria());

    expect(serviceTimes.count()).toBe(0);
  });

  test('should return the user feedback matches the criteria', async () => {
    const { serviceTime: expectedUserFeedback, addedByUser: expectedAddedByUser } = await createUserFeedbackInfo();
    const results = Immutable.fromJS(
      await Promise.all(
        Range(0, chance.integer({ min: 1, max: 10 }))
          .map(async () => serviceTimeService.create(expectedUserFeedback))
          .toArray(),
      ),
    );
    const serviceTimes = await serviceTimeService.search(createCriteria(expectedUserFeedback));

    expect(serviceTimes.count).toBe(results.count);
    serviceTimes.forEach(serviceTime => {
      expect(results.find(_ => _.localeCompare(serviceTime.get('id')) === 0)).toBeDefined();
      expectUserFeedback(serviceTime, expectedUserFeedback, {
        serviceTimeId: serviceTime.get('id'),
        expectedAddedByUser,
      });
    });
  });
});

describe('searchAll', () => {
  test('should return no user feedback if provided criteria matches no user feedback', async () => {
    let serviceTimes = List();
    const result = serviceTimeService.searchAll(createCriteria());

    try {
      result.event.subscribe(info => {
        serviceTimes = serviceTimes.push(info);
      });

      await result.promise;
    } finally {
      result.event.unsubscribeAll();
    }

    expect(serviceTimes.count()).toBe(0);
  });

  test('should return the user feedback matches the criteria', async () => {
    const { serviceTime: expectedUserFeedback, addedByUser: expectedAddedByUser } = await createUserFeedbackInfo();
    const results = Immutable.fromJS(
      await Promise.all(
        Range(0, chance.integer({ min: 2, max: 5 }))
          .map(async () => serviceTimeService.create(expectedUserFeedback))
          .toArray(),
      ),
    );

    let serviceTimes = List();
    const result = serviceTimeService.searchAll(createCriteria(expectedUserFeedback));

    try {
      result.event.subscribe(info => {
        serviceTimes = serviceTimes.push(info);
      });

      await result.promise;
    } finally {
      result.event.unsubscribeAll();
    }

    expect(serviceTimes.count).toBe(results.count);
    serviceTimes.forEach(serviceTime => {
      expect(results.find(_ => _.localeCompare(serviceTime.get('id')) === 0)).toBeDefined();
      expectUserFeedback(serviceTime, expectedUserFeedback, {
        serviceTimeId: serviceTime.get('id'),
        expectedAddedByUser,
      });
    });
  });
});

describe('exists', () => {
  test('should return false if no user feedback match provided criteria', async () => {
    expect(await serviceTimeService.exists(createCriteria())).toBeFalsy();
  });

  test('should return true if any user feedback match provided criteria', async () => {
    const serviceTimes = await createUserFeedbacks(chance.integer({ min: 1, max: 10 }), true);

    expect(await serviceTimeService.exists(createCriteria(serviceTimes.first()))).toBeTruthy();
  });
});

describe('count', () => {
  test('should return 0 if no user feedback match provided criteria', async () => {
    expect(await serviceTimeService.count(createCriteria())).toBe(0);
  });

  test('should return the count of user feedback match provided criteria', async () => {
    const serviceTimes = await createUserFeedbacks(chance.integer({ min: 1, max: 10 }), true);

    expect(await serviceTimeService.count(createCriteria(serviceTimes.first()))).toBe(serviceTimes.count());
  });
});
