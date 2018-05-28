// @flow

import Chance from 'chance';
import Immutable, { List, Map, Range } from 'immutable';
import '../../../bootstrap';
import { DepartmentCategoryService } from '..';
import { createDepartmentCategoryInfo, expectDepartmentCategory } from '../../schema/__tests__/DepartmentCategory.test';

const chance = new Chance();
const serviceTimeService = new DepartmentCategoryService();

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

const createDepartmentCategorys = async (count, useSameInfo = false) => {
  let serviceTime;

  if (useSameInfo) {
    const { serviceTime: tempDepartmentCategory } = await createDepartmentCategoryInfo();

    serviceTime = tempDepartmentCategory;
  }

  return Immutable.fromJS(
    await Promise.all(
      Range(0, count)
        .map(async () => {
          let finalDepartmentCategory;

          if (useSameInfo) {
            finalDepartmentCategory = serviceTime;
          } else {
            const { serviceTime: tempDepartmentCategory } = await createDepartmentCategoryInfo();

            finalDepartmentCategory = tempDepartmentCategory;
          }

          return serviceTimeService.read(await serviceTimeService.create(finalDepartmentCategory), createCriteriaWthoutConditions());
        })
        .toArray(),
    ),
  );
};

export default createDepartmentCategorys;

describe('create', () => {
  test('should return the created department category Id', async () => {
    const serviceTimeId = await serviceTimeService.create((await createDepartmentCategoryInfo()).serviceTime);

    expect(serviceTimeId).toBeDefined();
  });

  test('should create the department category', async () => {
    const { serviceTime } = await createDepartmentCategoryInfo();
    const serviceTimeId = await serviceTimeService.create(serviceTime);
    const fetchedDepartmentCategory = await serviceTimeService.read(serviceTimeId, createCriteriaWthoutConditions());

    expect(fetchedDepartmentCategory).toBeDefined();
  });
});

describe('read', () => {
  test('should reject if the provided department category Id does not exist', async () => {
    const serviceTimeId = chance.string();

    try {
      await serviceTimeService.read(serviceTimeId);
    } catch (ex) {
      expect(ex.message).toBe(`No department category found with Id: ${serviceTimeId}`);
    }
  });

  test('should read the existing department category', async () => {
    const {
      serviceTime: expectedDepartmentCategory,
      tag: expectedTag,
      ownedByUser: expectedOwnedByUser,
      maintainedByUsers: expectedMaintainedByUsers,
    } = await createDepartmentCategoryInfo();
    const serviceTimeId = await serviceTimeService.create(expectedDepartmentCategory);
    const serviceTime = await serviceTimeService.read(serviceTimeId, createCriteriaWthoutConditions());

    expectDepartmentCategory(serviceTime, expectedDepartmentCategory, {
      serviceTimeId,
      expectedTag,
      expectedOwnedByUser,
      expectedMaintainedByUsers,
    });
  });
});

describe('update', () => {
  test('should reject if the provided department category Id does not exist', async () => {
    const serviceTimeId = chance.string();

    try {
      const serviceTime = await serviceTimeService.read(
        await serviceTimeService.create((await createDepartmentCategoryInfo()).serviceTime),
        createCriteriaWthoutConditions(),
      );

      await serviceTimeService.update(serviceTime.set('id', serviceTimeId));
    } catch (ex) {
      expect(ex.message).toBe(`No department category found with Id: ${serviceTimeId}`);
    }
  });

  test('should return the Id of the updated department category', async () => {
    const { serviceTime: expectedDepartmentCategory } = await createDepartmentCategoryInfo();
    const serviceTimeId = await serviceTimeService.create((await createDepartmentCategoryInfo()).serviceTime);
    const id = await serviceTimeService.update(expectedDepartmentCategory.set('id', serviceTimeId));

    expect(id).toBe(serviceTimeId);
  });

  test('should update the existing department category', async () => {
    const {
      serviceTime: expectedDepartmentCategory,
      tag: expectedTag,
      ownedByUser: expectedOwnedByUser,
      maintainedByUsers: expectedMaintainedByUsers,
    } = await createDepartmentCategoryInfo();
    const serviceTimeId = await serviceTimeService.create((await createDepartmentCategoryInfo()).serviceTime);

    await serviceTimeService.update(expectedDepartmentCategory.set('id', serviceTimeId));

    const serviceTime = await serviceTimeService.read(serviceTimeId, createCriteriaWthoutConditions());

    expectDepartmentCategory(serviceTime, expectedDepartmentCategory, {
      serviceTimeId,
      expectedTag,
      expectedOwnedByUser,
      expectedMaintainedByUsers,
    });
  });
});

describe('delete', () => {
  test('should reject if the provided department category Id does not exist', async () => {
    const serviceTimeId = chance.string();

    try {
      await serviceTimeService.delete(serviceTimeId);
    } catch (ex) {
      expect(ex.message).toBe(`No department category found with Id: ${serviceTimeId}`);
    }
  });

  test('should delete the existing department category', async () => {
    const serviceTimeId = await serviceTimeService.create((await createDepartmentCategoryInfo()).serviceTime);
    await serviceTimeService.delete(serviceTimeId);

    try {
      await serviceTimeService.delete(serviceTimeId);
    } catch (ex) {
      expect(ex.message).toBe(`No department category found with Id: ${serviceTimeId}`);
    }
  });
});

describe('search', () => {
  test('should return no department category if provided criteria matches no department category', async () => {
    const serviceTimes = await serviceTimeService.search(createCriteria());

    expect(serviceTimes.count()).toBe(0);
  });

  test('should return the department category matches the criteria', async () => {
    const {
      serviceTime: expectedDepartmentCategory,
      tag: expectedTag,
      ownedByUser: expectedOwnedByUser,
      maintainedByUsers: expectedMaintainedByUsers,
    } = await createDepartmentCategoryInfo();
    const results = Immutable.fromJS(
      await Promise.all(
        Range(0, chance.integer({ min: 1, max: 10 }))
          .map(async () => serviceTimeService.create(expectedDepartmentCategory))
          .toArray(),
      ),
    );
    const serviceTimes = await serviceTimeService.search(createCriteria(expectedDepartmentCategory));

    expect(serviceTimes.count).toBe(results.count);
    serviceTimes.forEach(serviceTime => {
      expect(results.find(_ => _.localeCompare(serviceTime.get('id')) === 0)).toBeDefined();
      expectDepartmentCategory(serviceTime, expectedDepartmentCategory, {
        serviceTimeId: serviceTime.get('id'),
        expectedTag,
        expectedOwnedByUser,
        expectedMaintainedByUsers,
      });
    });
  });
});

describe('searchAll', () => {
  test('should return no department category if provided criteria matches no department category', async () => {
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

  test('should return the department category matches the criteria', async () => {
    const {
      serviceTime: expectedDepartmentCategory,
      tag: expectedTag,
      ownedByUser: expectedOwnedByUser,
      maintainedByUsers: expectedMaintainedByUsers,
    } = await createDepartmentCategoryInfo();
    const results = Immutable.fromJS(
      await Promise.all(
        Range(0, chance.integer({ min: 2, max: 5 }))
          .map(async () => serviceTimeService.create(expectedDepartmentCategory))
          .toArray(),
      ),
    );

    let serviceTimes = List();
    const result = serviceTimeService.searchAll(createCriteria(expectedDepartmentCategory));

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
      expectDepartmentCategory(serviceTime, expectedDepartmentCategory, {
        serviceTimeId: serviceTime.get('id'),
        expectedTag,
        expectedOwnedByUser,
        expectedMaintainedByUsers,
      });
    });
  });
});

describe('exists', () => {
  test('should return false if no department category match provided criteria', async () => {
    expect(await serviceTimeService.exists(createCriteria())).toBeFalsy();
  });

  test('should return true if any department category match provided criteria', async () => {
    const serviceTimes = await createDepartmentCategorys(chance.integer({ min: 1, max: 10 }), true);

    expect(await serviceTimeService.exists(createCriteria(serviceTimes.first()))).toBeTruthy();
  });
});

describe('count', () => {
  test('should return 0 if no department category match provided criteria', async () => {
    expect(await serviceTimeService.count(createCriteria())).toBe(0);
  });

  test('should return the count of department category match provided criteria', async () => {
    const serviceTimes = await createDepartmentCategorys(chance.integer({ min: 1, max: 10 }), true);

    expect(await serviceTimeService.count(createCriteria(serviceTimes.first()))).toBe(serviceTimes.count());
  });
});
