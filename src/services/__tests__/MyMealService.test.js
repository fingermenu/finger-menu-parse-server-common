// @flow

import Chance from 'chance';
import Immutable, { List, Map, Range } from 'immutable';
import uuid from 'uuid/v4';
import '../../../bootstrap';
import { MyMealService } from '../';
import { createMyMealInfo, expectMyMeal } from '../../schema/__tests__/MyMeal.test';

const chance = new Chance();
const myMealService = new MyMealService();

const createCriteriaWthoutConditions = () =>
  Map({
    fields: List.of('name', 'description', 'mealPageUrl', 'imageUrl', 'tags', 'ownedByUser', 'maintainedByUsers'),
    include_tags: true,
    include_ownedByUser: true,
    include_maintainedByUsers: true,
  });

const createCriteria = myMeal =>
  Map({
    conditions: Map({
      name: myMeal ? myMeal.get('name') : uuid(),
      description: myMeal ? myMeal.get('description') : uuid(),
      mealPageUrl: myMeal ? myMeal.get('mealPageUrl') : uuid(),
      imageUrl: myMeal ? myMeal.get('imageUrl') : uuid(),
      tagIds: myMeal ? myMeal.get('tagIds') : List.of(uuid(), uuid()),
      ownedByUserId: myMeal ? myMeal.get('ownedByUserId') : uuid(),
      maintainedByUserIds: myMeal ? myMeal.get('maintainedByUserIds') : List.of(uuid(), uuid()),
    }),
  }).merge(createCriteriaWthoutConditions());

const createMyMeals = async (count, useSameInfo = false) => {
  let myMeal;

  if (useSameInfo) {
    const { myMeal: tempMyMeal } = await createMyMealInfo();

    myMeal = tempMyMeal;
  }

  return Immutable.fromJS(await Promise.all(Range(0, count)
    .map(async () => {
      let finalMyMeal;

      if (useSameInfo) {
        finalMyMeal = myMeal;
      } else {
        const { myMeal: tempMyMeal } = await createMyMealInfo();

        finalMyMeal = tempMyMeal;
      }

      return myMealService.read(await myMealService.create(finalMyMeal), createCriteriaWthoutConditions());
    })
    .toArray()));
};

export default createMyMeals;

describe('create', () => {
  test('should return the created my meal Id', async () => {
    const myMealId = await myMealService.create((await createMyMealInfo()).myMeal);

    expect(myMealId).toBeDefined();
  });

  test('should create the my meal', async () => {
    const { myMeal } = await createMyMealInfo();
    const myMealId = await myMealService.create(myMeal);
    const fetchedMyMeal = await myMealService.read(myMealId, createCriteriaWthoutConditions());

    expect(fetchedMyMeal).toBeDefined();
  });
});

describe('read', () => {
  test('should reject if the provided my meal Id does not exist', async () => {
    const myMealId = uuid();

    try {
      await myMealService.read(myMealId);
    } catch (ex) {
      expect(ex.message).toBe(`No my meal found with Id: ${myMealId}`);
    }
  });

  test('should read the existing my meal', async () => {
    const {
      myMeal: expectedMyMeal,
      tags: expectedTags,
      ownedByUser: expectedOwnedByUser,
      maintainedByUsers: expectedMaintainedByUsers,
    } = await createMyMealInfo();
    const myMealId = await myMealService.create(expectedMyMeal);
    const myMeal = await myMealService.read(myMealId, createCriteriaWthoutConditions());

    expectMyMeal(myMeal, expectedMyMeal, {
      myMealId,
      expectedTags,
      expectedOwnedByUser,
      expectedMaintainedByUsers,
    });
  });
});

describe('update', () => {
  test('should reject if the provided my meal Id does not exist', async () => {
    const myMealId = uuid();

    try {
      const myMeal = await myMealService.read(await myMealService.create((await createMyMealInfo()).myMeal), createCriteriaWthoutConditions());

      await myMealService.update(myMeal.set('id', myMealId));
    } catch (ex) {
      expect(ex.message).toBe(`No my meal found with Id: ${myMealId}`);
    }
  });

  test('should return the Id of the updated my meal', async () => {
    const { myMeal: expectedMyMeal } = await createMyMealInfo();
    const myMealId = await myMealService.create((await createMyMealInfo()).myMeal);
    const id = await myMealService.update(expectedMyMeal.set('id', myMealId));

    expect(id).toBe(myMealId);
  });

  test('should update the existing my meal', async () => {
    const {
      myMeal: expectedMyMeal,
      tags: expectedTags,
      ownedByUser: expectedOwnedByUser,
      maintainedByUsers: expectedMaintainedByUsers,
    } = await createMyMealInfo();
    const myMealId = await myMealService.create((await createMyMealInfo()).myMeal);

    await myMealService.update(expectedMyMeal.set('id', myMealId));

    const myMeal = await myMealService.read(myMealId, createCriteriaWthoutConditions());

    expectMyMeal(myMeal, expectedMyMeal, {
      myMealId,
      expectedTags,
      expectedOwnedByUser,
      expectedMaintainedByUsers,
    });
  });
});

describe('delete', () => {
  test('should reject if the provided my meal Id does not exist', async () => {
    const myMealId = uuid();

    try {
      await myMealService.delete(myMealId);
    } catch (ex) {
      expect(ex.message).toBe(`No my meal found with Id: ${myMealId}`);
    }
  });

  test('should delete the existing my meal', async () => {
    const myMealId = await myMealService.create((await createMyMealInfo()).myMeal);
    await myMealService.delete(myMealId);

    try {
      await myMealService.delete(myMealId);
    } catch (ex) {
      expect(ex.message).toBe(`No my meal found with Id: ${myMealId}`);
    }
  });
});

describe('search', () => {
  test('should return no my meal if provided criteria matches no my meal', async () => {
    const myMeals = await myMealService.search(createCriteria());

    expect(myMeals.count()).toBe(0);
  });

  test('should return the my meal matches the criteria', async () => {
    const {
      myMeal: expectedMyMeal,
      tags: expectedTags,
      ownedByUser: expectedOwnedByUser,
      maintainedByUsers: expectedMaintainedByUsers,
    } = await createMyMealInfo();
    const results = Immutable.fromJS(await Promise.all(Range(0, chance.integer({ min: 1, max: 10 }))
      .map(async () => myMealService.create(expectedMyMeal))
      .toArray()));
    const myMeals = await myMealService.search(createCriteria(expectedMyMeal));

    expect(myMeals.count).toBe(results.count);
    myMeals.forEach((myMeal) => {
      expect(results.find(_ => _.localeCompare(myMeal.get('id')) === 0)).toBeDefined();
      expectMyMeal(myMeal, expectedMyMeal, {
        myMealId: myMeal.get('id'),
        expectedTags,
        expectedOwnedByUser,
        expectedMaintainedByUsers,
      });
    });
  });
});

describe('searchAll', () => {
  test('should return no my meal if provided criteria matches no my meal', async () => {
    let myMeals = List();
    const result = myMealService.searchAll(createCriteria());

    try {
      result.event.subscribe((info) => {
        myMeals = myMeals.push(info);
      });

      await result.promise;
    } finally {
      result.event.unsubscribeAll();
    }

    expect(myMeals.count()).toBe(0);
  });

  test('should return the my meal matches the criteria', async () => {
    const {
      myMeal: expectedMyMeal,
      tags: expectedTags,

      ownedByUser: expectedOwnedByUser,
      maintainedByUsers: expectedMaintainedByUsers,
    } = await createMyMealInfo();
    const results = Immutable.fromJS(await Promise.all(Range(0, chance.integer({ min: 2, max: 5 }))
      .map(async () => myMealService.create(expectedMyMeal))
      .toArray()));

    let myMeals = List();
    const result = myMealService.searchAll(createCriteria(expectedMyMeal));

    try {
      result.event.subscribe((info) => {
        myMeals = myMeals.push(info);
      });

      await result.promise;
    } finally {
      result.event.unsubscribeAll();
    }

    expect(myMeals.count).toBe(results.count);
    myMeals.forEach((myMeal) => {
      expect(results.find(_ => _.localeCompare(myMeal.get('id')) === 0)).toBeDefined();
      expectMyMeal(myMeal, expectedMyMeal, {
        myMealId: myMeal.get('id'),
        expectedTags,
        expectedOwnedByUser,
        expectedMaintainedByUsers,
      });
    });
  });
});

describe('exists', () => {
  test('should return false if no my meal match provided criteria', async () => {
    expect(await myMealService.exists(createCriteria())).toBeFalsy();
  });

  test('should return true if any my meal match provided criteria', async () => {
    const myMeals = await createMyMeals(chance.integer({ min: 1, max: 10 }), true);

    expect(await myMealService.exists(createCriteria(myMeals.first()))).toBeTruthy();
  });
});

describe('count', () => {
  test('should return 0 if no my meal match provided criteria', async () => {
    expect(await myMealService.count(createCriteria())).toBe(0);
  });

  test('should return the count of my meal match provided criteria', async () => {
    const myMeals = await createMyMeals(chance.integer({ min: 1, max: 10 }), true);

    expect(await myMealService.count(createCriteria(myMeals.first()))).toBe(myMeals.count());
  });
});
