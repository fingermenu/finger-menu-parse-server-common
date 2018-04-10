// @flow

import Chance from 'chance';
import Immutable, { List, Map, Range } from 'immutable';
import '../../../bootstrap';
import { ServingTimeService } from '../';
import { createServingTimeInfo, expectServingTime } from '../../schema/__tests__/ServingTime.test';

const chance = new Chance();
const serviceTimeService = new ServingTimeService();

const createCriteriaWthoutConditions = () =>
  Map({
    fields: List.of('tag', 'ownedByUser', 'maintainedByUsers'),
    include_tag: true,
    include_ownedByUser: true,
    include_maintainedByUsers: true,
  });

const createCriteria = object =>
  Map({
    conditions: Map({
      tagId: object ? object.get('tagId') : chance.string(),
      ownedByUserId: object ? object.get('ownedByUserId') : chance.string(),
      maintainedByUserIds: object ? object.get('maintainedByUserIds') : List.of(chance.string(), chance.string()),
    }),
  }).merge(createCriteriaWthoutConditions());

const createServingTimes = async (count, useSameInfo = false) => {
  let serviceTime;

  if (useSameInfo) {
    const { serviceTime: tempServingTime } = await createServingTimeInfo();

    serviceTime = tempServingTime;
  }

  return Immutable.fromJS(
    await Promise.all(
      Range(0, count)
        .map(async () => {
          let finalServingTime;

          if (useSameInfo) {
            finalServingTime = serviceTime;
          } else {
            const { serviceTime: tempServingTime } = await createServingTimeInfo();

            finalServingTime = tempServingTime;
          }

          return serviceTimeService.read(await serviceTimeService.create(finalServingTime), createCriteriaWthoutConditions());
        })
        .toArray(),
    ),
  );
};

export default createServingTimes;

describe('create', () => {
  test('should return the created serving time Id', async () => {
    const serviceTimeId = await serviceTimeService.create((await createServingTimeInfo()).serviceTime);

    expect(serviceTimeId).toBeDefined();
  });

  test('should create the serving time', async () => {
    const { serviceTime } = await createServingTimeInfo();
    const serviceTimeId = await serviceTimeService.create(serviceTime);
    const fetchedServingTime = await serviceTimeService.read(serviceTimeId, createCriteriaWthoutConditions());

    expect(fetchedServingTime).toBeDefined();
  });
});

describe('read', () => {
  test('should reject if the provided serving time Id does not exist', async () => {
    const serviceTimeId = chance.string();

    try {
      await serviceTimeService.read(serviceTimeId);
    } catch (ex) {
      expect(ex.message).toBe(`No serving time found with Id: ${serviceTimeId}`);
    }
  });

  test('should read the existing serving time', async () => {
    const {
      serviceTime: expectedServingTime,
      tag: expectedTag,
      ownedByUser: expectedOwnedByUser,
      maintainedByUsers: expectedMaintainedByUsers,
    } = await createServingTimeInfo();
    const serviceTimeId = await serviceTimeService.create(expectedServingTime);
    const serviceTime = await serviceTimeService.read(serviceTimeId, createCriteriaWthoutConditions());

    expectServingTime(serviceTime, expectedServingTime, {
      serviceTimeId,
      expectedTag,
      expectedOwnedByUser,
      expectedMaintainedByUsers,
    });
  });
});

describe('update', () => {
  test('should reject if the provided serving time Id does not exist', async () => {
    const serviceTimeId = chance.string();

    try {
      const serviceTime = await serviceTimeService.read(
        await serviceTimeService.create((await createServingTimeInfo()).serviceTime),
        createCriteriaWthoutConditions(),
      );

      await serviceTimeService.update(serviceTime.set('id', serviceTimeId));
    } catch (ex) {
      expect(ex.message).toBe(`No serving time found with Id: ${serviceTimeId}`);
    }
  });

  test('should return the Id of the updated serving time', async () => {
    const { serviceTime: expectedServingTime } = await createServingTimeInfo();
    const serviceTimeId = await serviceTimeService.create((await createServingTimeInfo()).serviceTime);
    const id = await serviceTimeService.update(expectedServingTime.set('id', serviceTimeId));

    expect(id).toBe(serviceTimeId);
  });

  test('should update the existing serving time', async () => {
    const {
      serviceTime: expectedServingTime,
      tag: expectedTag,
      ownedByUser: expectedOwnedByUser,
      maintainedByUsers: expectedMaintainedByUsers,
    } = await createServingTimeInfo();
    const serviceTimeId = await serviceTimeService.create((await createServingTimeInfo()).serviceTime);

    await serviceTimeService.update(expectedServingTime.set('id', serviceTimeId));

    const serviceTime = await serviceTimeService.read(serviceTimeId, createCriteriaWthoutConditions());

    expectServingTime(serviceTime, expectedServingTime, {
      serviceTimeId,
      expectedTag,
      expectedOwnedByUser,
      expectedMaintainedByUsers,
    });
  });
});

describe('delete', () => {
  test('should reject if the provided serving time Id does not exist', async () => {
    const serviceTimeId = chance.string();

    try {
      await serviceTimeService.delete(serviceTimeId);
    } catch (ex) {
      expect(ex.message).toBe(`No serving time found with Id: ${serviceTimeId}`);
    }
  });

  test('should delete the existing serving time', async () => {
    const serviceTimeId = await serviceTimeService.create((await createServingTimeInfo()).serviceTime);
    await serviceTimeService.delete(serviceTimeId);

    try {
      await serviceTimeService.delete(serviceTimeId);
    } catch (ex) {
      expect(ex.message).toBe(`No serving time found with Id: ${serviceTimeId}`);
    }
  });
});

describe('search', () => {
  test('should return no serving time if provided criteria matches no serving time', async () => {
    const serviceTimes = await serviceTimeService.search(createCriteria());

    expect(serviceTimes.count()).toBe(0);
  });

  test('should return the serving time matches the criteria', async () => {
    const {
      serviceTime: expectedServingTime,
      tag: expectedTag,
      ownedByUser: expectedOwnedByUser,
      maintainedByUsers: expectedMaintainedByUsers,
    } = await createServingTimeInfo();
    const results = Immutable.fromJS(
      await Promise.all(
        Range(0, chance.integer({ min: 1, max: 10 }))
          .map(async () => serviceTimeService.create(expectedServingTime))
          .toArray(),
      ),
    );
    const serviceTimes = await serviceTimeService.search(createCriteria(expectedServingTime));

    expect(serviceTimes.count).toBe(results.count);
    serviceTimes.forEach(serviceTime => {
      expect(results.find(_ => _.localeCompare(serviceTime.get('id')) === 0)).toBeDefined();
      expectServingTime(serviceTime, expectedServingTime, {
        serviceTimeId: serviceTime.get('id'),
        expectedTag,
        expectedOwnedByUser,
        expectedMaintainedByUsers,
      });
    });
  });
});

describe('searchAll', () => {
  test('should return no serving time if provided criteria matches no serving time', async () => {
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

  test('should return the serving time matches the criteria', async () => {
    const {
      serviceTime: expectedServingTime,
      tag: expectedTag,
      ownedByUser: expectedOwnedByUser,
      maintainedByUsers: expectedMaintainedByUsers,
    } = await createServingTimeInfo();
    const results = Immutable.fromJS(
      await Promise.all(
        Range(0, chance.integer({ min: 2, max: 5 }))
          .map(async () => serviceTimeService.create(expectedServingTime))
          .toArray(),
      ),
    );

    let serviceTimes = List();
    const result = serviceTimeService.searchAll(createCriteria(expectedServingTime));

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
      expectServingTime(serviceTime, expectedServingTime, {
        serviceTimeId: serviceTime.get('id'),
        expectedTag,
        expectedOwnedByUser,
        expectedMaintainedByUsers,
      });
    });
  });
});

describe('exists', () => {
  test('should return false if no serving time match provided criteria', async () => {
    expect(await serviceTimeService.exists(createCriteria())).toBeFalsy();
  });

  test('should return true if any serving time match provided criteria', async () => {
    const serviceTimes = await createServingTimes(chance.integer({ min: 1, max: 10 }), true);

    expect(await serviceTimeService.exists(createCriteria(serviceTimes.first()))).toBeTruthy();
  });
});

describe('count', () => {
  test('should return 0 if no serving time match provided criteria', async () => {
    expect(await serviceTimeService.count(createCriteria())).toBe(0);
  });

  test('should return the count of serving time match provided criteria', async () => {
    const serviceTimes = await createServingTimes(chance.integer({ min: 1, max: 10 }), true);

    expect(await serviceTimeService.count(createCriteria(serviceTimes.first()))).toBe(serviceTimes.count());
  });
});
