// @flow

import Chance from 'chance';
import { Map } from 'immutable';
import TestHelper from '../../../TestHelper';
import { RequestLog } from '../';

const chance = new Chance();

export const createRequestLogInfo = async () => {
  const user = await TestHelper.createUser();
  const requestLog = Map({
    appVersion: chance.string(),
    requestType: chance.string(),
    userId: user.id,
  });

  return {
    requestLog,
    user,
  };
};

export const createRequestLog = async object => RequestLog.spawn(object || (await createRequestLogInfo()).requestLog);

export const expectRequestLog = (object, expectedObject, { requestLogId } = {}) => {
  expect(object.get('appVersion')).toBe(expectedObject.get('appVersion'));
  expect(object.get('requestType')).toBe(expectedObject.get('requestType'));
  expect(object.get('userId')).toBe(expectedObject.get('userId'));

  if (requestLogId) {
    expect(object.get('id')).toBe(requestLogId);
  }
};

describe('constructor', () => {
  test('should set class name', async () => {
    expect((await createRequestLog()).className).toBe('RequestLog');
  });
});

describe('static public methods', () => {
  test('spawn should set provided info', async () => {
    const { requestLog } = await createRequestLogInfo();
    const object = await createRequestLog(requestLog);
    const info = object.getInfo();

    expectRequestLog(info, requestLog);
  });
});

describe('public methods', () => {
  test('getObject should return provided object', async () => {
    const object = await createRequestLog();

    expect(new RequestLog(object).getObject()).toBe(object);
  });

  test('getId should return provided object Id', async () => {
    const object = await createRequestLog();

    expect(new RequestLog(object).getId()).toBe(object.id);
  });

  test('updateInfo should update object info', async () => {
    const object = await createRequestLog();
    const { requestLog: updatedRequestLog } = await createRequestLogInfo();

    object.updateInfo(updatedRequestLog);

    const info = object.getInfo();

    expectRequestLog(info, updatedRequestLog);
  });

  test('getInfo should return provided info', async () => {
    const { requestLog } = await createRequestLogInfo();
    const object = await createRequestLog(requestLog);
    const info = object.getInfo();

    expect(info.get('id')).toBe(object.getId());
    expectRequestLog(info, requestLog);
  });
});
