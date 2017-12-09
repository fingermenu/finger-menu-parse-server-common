// @flow

import Chance from 'chance';
import { Map } from 'immutable';
import { ParseWrapperService } from 'micro-business-parse-server-common';
import uuid from 'uuid/v4';
import { MyMeal } from '../';
import createTags from '../../services/__tests__/TagService.test';

const chance = new Chance();

export const createMyMealInfo = async () => {
  const ownedByUser = await ParseWrapperService.createNewUser({ username: `${uuid()}@email.com`, password: '123456' }).signUp();
  const tags = await createTags(chance.integer({ min: 1, max: 1 }));
  const myMeal = Map({
    name: uuid(),
    description: uuid(),
    mealPageUrl: uuid(),
    imageUrl: uuid(),
    tagIds: tags.map(tag => tag.get('id')),
    ownedByUserId: ownedByUser.id,
  });

  return {
    myMeal,
    tags,
    ownedByUser,
  };
};

export const createMyMeal = async object => MyMeal.spawn(object || (await createMyMealInfo()).myMeal);

export const expectMyMeal = (object, expectedObject, { myMealId, expectedTags } = {}) => {
  expect(object.get('name')).toBe(expectedObject.get('name'));
  expect(object.get('description')).toBe(expectedObject.get('description'));
  expect(object.get('mealPageUrl')).toBe(expectedObject.get('mealPageUrl'));
  expect(object.get('imageUrl')).toBe(expectedObject.get('imageUrl'));
  expect(object.get('tagIds')).toEqual(expectedObject.get('tagIds'));
  expect(object.get('ownedByUserId')).toBe(expectedObject.get('ownedByUserId'));

  if (myMealId) {
    expect(object.get('id')).toBe(myMealId);
  }

  if (expectedTags) {
    expect(object.get('tagIds')).toEqual(expectedTags.map(_ => _.get('id')));
  }
};

describe('constructor', () => {
  test('should set class name', async () => {
    expect((await createMyMeal()).className).toBe('MyMeal');
  });
});

describe('static public methods', () => {
  test('spawn should set provided info', async () => {
    const { myMeal } = await createMyMealInfo();
    const object = await createMyMeal(myMeal);
    const info = object.getInfo();

    expectMyMeal(info, myMeal);
  });
});

describe('public methods', () => {
  test('getObject should return provided object', async () => {
    const object = await createMyMeal();

    expect(new MyMeal(object).getObject()).toBe(object);
  });

  test('getId should return provided object Id', async () => {
    const object = await createMyMeal();

    expect(new MyMeal(object).getId()).toBe(object.id);
  });

  test('updateInfo should update object info', async () => {
    const object = await createMyMeal();
    const { myMeal: updatedMyMeal } = await createMyMealInfo();

    object.updateInfo(updatedMyMeal);

    const info = object.getInfo();

    expectMyMeal(info, updatedMyMeal);
  });

  test('getInfo should return provided info', async () => {
    const { myMeal } = await createMyMealInfo();
    const object = await createMyMeal(myMeal);
    const info = object.getInfo();

    expect(info.get('id')).toBe(object.getId());
    expectMyMeal(info, myMeal);
  });
});
