// @flow

import Chance from 'chance';
import Immutable, { List, Map, Range } from 'immutable';
import '../../../bootstrap';
import { RequestLogService } from '../';
import { createRequestLogInfo, expectRequestLog } from '../../schema/__tests__/RequestLog.test';

const chance = new Chance();
const requestLogService = new RequestLogService();

const createCriteriaWthoutConditions = () =>
  Map({
    fields: List.of('appVersion', 'requestType', 'user'),
    include_user: true,
  });

const createCriteria = object =>
  Map({
    conditions: Map({
      appVersion: object ? object.get('appVersion') : chance.string(),
      requestType: object ? object.get('requestType') : chance.string(),
      userId: object ? object.get('userId') : chance.string(),
    }),
  });

const createRequestLogs = async (count, useSameInfo = false) => {
  let requestLog;

  if (useSameInfo) {
    const { requestLog: tempRequestLog } = await createRequestLogInfo();

    requestLog = tempRequestLog;
  }

  return Immutable.fromJS(
    await Promise.all(
      Range(0, count)
        .map(async () => {
          let finalRequestLog;

          if (useSameInfo) {
            finalRequestLog = requestLog;
          } else {
            const { requestLog: tempRequestLog } = await createRequestLogInfo();

            finalRequestLog = tempRequestLog;
          }

          return requestLogService.read(await requestLogService.create(finalRequestLog), createCriteriaWthoutConditions());
        })
        .toArray(),
    ),
  );
};

export default createRequestLogs;

describe('create', () => {
  test('should return the created request log Id', async () => {
    const requestLogId = await requestLogService.create((await createRequestLogInfo()).requestLog);

    expect(requestLogId).toBeDefined();
  });

  test('should create the requestLog', async () => {
    const { requestLog } = await createRequestLogInfo();
    const requestLogId = await requestLogService.create(requestLog);
    const fetchedRequestLog = await requestLogService.read(requestLogId, createCriteriaWthoutConditions());

    expect(fetchedRequestLog).toBeDefined();
  });
});

describe('read', () => {
  test('should reject if the provided request log Id does not exist', async () => {
    const requestLogId = chance.string();

    try {
      await requestLogService.read(requestLogId);
    } catch (ex) {
      expect(ex.message).toBe(`No request log found with Id: ${requestLogId}`);
    }
  });

  test('should read the existing requestLog', async () => {
    const { requestLog: parentRequestLog } = await createRequestLogInfo();
    const parentRequestLogId = await requestLogService.create(parentRequestLog);
    const { requestLog: expectedRequestLog, user: expectedOwnedByUser } = await createRequestLogInfo({ parentRequestLogId });
    const requestLogId = await requestLogService.create(expectedRequestLog);
    const requestLog = await requestLogService.read(requestLogId, createCriteriaWthoutConditions());

    expectRequestLog(requestLog, expectedRequestLog, {
      expectedOwnedByUser,
    });
  });
});

describe('update', () => {
  test('should reject if the provided request log Id does not exist', async () => {
    const requestLogId = chance.string();

    try {
      const requestLog = await requestLogService.read(
        await requestLogService.create((await createRequestLogInfo()).requestLog),
        createCriteriaWthoutConditions(),
      );

      await requestLogService.update(requestLog.set('id', requestLogId));
    } catch (ex) {
      expect(ex.message).toBe(`No request log found with Id: ${requestLogId}`);
    }
  });

  test('should return the Id of the updated requestLog', async () => {
    const { requestLog: expectedRequestLog } = await createRequestLogInfo();
    const requestLogId = await requestLogService.create((await createRequestLogInfo()).requestLog);
    const id = await requestLogService.update(expectedRequestLog.set('id', requestLogId));

    expect(id).toBe(requestLogId);
  });

  test('should update the existing requestLog', async () => {
    const { requestLog: parentRequestLog } = await createRequestLogInfo();
    const parentRequestLogId = await requestLogService.create(parentRequestLog);
    const { requestLog: expectedRequestLog, user: expectedOwnedByUser } = await createRequestLogInfo({ parentRequestLogId });
    const requestLogId = await requestLogService.create((await createRequestLogInfo()).requestLog);

    await requestLogService.update(expectedRequestLog.set('id', requestLogId));

    const requestLog = await requestLogService.read(requestLogId, createCriteriaWthoutConditions());

    expectRequestLog(requestLog, expectedRequestLog, { expectedOwnedByUser });
  });
});

describe('delete', () => {
  test('should reject if the provided request log Id does not exist', async () => {
    const requestLogId = chance.string();

    try {
      await requestLogService.delete(requestLogId);
    } catch (ex) {
      expect(ex.message).toBe(`No request log found with Id: ${requestLogId}`);
    }
  });

  test('should delete the existing requestLog', async () => {
    const requestLogId = await requestLogService.create((await createRequestLogInfo()).requestLog);
    await requestLogService.delete(requestLogId);

    try {
      await requestLogService.delete(requestLogId);
    } catch (ex) {
      expect(ex.message).toBe(`No request log found with Id: ${requestLogId}`);
    }
  });
});

describe('search', () => {
  test('should return no request log if provided criteria matches no requestLog', async () => {
    const requestLogs = await requestLogService.search(createCriteria());

    expect(requestLogs.count()).toBe(0);
  });

  test('should return the request log matches the criteria', async () => {
    const { requestLog: parentRequestLog } = await createRequestLogInfo();
    const parentRequestLogId = await requestLogService.create(parentRequestLog);
    const { requestLog: expectedRequestLog, user: expectedOwnedByUser } = await createRequestLogInfo({ parentRequestLogId });
    const results = Immutable.fromJS(
      await Promise.all(
        Range(0, chance.integer({ min: 2, max: 5 }))
          .map(async () => requestLogService.create(expectedRequestLog))
          .toArray(),
      ),
    );
    const requestLogs = await requestLogService.search(createCriteria(expectedRequestLog));

    expect(requestLogs.count).toBe(results.count);
    requestLogs.forEach(requestLog => {
      expect(results.find(_ => _.localeCompare(requestLog.get('id')) === 0)).toBeDefined();
      expectRequestLog(requestLog, expectedRequestLog, { expectedOwnedByUser });
    });
  });
});

describe('searchAll', () => {
  test('should return no request log if provided criteria matches no requestLog', async () => {
    let requestLogs = List();
    const result = requestLogService.searchAll(createCriteria());

    try {
      result.event.subscribe(info => {
        requestLogs = requestLogs.push(info);
      });

      await result.promise;
    } finally {
      result.event.unsubscribeAll();
    }

    expect(requestLogs.count()).toBe(0);
  });

  test('should return the request log matches the criteria', async () => {
    const { requestLog: parentRequestLog } = await createRequestLogInfo();
    const parentRequestLogId = await requestLogService.create(parentRequestLog);
    const { requestLog: expectedRequestLog, user: expectedOwnedByUser } = await createRequestLogInfo({ parentRequestLogId });
    const results = Immutable.fromJS(
      await Promise.all(
        Range(0, chance.integer({ min: 2, max: 5 }))
          .map(async () => requestLogService.create(expectedRequestLog))
          .toArray(),
      ),
    );

    let requestLogs = List();
    const result = requestLogService.searchAll(createCriteria(expectedRequestLog));

    try {
      result.event.subscribe(info => {
        requestLogs = requestLogs.push(info);
      });

      await result.promise;
    } finally {
      result.event.unsubscribeAll();
    }

    expect(requestLogs.count).toBe(results.count);
    requestLogs.forEach(requestLog => {
      expect(results.find(_ => _.localeCompare(requestLog.get('id')) === 0)).toBeDefined();
      expectRequestLog(requestLog, expectedRequestLog, { expectedOwnedByUser });
    });
  });
});

describe('exists', () => {
  test('should return false if no request log match provided criteria', async () => {
    expect(await requestLogService.exists(createCriteria())).toBeFalsy();
  });

  test('should return true if any request log match provided criteria', async () => {
    const requestLogs = await createRequestLogs(chance.integer({ min: 1, max: 10 }), true);

    expect(await requestLogService.exists(createCriteria(requestLogs.first()))).toBeTruthy();
  });
});

describe('count', () => {
  test('should return 0 if no request log match provided criteria', async () => {
    expect(await requestLogService.count(createCriteria())).toBe(0);
  });

  test('should return the count of request log match provided criteria', async () => {
    const requestLogs = await createRequestLogs(chance.integer({ min: 1, max: 10 }), true);

    expect(await requestLogService.count(createCriteria(requestLogs.first()))).toBe(requestLogs.count());
  });
});
