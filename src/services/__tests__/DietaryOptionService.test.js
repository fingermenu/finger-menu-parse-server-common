// @flow

import Chance from 'chance';
import Immutable, { List, Map, Range } from 'immutable';
import '../../../bootstrap';
import { DietaryOptionService } from '../';
import { createDietaryOptionInfo, expectDietaryOption } from '../../schema/__tests__/DietaryOption.test';

const chance = new Chance();
const serviceTimeService = new DietaryOptionService();

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

const createDietaryOptions = async (count, useSameInfo = false) => {
  let serviceTime;

  if (useSameInfo) {
    const { serviceTime: tempDietaryOption } = await createDietaryOptionInfo();

    serviceTime = tempDietaryOption;
  }

  return Immutable.fromJS(
    await Promise.all(
      Range(0, count)
        .map(async () => {
          let finalDietaryOption;

          if (useSameInfo) {
            finalDietaryOption = serviceTime;
          } else {
            const { serviceTime: tempDietaryOption } = await createDietaryOptionInfo();

            finalDietaryOption = tempDietaryOption;
          }

          return serviceTimeService.read(await serviceTimeService.create(finalDietaryOption), createCriteriaWthoutConditions());
        })
        .toArray(),
    ),
  );
};

export default createDietaryOptions;

describe('create', () => {
  test('should return the created dietary option Id', async () => {
    const serviceTimeId = await serviceTimeService.create((await createDietaryOptionInfo()).serviceTime);

    expect(serviceTimeId).toBeDefined();
  });

  test('should create the dietary option', async () => {
    const { serviceTime } = await createDietaryOptionInfo();
    const serviceTimeId = await serviceTimeService.create(serviceTime);
    const fetchedDietaryOption = await serviceTimeService.read(serviceTimeId, createCriteriaWthoutConditions());

    expect(fetchedDietaryOption).toBeDefined();
  });
});

describe('read', () => {
  test('should reject if the provided dietary option Id does not exist', async () => {
    const serviceTimeId = chance.string();

    try {
      await serviceTimeService.read(serviceTimeId);
    } catch (ex) {
      expect(ex.message).toBe(`No dietary option found with Id: ${serviceTimeId}`);
    }
  });

  test('should read the existing dietary option', async () => {
    const {
      serviceTime: expectedDietaryOption,
      tag: expectedTag,
      ownedByUser: expectedOwnedByUser,
      maintainedByUsers: expectedMaintainedByUsers,
    } = await createDietaryOptionInfo();
    const serviceTimeId = await serviceTimeService.create(expectedDietaryOption);
    const serviceTime = await serviceTimeService.read(serviceTimeId, createCriteriaWthoutConditions());

    expectDietaryOption(serviceTime, expectedDietaryOption, {
      serviceTimeId,
      expectedTag,
      expectedOwnedByUser,
      expectedMaintainedByUsers,
    });
  });
});

describe('update', () => {
  test('should reject if the provided dietary option Id does not exist', async () => {
    const serviceTimeId = chance.string();

    try {
      const serviceTime = await serviceTimeService.read(
        await serviceTimeService.create((await createDietaryOptionInfo()).serviceTime),
        createCriteriaWthoutConditions(),
      );

      await serviceTimeService.update(serviceTime.set('id', serviceTimeId));
    } catch (ex) {
      expect(ex.message).toBe(`No dietary option found with Id: ${serviceTimeId}`);
    }
  });

  test('should return the Id of the updated dietary option', async () => {
    const { serviceTime: expectedDietaryOption } = await createDietaryOptionInfo();
    const serviceTimeId = await serviceTimeService.create((await createDietaryOptionInfo()).serviceTime);
    const id = await serviceTimeService.update(expectedDietaryOption.set('id', serviceTimeId));

    expect(id).toBe(serviceTimeId);
  });

  test('should update the existing dietary option', async () => {
    const {
      serviceTime: expectedDietaryOption,
      tag: expectedTag,
      ownedByUser: expectedOwnedByUser,
      maintainedByUsers: expectedMaintainedByUsers,
    } = await createDietaryOptionInfo();
    const serviceTimeId = await serviceTimeService.create((await createDietaryOptionInfo()).serviceTime);

    await serviceTimeService.update(expectedDietaryOption.set('id', serviceTimeId));

    const serviceTime = await serviceTimeService.read(serviceTimeId, createCriteriaWthoutConditions());

    expectDietaryOption(serviceTime, expectedDietaryOption, {
      serviceTimeId,
      expectedTag,
      expectedOwnedByUser,
      expectedMaintainedByUsers,
    });
  });
});

describe('delete', () => {
  test('should reject if the provided dietary option Id does not exist', async () => {
    const serviceTimeId = chance.string();

    try {
      await serviceTimeService.delete(serviceTimeId);
    } catch (ex) {
      expect(ex.message).toBe(`No dietary option found with Id: ${serviceTimeId}`);
    }
  });

  test('should delete the existing dietary option', async () => {
    const serviceTimeId = await serviceTimeService.create((await createDietaryOptionInfo()).serviceTime);
    await serviceTimeService.delete(serviceTimeId);

    try {
      await serviceTimeService.delete(serviceTimeId);
    } catch (ex) {
      expect(ex.message).toBe(`No dietary option found with Id: ${serviceTimeId}`);
    }
  });
});

describe('search', () => {
  test('should return no dietary option if provided criteria matches no dietary option', async () => {
    const serviceTimes = await serviceTimeService.search(createCriteria());

    expect(serviceTimes.count()).toBe(0);
  });

  test('should return the dietary option matches the criteria', async () => {
    const {
      serviceTime: expectedDietaryOption,
      tag: expectedTag,
      ownedByUser: expectedOwnedByUser,
      maintainedByUsers: expectedMaintainedByUsers,
    } = await createDietaryOptionInfo();
    const results = Immutable.fromJS(
      await Promise.all(
        Range(0, chance.integer({ min: 1, max: 10 }))
          .map(async () => serviceTimeService.create(expectedDietaryOption))
          .toArray(),
      ),
    );
    const serviceTimes = await serviceTimeService.search(createCriteria(expectedDietaryOption));

    expect(serviceTimes.count).toBe(results.count);
    serviceTimes.forEach(serviceTime => {
      expect(results.find(_ => _.localeCompare(serviceTime.get('id')) === 0)).toBeDefined();
      expectDietaryOption(serviceTime, expectedDietaryOption, {
        serviceTimeId: serviceTime.get('id'),
        expectedTag,
        expectedOwnedByUser,
        expectedMaintainedByUsers,
      });
    });
  });
});

describe('searchAll', () => {
  test('should return no dietary option if provided criteria matches no dietary option', async () => {
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

  test('should return the dietary option matches the criteria', async () => {
    const {
      serviceTime: expectedDietaryOption,
      tag: expectedTag,
      ownedByUser: expectedOwnedByUser,
      maintainedByUsers: expectedMaintainedByUsers,
    } = await createDietaryOptionInfo();
    const results = Immutable.fromJS(
      await Promise.all(
        Range(0, chance.integer({ min: 2, max: 5 }))
          .map(async () => serviceTimeService.create(expectedDietaryOption))
          .toArray(),
      ),
    );

    let serviceTimes = List();
    const result = serviceTimeService.searchAll(createCriteria(expectedDietaryOption));

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
      expectDietaryOption(serviceTime, expectedDietaryOption, {
        serviceTimeId: serviceTime.get('id'),
        expectedTag,
        expectedOwnedByUser,
        expectedMaintainedByUsers,
      });
    });
  });
});

describe('exists', () => {
  test('should return false if no dietary option match provided criteria', async () => {
    expect(await serviceTimeService.exists(createCriteria())).toBeFalsy();
  });

  test('should return true if any dietary option match provided criteria', async () => {
    const serviceTimes = await createDietaryOptions(chance.integer({ min: 1, max: 10 }), true);

    expect(await serviceTimeService.exists(createCriteria(serviceTimes.first()))).toBeTruthy();
  });
});

describe('count', () => {
  test('should return 0 if no dietary option match provided criteria', async () => {
    expect(await serviceTimeService.count(createCriteria())).toBe(0);
  });

  test('should return the count of dietary option match provided criteria', async () => {
    const serviceTimes = await createDietaryOptions(chance.integer({ min: 1, max: 10 }), true);

    expect(await serviceTimeService.count(createCriteria(serviceTimes.first()))).toBe(serviceTimes.count());
  });
});
