// @flow

import Chance from 'chance';
import Immutable, { List, Map, Range } from 'immutable';
import '../../../bootstrap';
import { DishTypeService } from '../';
import { createDishTypeInfo, expectDishType } from '../../schema/__tests__/DishType.test';

const chance = new Chance();
const serviceTimeService = new DishTypeService();

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

const createDishTypes = async (count, useSameInfo = false) => {
  let serviceTime;

  if (useSameInfo) {
    const { serviceTime: tempDishType } = await createDishTypeInfo();

    serviceTime = tempDishType;
  }

  return Immutable.fromJS(
    await Promise.all(
      Range(0, count)
        .map(async () => {
          let finalDishType;

          if (useSameInfo) {
            finalDishType = serviceTime;
          } else {
            const { serviceTime: tempDishType } = await createDishTypeInfo();

            finalDishType = tempDishType;
          }

          return serviceTimeService.read(await serviceTimeService.create(finalDishType), createCriteriaWthoutConditions());
        })
        .toArray(),
    ),
  );
};

export default createDishTypes;

describe('create', () => {
  test('should return the created dish type Id', async () => {
    const serviceTimeId = await serviceTimeService.create((await createDishTypeInfo()).serviceTime);

    expect(serviceTimeId).toBeDefined();
  });

  test('should create the dish type', async () => {
    const { serviceTime } = await createDishTypeInfo();
    const serviceTimeId = await serviceTimeService.create(serviceTime);
    const fetchedDishType = await serviceTimeService.read(serviceTimeId, createCriteriaWthoutConditions());

    expect(fetchedDishType).toBeDefined();
  });
});

describe('read', () => {
  test('should reject if the provided dish type Id does not exist', async () => {
    const serviceTimeId = chance.string();

    try {
      await serviceTimeService.read(serviceTimeId);
    } catch (ex) {
      expect(ex.message).toBe(`No dish type found with Id: ${serviceTimeId}`);
    }
  });

  test('should read the existing dish type', async () => {
    const {
      serviceTime: expectedDishType,
      tag: expectedTag,
      ownedByUser: expectedOwnedByUser,
      maintainedByUsers: expectedMaintainedByUsers,
    } = await createDishTypeInfo();
    const serviceTimeId = await serviceTimeService.create(expectedDishType);
    const serviceTime = await serviceTimeService.read(serviceTimeId, createCriteriaWthoutConditions());

    expectDishType(serviceTime, expectedDishType, {
      serviceTimeId,
      expectedTag,
      expectedOwnedByUser,
      expectedMaintainedByUsers,
    });
  });
});

describe('update', () => {
  test('should reject if the provided dish type Id does not exist', async () => {
    const serviceTimeId = chance.string();

    try {
      const serviceTime = await serviceTimeService.read(
        await serviceTimeService.create((await createDishTypeInfo()).serviceTime),
        createCriteriaWthoutConditions(),
      );

      await serviceTimeService.update(serviceTime.set('id', serviceTimeId));
    } catch (ex) {
      expect(ex.message).toBe(`No dish type found with Id: ${serviceTimeId}`);
    }
  });

  test('should return the Id of the updated dish type', async () => {
    const { serviceTime: expectedDishType } = await createDishTypeInfo();
    const serviceTimeId = await serviceTimeService.create((await createDishTypeInfo()).serviceTime);
    const id = await serviceTimeService.update(expectedDishType.set('id', serviceTimeId));

    expect(id).toBe(serviceTimeId);
  });

  test('should update the existing dish type', async () => {
    const {
      serviceTime: expectedDishType,
      tag: expectedTag,
      ownedByUser: expectedOwnedByUser,
      maintainedByUsers: expectedMaintainedByUsers,
    } = await createDishTypeInfo();
    const serviceTimeId = await serviceTimeService.create((await createDishTypeInfo()).serviceTime);

    await serviceTimeService.update(expectedDishType.set('id', serviceTimeId));

    const serviceTime = await serviceTimeService.read(serviceTimeId, createCriteriaWthoutConditions());

    expectDishType(serviceTime, expectedDishType, {
      serviceTimeId,
      expectedTag,
      expectedOwnedByUser,
      expectedMaintainedByUsers,
    });
  });
});

describe('delete', () => {
  test('should reject if the provided dish type Id does not exist', async () => {
    const serviceTimeId = chance.string();

    try {
      await serviceTimeService.delete(serviceTimeId);
    } catch (ex) {
      expect(ex.message).toBe(`No dish type found with Id: ${serviceTimeId}`);
    }
  });

  test('should delete the existing dish type', async () => {
    const serviceTimeId = await serviceTimeService.create((await createDishTypeInfo()).serviceTime);
    await serviceTimeService.delete(serviceTimeId);

    try {
      await serviceTimeService.delete(serviceTimeId);
    } catch (ex) {
      expect(ex.message).toBe(`No dish type found with Id: ${serviceTimeId}`);
    }
  });
});

describe('search', () => {
  test('should return no dish type if provided criteria matches no dish type', async () => {
    const serviceTimes = await serviceTimeService.search(createCriteria());

    expect(serviceTimes.count()).toBe(0);
  });

  test('should return the dish type matches the criteria', async () => {
    const {
      serviceTime: expectedDishType,
      tag: expectedTag,
      ownedByUser: expectedOwnedByUser,
      maintainedByUsers: expectedMaintainedByUsers,
    } = await createDishTypeInfo();
    const results = Immutable.fromJS(
      await Promise.all(
        Range(0, chance.integer({ min: 1, max: 10 }))
          .map(async () => serviceTimeService.create(expectedDishType))
          .toArray(),
      ),
    );
    const serviceTimes = await serviceTimeService.search(createCriteria(expectedDishType));

    expect(serviceTimes.count).toBe(results.count);
    serviceTimes.forEach(serviceTime => {
      expect(results.find(_ => _.localeCompare(serviceTime.get('id')) === 0)).toBeDefined();
      expectDishType(serviceTime, expectedDishType, {
        serviceTimeId: serviceTime.get('id'),
        expectedTag,
        expectedOwnedByUser,
        expectedMaintainedByUsers,
      });
    });
  });
});

describe('searchAll', () => {
  test('should return no dish type if provided criteria matches no dish type', async () => {
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

  test('should return the dish type matches the criteria', async () => {
    const {
      serviceTime: expectedDishType,
      tag: expectedTag,
      ownedByUser: expectedOwnedByUser,
      maintainedByUsers: expectedMaintainedByUsers,
    } = await createDishTypeInfo();
    const results = Immutable.fromJS(
      await Promise.all(
        Range(0, chance.integer({ min: 2, max: 5 }))
          .map(async () => serviceTimeService.create(expectedDishType))
          .toArray(),
      ),
    );

    let serviceTimes = List();
    const result = serviceTimeService.searchAll(createCriteria(expectedDishType));

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
      expectDishType(serviceTime, expectedDishType, {
        serviceTimeId: serviceTime.get('id'),
        expectedTag,
        expectedOwnedByUser,
        expectedMaintainedByUsers,
      });
    });
  });
});

describe('exists', () => {
  test('should return false if no dish type match provided criteria', async () => {
    expect(await serviceTimeService.exists(createCriteria())).toBeFalsy();
  });

  test('should return true if any dish type match provided criteria', async () => {
    const serviceTimes = await createDishTypes(chance.integer({ min: 1, max: 10 }), true);

    expect(await serviceTimeService.exists(createCriteria(serviceTimes.first()))).toBeTruthy();
  });
});

describe('count', () => {
  test('should return 0 if no dish type match provided criteria', async () => {
    expect(await serviceTimeService.count(createCriteria())).toBe(0);
  });

  test('should return the count of dish type match provided criteria', async () => {
    const serviceTimes = await createDishTypes(chance.integer({ min: 1, max: 10 }), true);

    expect(await serviceTimeService.count(createCriteria(serviceTimes.first()))).toBe(serviceTimes.count());
  });
});
