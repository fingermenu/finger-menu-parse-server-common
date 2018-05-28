// @flow

import Chance from 'chance';
import Immutable, { List, Map, Range } from 'immutable';
import '../../../bootstrap';
import { PackageBundleService } from '..';
import { createPackageBundleInfo, expectPackageBundle } from '../../schema/__tests__/PackageBundle.test';

const chance = new Chance();
const packageBundleService = new PackageBundleService();

const createCriteriaWthoutConditions = () =>
  Map({
    fields: List.of('url', 'checksum', 'restaurant'),
    include_restaurant: true,
  });

const createCriteria = object =>
  Map({
    conditions: Map({
      url: object ? object.get('url') : chance.string(),
      checksum: object ? object.get('checksum') : chance.string(),
      restaurantId: object ? object.get('restaurantId') : chance.string(),
    }),
  });

const createPackageBundles = async (count, useSameInfo = false) => {
  let packageBundle;

  if (useSameInfo) {
    const { packageBundle: tempPackageBundle } = await createPackageBundleInfo();

    packageBundle = tempPackageBundle;
  }

  return Immutable.fromJS(
    await Promise.all(
      Range(0, count)
        .map(async () => {
          let finalPackageBundle;

          if (useSameInfo) {
            finalPackageBundle = packageBundle;
          } else {
            const { packageBundle: tempPackageBundle } = await createPackageBundleInfo();

            finalPackageBundle = tempPackageBundle;
          }

          return packageBundleService.read(await packageBundleService.create(finalPackageBundle), createCriteriaWthoutConditions());
        })
        .toArray(),
    ),
  );
};

export default createPackageBundles;

describe('create', () => {
  test('should return the created package bundle Id', async () => {
    const packageBundleId = await packageBundleService.create((await createPackageBundleInfo()).packageBundle);

    expect(packageBundleId).toBeDefined();
  });

  test('should create the package bundle', async () => {
    const { packageBundle } = await createPackageBundleInfo();
    const packageBundleId = await packageBundleService.create(packageBundle);
    const fetchedPackageBundle = await packageBundleService.read(packageBundleId, createCriteriaWthoutConditions());

    expect(fetchedPackageBundle).toBeDefined();
  });
});

describe('read', () => {
  test('should reject if the provided package bundle Id does not exist', async () => {
    const packageBundleId = chance.string();

    try {
      await packageBundleService.read(packageBundleId);
    } catch (ex) {
      expect(ex.message).toBe(`No package bundle found with Id: ${packageBundleId}`);
    }
  });

  test('should read the existing package bundle', async () => {
    const { packageBundle: expectedPackageBundle, restaurant: expectedRestaurant } = await createPackageBundleInfo();
    const packageBundleId = await packageBundleService.create(expectedPackageBundle);
    const packageBundle = await packageBundleService.read(packageBundleId, createCriteriaWthoutConditions());

    expectPackageBundle(packageBundle, expectedPackageBundle, {
      packageBundleId,
      expectedRestaurant,
    });
  });
});

describe('update', () => {
  test('should reject if the provided package bundle Id does not exist', async () => {
    const packageBundleId = chance.string();

    try {
      const packageBundle = await packageBundleService.read(
        await packageBundleService.create((await createPackageBundleInfo()).packageBundle),
        createCriteriaWthoutConditions(),
      );

      await packageBundleService.update(packageBundle.set('id', packageBundleId));
    } catch (ex) {
      expect(ex.message).toBe(`No package bundle found with Id: ${packageBundleId}`);
    }
  });

  test('should return the Id of the updated package bundle', async () => {
    const { packageBundle: expectedPackageBundle } = await createPackageBundleInfo();
    const packageBundleId = await packageBundleService.create((await createPackageBundleInfo()).packageBundle);
    const id = await packageBundleService.update(expectedPackageBundle.set('id', packageBundleId));

    expect(id).toBe(packageBundleId);
  });

  test('should update the existing package bundle', async () => {
    const { packageBundle: expectedPackageBundle, restaurant: expectedRestaurant } = await createPackageBundleInfo();
    const packageBundleId = await packageBundleService.create((await createPackageBundleInfo()).packageBundle);

    await packageBundleService.update(expectedPackageBundle.set('id', packageBundleId));

    const packageBundle = await packageBundleService.read(packageBundleId, createCriteriaWthoutConditions());

    expectPackageBundle(packageBundle, expectedPackageBundle, {
      packageBundleId,
      expectedRestaurant,
    });
  });
});

describe('delete', () => {
  test('should reject if the provided package bundle Id does not exist', async () => {
    const packageBundleId = chance.string();

    try {
      await packageBundleService.delete(packageBundleId);
    } catch (ex) {
      expect(ex.message).toBe(`No package bundle found with Id: ${packageBundleId}`);
    }
  });

  test('should delete the existing package bundle', async () => {
    const packageBundleId = await packageBundleService.create((await createPackageBundleInfo()).packageBundle);
    await packageBundleService.delete(packageBundleId);

    try {
      await packageBundleService.delete(packageBundleId);
    } catch (ex) {
      expect(ex.message).toBe(`No package bundle found with Id: ${packageBundleId}`);
    }
  });
});

describe('search', () => {
  test('should return no package bundle if provided criteria matches no package bundle', async () => {
    const packageBundles = await packageBundleService.search(createCriteria());

    expect(packageBundles.count()).toBe(0);
  });

  test('should return the package bundle matches the criteria', async () => {
    const { packageBundle: expectedPackageBundle, restaurant: expectedRestaurant } = await createPackageBundleInfo();
    const results = Immutable.fromJS(
      await Promise.all(
        Range(0, chance.integer({ min: 1, max: 10 }))
          .map(async () => packageBundleService.create(expectedPackageBundle))
          .toArray(),
      ),
    );
    const packageBundles = await packageBundleService.search(createCriteria(expectedPackageBundle));

    expect(packageBundles.count).toBe(results.count);
    packageBundles.forEach(packageBundle => {
      expect(results.find(_ => _.localeCompare(packageBundle.get('id')) === 0)).toBeDefined();
      expectPackageBundle(packageBundle, expectedPackageBundle, {
        packageBundleId: packageBundle.get('id'),
        expectedRestaurant,
      });
    });
  });
});

describe('searchAll', () => {
  test('should return no package bundle if provided criteria matches no package bundle', async () => {
    let packageBundles = List();
    const result = packageBundleService.searchAll(createCriteria());

    try {
      result.event.subscribe(info => {
        packageBundles = packageBundles.push(info);
      });

      await result.promise;
    } finally {
      result.event.unsubscribeAll();
    }

    expect(packageBundles.count()).toBe(0);
  });

  test('should return the package bundle matches the criteria', async () => {
    const { packageBundle: expectedPackageBundle, restaurant: expectedRestaurant } = await createPackageBundleInfo();
    const results = Immutable.fromJS(
      await Promise.all(
        Range(0, chance.integer({ min: 2, max: 5 }))
          .map(async () => packageBundleService.create(expectedPackageBundle))
          .toArray(),
      ),
    );

    let packageBundles = List();
    const result = packageBundleService.searchAll(createCriteria(expectedPackageBundle));

    try {
      result.event.subscribe(info => {
        packageBundles = packageBundles.push(info);
      });

      await result.promise;
    } finally {
      result.event.unsubscribeAll();
    }

    expect(packageBundles.count).toBe(results.count);
    packageBundles.forEach(packageBundle => {
      expect(results.find(_ => _.localeCompare(packageBundle.get('id')) === 0)).toBeDefined();
      expectPackageBundle(packageBundle, expectedPackageBundle, {
        packageBundleId: packageBundle.get('id'),
        expectedRestaurant,
      });
    });
  });
});

describe('exists', () => {
  test('should return false if no package bundle match provided criteria', async () => {
    expect(await packageBundleService.exists(createCriteria())).toBeFalsy();
  });

  test('should return true if any package bundle match provided criteria', async () => {
    const packageBundles = await createPackageBundles(chance.integer({ min: 1, max: 10 }), true);

    expect(await packageBundleService.exists(createCriteria(packageBundles.first()))).toBeTruthy();
  });
});

describe('count', () => {
  test('should return 0 if no package bundle match provided criteria', async () => {
    expect(await packageBundleService.count(createCriteria())).toBe(0);
  });

  test('should return the count of package bundle match provided criteria', async () => {
    const packageBundles = await createPackageBundles(chance.integer({ min: 1, max: 10 }), true);

    expect(await packageBundleService.count(createCriteria(packageBundles.first()))).toBe(packageBundles.count());
  });
});
