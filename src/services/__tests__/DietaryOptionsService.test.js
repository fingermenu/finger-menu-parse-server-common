// @flow

import Chance from 'chance';
import Immutable, { List, Map, Range } from 'immutable';
import '../../../bootstrap';
import { DietaryOptionsService } from '../';
import { createDietaryOptionsInfo, expectDietaryOptions } from '../../schema/__tests__/DietaryOptions.test';

const chance = new Chance();
const serviceTimeService = new DietaryOptionsService();

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

const createDietaryOptionss = async (count, useSameInfo = false) => {
  let serviceTime;

  if (useSameInfo) {
    const { serviceTime: tempDietaryOptions } = await createDietaryOptionsInfo();

    serviceTime = tempDietaryOptions;
  }

  return Immutable.fromJS(
    await Promise.all(
      Range(0, count)
        .map(async () => {
          let finalDietaryOptions;

          if (useSameInfo) {
            finalDietaryOptions = serviceTime;
          } else {
            const { serviceTime: tempDietaryOptions } = await createDietaryOptionsInfo();

            finalDietaryOptions = tempDietaryOptions;
          }

          return serviceTimeService.read(await serviceTimeService.create(finalDietaryOptions), createCriteriaWthoutConditions());
        })
        .toArray(),
    ),
  );
};

export default createDietaryOptionss;

describe('create', () => {
  test('should return the created serving time Id', async () => {
    const serviceTimeId = await serviceTimeService.create((await createDietaryOptionsInfo()).serviceTime);

    expect(serviceTimeId).toBeDefined();
  });

  test('should create the serving time', async () => {
    const { serviceTime } = await createDietaryOptionsInfo();
    const serviceTimeId = await serviceTimeService.create(serviceTime);
    const fetchedDietaryOptions = await serviceTimeService.read(serviceTimeId, createCriteriaWthoutConditions());

    expect(fetchedDietaryOptions).toBeDefined();
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
      serviceTime: expectedDietaryOptions,
      tag: expectedTag,
      ownedByUser: expectedOwnedByUser,
      maintainedByUsers: expectedMaintainedByUsers,
    } = await createDietaryOptionsInfo();
    const serviceTimeId = await serviceTimeService.create(expectedDietaryOptions);
    const serviceTime = await serviceTimeService.read(serviceTimeId, createCriteriaWthoutConditions());

    expectDietaryOptions(serviceTime, expectedDietaryOptions, {
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
        await serviceTimeService.create((await createDietaryOptionsInfo()).serviceTime),
        createCriteriaWthoutConditions(),
      );

      await serviceTimeService.update(serviceTime.set('id', serviceTimeId));
    } catch (ex) {
      expect(ex.message).toBe(`No serving time found with Id: ${serviceTimeId}`);
    }
  });

  test('should return the Id of the updated serving time', async () => {
    const { serviceTime: expectedDietaryOptions } = await createDietaryOptionsInfo();
    const serviceTimeId = await serviceTimeService.create((await createDietaryOptionsInfo()).serviceTime);
    const id = await serviceTimeService.update(expectedDietaryOptions.set('id', serviceTimeId));

    expect(id).toBe(serviceTimeId);
  });

  test('should update the existing serving time', async () => {
    const {
      serviceTime: expectedDietaryOptions,
      tag: expectedTag,
      ownedByUser: expectedOwnedByUser,
      maintainedByUsers: expectedMaintainedByUsers,
    } = await createDietaryOptionsInfo();
    const serviceTimeId = await serviceTimeService.create((await createDietaryOptionsInfo()).serviceTime);

    await serviceTimeService.update(expectedDietaryOptions.set('id', serviceTimeId));

    const serviceTime = await serviceTimeService.read(serviceTimeId, createCriteriaWthoutConditions());

    expectDietaryOptions(serviceTime, expectedDietaryOptions, {
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
    const serviceTimeId = await serviceTimeService.create((await createDietaryOptionsInfo()).serviceTime);
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
      serviceTime: expectedDietaryOptions,
      tag: expectedTag,
      ownedByUser: expectedOwnedByUser,
      maintainedByUsers: expectedMaintainedByUsers,
    } = await createDietaryOptionsInfo();
    const results = Immutable.fromJS(
      await Promise.all(
        Range(0, chance.integer({ min: 1, max: 10 }))
          .map(async () => serviceTimeService.create(expectedDietaryOptions))
          .toArray(),
      ),
    );
    const serviceTimes = await serviceTimeService.search(createCriteria(expectedDietaryOptions));

    expect(serviceTimes.count).toBe(results.count);
    serviceTimes.forEach(serviceTime => {
      expect(results.find(_ => _.localeCompare(serviceTime.get('id')) === 0)).toBeDefined();
      expectDietaryOptions(serviceTime, expectedDietaryOptions, {
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
      serviceTime: expectedDietaryOptions,
      tag: expectedTag,
      ownedByUser: expectedOwnedByUser,
      maintainedByUsers: expectedMaintainedByUsers,
    } = await createDietaryOptionsInfo();
    const results = Immutable.fromJS(
      await Promise.all(
        Range(0, chance.integer({ min: 2, max: 5 }))
          .map(async () => serviceTimeService.create(expectedDietaryOptions))
          .toArray(),
      ),
    );

    let serviceTimes = List();
    const result = serviceTimeService.searchAll(createCriteria(expectedDietaryOptions));

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
      expectDietaryOptions(serviceTime, expectedDietaryOptions, {
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
    const serviceTimes = await createDietaryOptionss(chance.integer({ min: 1, max: 10 }), true);

    expect(await serviceTimeService.exists(createCriteria(serviceTimes.first()))).toBeTruthy();
  });
});

describe('count', () => {
  test('should return 0 if no serving time match provided criteria', async () => {
    expect(await serviceTimeService.count(createCriteria())).toBe(0);
  });

  test('should return the count of serving time match provided criteria', async () => {
    const serviceTimes = await createDietaryOptionss(chance.integer({ min: 1, max: 10 }), true);

    expect(await serviceTimeService.count(createCriteria(serviceTimes.first()))).toBe(serviceTimes.count());
  });
});
