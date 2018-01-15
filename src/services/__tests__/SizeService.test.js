// @flow

import Chance from 'chance';
import Immutable, { List, Map, Range } from 'immutable';
import '../../../bootstrap';
import { SizeService } from '../';
import { createSizeInfo, expectSize } from '../../schema/__tests__/Size.test';

const chance = new Chance();
const sizeService = new SizeService();

const getLanguages = (object) => {
  const languages = object ? object.get('name').keySeq() : List();
  const language = languages.isEmpty() ? null : languages.first();

  return { languages, language };
};

const createCriteriaWthoutConditions = (languages, language) =>
  Map({
    fields: List.of('languages_name', 'ownedByUser', 'maintainedByUsers').concat(languages ? languages.map(_ => `${_}_name`) : List()),
    language,
    include_ownedByUser: true,
    include_maintainedByUsers: true,
  });

const createCriteria = (object) => {
  const { language, languages } = getLanguages(object);

  return Map({
    conditions: Map({
      name: language ? object.get('name').get(language) : chance.string(),
      ownedByUserId: object ? object.get('ownedByUserId') : chance.string(),
      maintainedByUserIds: object ? object.get('maintainedByUserIds') : List.of(chance.string(), chance.string()),
    }),
  }).merge(createCriteriaWthoutConditions(languages, language));
};

const createSizes = async (count, useSameInfo = false) => {
  let size;

  if (useSameInfo) {
    const { size: tempSize } = await createSizeInfo();

    size = tempSize;
  }

  return Immutable.fromJS(await Promise.all(Range(0, count)
    .map(async () => {
      let finalSize;

      if (useSameInfo) {
        finalSize = size;
      } else {
        const { size: tempSize } = await createSizeInfo();

        finalSize = tempSize;
      }

      return sizeService.read(await sizeService.create(finalSize), createCriteriaWthoutConditions());
    })
    .toArray()));
};

export default createSizes;

describe('create', () => {
  test('should return the created size Id', async () => {
    const sizeId = await sizeService.create((await createSizeInfo()).size);

    expect(sizeId).toBeDefined();
  });

  test('should create the size', async () => {
    const { size } = await createSizeInfo();
    const sizeId = await sizeService.create(size);
    const fetchedSize = await sizeService.read(sizeId, createCriteriaWthoutConditions());

    expect(fetchedSize).toBeDefined();
  });
});

describe('read', () => {
  test('should reject if the provided size Id does not exist', async () => {
    const sizeId = chance.string();

    try {
      await sizeService.read(sizeId);
    } catch (ex) {
      expect(ex.message).toBe(`No size found with Id: ${sizeId}`);
    }
  });

  test('should read the existing size', async () => {
    const { size: expectedSize, ownedByUser: expectedOwnedByUser, maintainedByUsers: expectedMaintainedByUsers } = await createSizeInfo();
    const sizeId = await sizeService.create(expectedSize);
    const size = await sizeService.read(sizeId, createCriteriaWthoutConditions());

    expectSize(size, expectedSize, {
      sizeId,
      expectedOwnedByUser,
      expectedMaintainedByUsers,
    });
  });
});

describe('update', () => {
  test('should reject if the provided size Id does not exist', async () => {
    const sizeId = chance.string();

    try {
      const size = await sizeService.read(await sizeService.create((await createSizeInfo()).size), createCriteriaWthoutConditions());

      await sizeService.update(size.set('id', sizeId));
    } catch (ex) {
      expect(ex.message).toBe(`No size found with Id: ${sizeId}`);
    }
  });

  test('should return the Id of the updated size', async () => {
    const { size: expectedSize } = await createSizeInfo();
    const sizeId = await sizeService.create((await createSizeInfo()).size);
    const id = await sizeService.update(expectedSize.set('id', sizeId));

    expect(id).toBe(sizeId);
  });

  test('should update the existing size', async () => {
    const { size: expectedSize, ownedByUser: expectedOwnedByUser, maintainedByUsers: expectedMaintainedByUsers } = await createSizeInfo();
    const sizeId = await sizeService.create((await createSizeInfo()).size);

    await sizeService.update(expectedSize.set('id', sizeId));

    const size = await sizeService.read(sizeId, createCriteriaWthoutConditions());

    expectSize(size, expectedSize, {
      sizeId,
      expectedOwnedByUser,
      expectedMaintainedByUsers,
    });
  });
});

describe('delete', () => {
  test('should reject if the provided size Id does not exist', async () => {
    const sizeId = chance.string();

    try {
      await sizeService.delete(sizeId);
    } catch (ex) {
      expect(ex.message).toBe(`No size found with Id: ${sizeId}`);
    }
  });

  test('should delete the existing size', async () => {
    const sizeId = await sizeService.create((await createSizeInfo()).size);
    await sizeService.delete(sizeId);

    try {
      await sizeService.delete(sizeId);
    } catch (ex) {
      expect(ex.message).toBe(`No size found with Id: ${sizeId}`);
    }
  });
});

describe('search', () => {
  test('should return no size if provided criteria matches no size', async () => {
    const sizes = await sizeService.search(createCriteria());

    expect(sizes.count()).toBe(0);
  });

  test('should return the size matches the criteria', async () => {
    const { size: expectedSize, ownedByUser: expectedOwnedByUser, maintainedByUsers: expectedMaintainedByUsers } = await createSizeInfo();
    const results = Immutable.fromJS(await Promise.all(Range(0, chance.integer({ min: 1, max: 10 }))
      .map(async () => sizeService.create(expectedSize))
      .toArray()));
    const sizes = await sizeService.search(createCriteria(expectedSize));

    expect(sizes.count).toBe(results.count);
    sizes.forEach((size) => {
      expect(results.find(_ => _.localeCompare(size.get('id')) === 0)).toBeDefined();
      expectSize(size, expectedSize, {
        sizeId: size.get('id'),
        expectedOwnedByUser,
        expectedMaintainedByUsers,
      });
    });
  });
});

describe('searchAll', () => {
  test('should return no size if provided criteria matches no size', async () => {
    let sizes = List();
    const result = sizeService.searchAll(createCriteria());

    try {
      result.event.subscribe((info) => {
        sizes = sizes.push(info);
      });

      await result.promise;
    } finally {
      result.event.unsubscribeAll();
    }

    expect(sizes.count()).toBe(0);
  });

  test('should return the size matches the criteria', async () => {
    const { size: expectedSize, ownedByUser: expectedOwnedByUser, maintainedByUsers: expectedMaintainedByUsers } = await createSizeInfo();
    const results = Immutable.fromJS(await Promise.all(Range(0, chance.integer({ min: 2, max: 5 }))
      .map(async () => sizeService.create(expectedSize))
      .toArray()));

    let sizes = List();
    const result = sizeService.searchAll(createCriteria(expectedSize));

    try {
      result.event.subscribe((info) => {
        sizes = sizes.push(info);
      });

      await result.promise;
    } finally {
      result.event.unsubscribeAll();
    }

    expect(sizes.count).toBe(results.count);
    sizes.forEach((size) => {
      expect(results.find(_ => _.localeCompare(size.get('id')) === 0)).toBeDefined();
      expectSize(size, expectedSize, {
        sizeId: size.get('id'),
        expectedOwnedByUser,
        expectedMaintainedByUsers,
      });
    });
  });
});

describe('exists', () => {
  test('should return false if no size match provided criteria', async () => {
    expect(await sizeService.exists(createCriteria())).toBeFalsy();
  });

  test('should return true if any size match provided criteria', async () => {
    const sizes = await createSizes(chance.integer({ min: 1, max: 10 }), true);

    expect(await sizeService.exists(createCriteria(sizes.first()))).toBeTruthy();
  });
});

describe('count', () => {
  test('should return 0 if no size match provided criteria', async () => {
    expect(await sizeService.count(createCriteria())).toBe(0);
  });

  test('should return the count of size match provided criteria', async () => {
    const sizes = await createSizes(chance.integer({ min: 1, max: 10 }), true);

    expect(await sizeService.count(createCriteria(sizes.first()))).toBe(sizes.count());
  });
});
