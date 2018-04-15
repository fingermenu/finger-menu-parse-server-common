// @flow

import Chance from 'chance';
import Immutable, { List, Map, Range } from 'immutable';
import '../../../bootstrap';
import { SizeService } from '../';
import { createSizeInfo, expectSize } from '../../schema/__tests__/Size.test';

const chance = new Chance();
const serviceTimeService = new SizeService();

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

const createSizes = async (count, useSameInfo = false) => {
  let serviceTime;

  if (useSameInfo) {
    const { serviceTime: tempSize } = await createSizeInfo();

    serviceTime = tempSize;
  }

  return Immutable.fromJS(
    await Promise.all(
      Range(0, count)
        .map(async () => {
          let finalSize;

          if (useSameInfo) {
            finalSize = serviceTime;
          } else {
            const { serviceTime: tempSize } = await createSizeInfo();

            finalSize = tempSize;
          }

          return serviceTimeService.read(await serviceTimeService.create(finalSize), createCriteriaWthoutConditions());
        })
        .toArray(),
    ),
  );
};

export default createSizes;

describe('create', () => {
  test('should return the created size Id', async () => {
    const serviceTimeId = await serviceTimeService.create((await createSizeInfo()).serviceTime);

    expect(serviceTimeId).toBeDefined();
  });

  test('should create the size', async () => {
    const { serviceTime } = await createSizeInfo();
    const serviceTimeId = await serviceTimeService.create(serviceTime);
    const fetchedSize = await serviceTimeService.read(serviceTimeId, createCriteriaWthoutConditions());

    expect(fetchedSize).toBeDefined();
  });
});

describe('read', () => {
  test('should reject if the provided size Id does not exist', async () => {
    const serviceTimeId = chance.string();

    try {
      await serviceTimeService.read(serviceTimeId);
    } catch (ex) {
      expect(ex.message).toBe(`No size found with Id: ${serviceTimeId}`);
    }
  });

  test('should read the existing size', async () => {
    const {
      serviceTime: expectedSize,
      tag: expectedTag,
      ownedByUser: expectedOwnedByUser,
      maintainedByUsers: expectedMaintainedByUsers,
    } = await createSizeInfo();
    const serviceTimeId = await serviceTimeService.create(expectedSize);
    const serviceTime = await serviceTimeService.read(serviceTimeId, createCriteriaWthoutConditions());

    expectSize(serviceTime, expectedSize, {
      serviceTimeId,
      expectedTag,
      expectedOwnedByUser,
      expectedMaintainedByUsers,
    });
  });
});

describe('update', () => {
  test('should reject if the provided size Id does not exist', async () => {
    const serviceTimeId = chance.string();

    try {
      const serviceTime = await serviceTimeService.read(
        await serviceTimeService.create((await createSizeInfo()).serviceTime),
        createCriteriaWthoutConditions(),
      );

      await serviceTimeService.update(serviceTime.set('id', serviceTimeId));
    } catch (ex) {
      expect(ex.message).toBe(`No size found with Id: ${serviceTimeId}`);
    }
  });

  test('should return the Id of the updated size', async () => {
    const { serviceTime: expectedSize } = await createSizeInfo();
    const serviceTimeId = await serviceTimeService.create((await createSizeInfo()).serviceTime);
    const id = await serviceTimeService.update(expectedSize.set('id', serviceTimeId));

    expect(id).toBe(serviceTimeId);
  });

  test('should update the existing size', async () => {
    const {
      serviceTime: expectedSize,
      tag: expectedTag,
      ownedByUser: expectedOwnedByUser,
      maintainedByUsers: expectedMaintainedByUsers,
    } = await createSizeInfo();
    const serviceTimeId = await serviceTimeService.create((await createSizeInfo()).serviceTime);

    await serviceTimeService.update(expectedSize.set('id', serviceTimeId));

    const serviceTime = await serviceTimeService.read(serviceTimeId, createCriteriaWthoutConditions());

    expectSize(serviceTime, expectedSize, {
      serviceTimeId,
      expectedTag,
      expectedOwnedByUser,
      expectedMaintainedByUsers,
    });
  });
});

describe('delete', () => {
  test('should reject if the provided size Id does not exist', async () => {
    const serviceTimeId = chance.string();

    try {
      await serviceTimeService.delete(serviceTimeId);
    } catch (ex) {
      expect(ex.message).toBe(`No size found with Id: ${serviceTimeId}`);
    }
  });

  test('should delete the existing size', async () => {
    const serviceTimeId = await serviceTimeService.create((await createSizeInfo()).serviceTime);
    await serviceTimeService.delete(serviceTimeId);

    try {
      await serviceTimeService.delete(serviceTimeId);
    } catch (ex) {
      expect(ex.message).toBe(`No size found with Id: ${serviceTimeId}`);
    }
  });
});

describe('search', () => {
  test('should return no size if provided criteria matches no size', async () => {
    const serviceTimes = await serviceTimeService.search(createCriteria());

    expect(serviceTimes.count()).toBe(0);
  });

  test('should return the size matches the criteria', async () => {
    const {
      serviceTime: expectedSize,
      tag: expectedTag,
      ownedByUser: expectedOwnedByUser,
      maintainedByUsers: expectedMaintainedByUsers,
    } = await createSizeInfo();
    const results = Immutable.fromJS(
      await Promise.all(
        Range(0, chance.integer({ min: 1, max: 10 }))
          .map(async () => serviceTimeService.create(expectedSize))
          .toArray(),
      ),
    );
    const serviceTimes = await serviceTimeService.search(createCriteria(expectedSize));

    expect(serviceTimes.count).toBe(results.count);
    serviceTimes.forEach(serviceTime => {
      expect(results.find(_ => _.localeCompare(serviceTime.get('id')) === 0)).toBeDefined();
      expectSize(serviceTime, expectedSize, {
        serviceTimeId: serviceTime.get('id'),
        expectedTag,
        expectedOwnedByUser,
        expectedMaintainedByUsers,
      });
    });
  });
});

describe('searchAll', () => {
  test('should return no size if provided criteria matches no size', async () => {
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

  test('should return the size matches the criteria', async () => {
    const {
      serviceTime: expectedSize,
      tag: expectedTag,
      ownedByUser: expectedOwnedByUser,
      maintainedByUsers: expectedMaintainedByUsers,
    } = await createSizeInfo();
    const results = Immutable.fromJS(
      await Promise.all(
        Range(0, chance.integer({ min: 2, max: 5 }))
          .map(async () => serviceTimeService.create(expectedSize))
          .toArray(),
      ),
    );

    let serviceTimes = List();
    const result = serviceTimeService.searchAll(createCriteria(expectedSize));

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
      expectSize(serviceTime, expectedSize, {
        serviceTimeId: serviceTime.get('id'),
        expectedTag,
        expectedOwnedByUser,
        expectedMaintainedByUsers,
      });
    });
  });
});

describe('exists', () => {
  test('should return false if no size match provided criteria', async () => {
    expect(await serviceTimeService.exists(createCriteria())).toBeFalsy();
  });

  test('should return true if any size match provided criteria', async () => {
    const serviceTimes = await createSizes(chance.integer({ min: 1, max: 10 }), true);

    expect(await serviceTimeService.exists(createCriteria(serviceTimes.first()))).toBeTruthy();
  });
});

describe('count', () => {
  test('should return 0 if no size match provided criteria', async () => {
    expect(await serviceTimeService.count(createCriteria())).toBe(0);
  });

  test('should return the count of size match provided criteria', async () => {
    const serviceTimes = await createSizes(chance.integer({ min: 1, max: 10 }), true);

    expect(await serviceTimeService.count(createCriteria(serviceTimes.first()))).toBe(serviceTimes.count());
  });
});
