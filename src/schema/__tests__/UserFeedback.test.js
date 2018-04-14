// @flow

import Chance from 'chance';
import { Map } from 'immutable';
import TestHelper from '../../../TestHelper';
import { UserFeedback } from '../';
import createRestaurants from '../../services/__tests__/RestaurantService.test';

const chance = new Chance();

export const createUserFeedbackInfo = async () => {
  const restaurant = (await createRestaurants(1)).first();
  const addedByUser = await TestHelper.createUser();
  const servingTime = Map({
    questionAndAnswers: TestHelper.createRandomList(),
    others: chance.string(),
    submittedAt: new Date(),
    restaurantId: restaurant.get('id'),
    addedByUserId: addedByUser.id,
  });

  return {
    servingTime,
    restaurant,
    addedByUser,
  };
};

export const createUserFeedback = async object => UserFeedback.spawn(object || (await createUserFeedbackInfo()).servingTime);

export const expectUserFeedback = (object, expectedObject, { servingTimeId, expectedRestaurant } = {}) => {
  expect(object.get('questionAndAnswers')).toEqual(expectedObject.get('questionAndAnswers'));
  expect(object.get('others')).toBe(expectedObject.get('others'));
  expect(object.get('submittedAt')).toBe(expectedObject.get('submittedAt'));
  expect(object.get('restaurantId')).toBe(expectedObject.get('restaurantId'));
  expect(object.get('addedByUserId')).toBe(expectedObject.get('addedByUserId'));

  if (servingTimeId) {
    expect(object.get('id')).toBe(servingTimeId);
  }

  if (expectedRestaurant) {
    expect(object.get('restaurantId')).toEqual(expectedRestaurant.get('id'));
  }
};

describe('constructor', () => {
  test('should set class name', async () => {
    expect((await createUserFeedback()).className).toBe('UserFeedback');
  });
});

describe('static public methods', () => {
  test('spawn should set provided info', async () => {
    const { servingTime } = await createUserFeedbackInfo();
    const object = await createUserFeedback(servingTime);
    const info = object.getInfo();

    expectUserFeedback(info, servingTime);
  });
});

describe('public methods', () => {
  test('getObject should return provided object', async () => {
    const object = await createUserFeedback();

    expect(new UserFeedback(object).getObject()).toBe(object);
  });

  test('getId should return provided object Id', async () => {
    const object = await createUserFeedback();

    expect(new UserFeedback(object).getId()).toBe(object.id);
  });

  test('updateInfo should update object info', async () => {
    const object = await createUserFeedback();
    const { servingTime: updatedUserFeedback } = await createUserFeedbackInfo();

    object.updateInfo(updatedUserFeedback);

    const info = object.getInfo();

    expectUserFeedback(info, updatedUserFeedback);
  });

  test('getInfo should return provided info', async () => {
    const { servingTime } = await createUserFeedbackInfo();
    const object = await createUserFeedback(servingTime);
    const info = object.getInfo();

    expect(info.get('id')).toBe(object.getId());
    expectUserFeedback(info, servingTime);
  });
});
