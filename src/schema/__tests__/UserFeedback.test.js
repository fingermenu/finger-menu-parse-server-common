// @flow

import Chance from 'chance';
import { Map } from 'immutable';
import TestHelper from '../../../TestHelper';
import { UserFeedback } from '../';

const chance = new Chance();

export const createUserFeedbackInfo = async () => {
  const addedByUser = await TestHelper.createUser();
  const servingTime = Map({
    questionAndAnswers: TestHelper.createRandomList(),
    others: chance.string(),
    addedByUserId: addedByUser.id,
  });

  return {
    servingTime,
    addedByUser,
  };
};

export const createUserFeedback = async object => UserFeedback.spawn(object || (await createUserFeedbackInfo()).servingTime);

export const expectUserFeedback = (object, expectedObject, { servingTimeId } = {}) => {
  expect(object.get('questionAndAnswers')).toEqual(expectedObject.get('questionAndAnswers'));
  expect(object.get('others')).toBe(expectedObject.get('others'));
  expect(object.get('addedByUserId')).toBe(expectedObject.get('addedByUserId'));

  if (servingTimeId) {
    expect(object.get('id')).toBe(servingTimeId);
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
