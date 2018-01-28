// @flow

import Chance from 'chance';
import Immutable, { List, Map, Range } from 'immutable';
import { ParseWrapperService } from '@microbusiness/parse-server-common';
import uuid from 'uuid/v4';

const chance = new Chance();

export default class TestHelper {
  static createUser = async () => ParseWrapperService.createNewUser({ username: `${uuid()}@email.com`, password: '123456' }).signUp();

  static createUsers = async () =>
    Immutable.fromJS(await Promise.all(Range(0, chance.integer({ min: 0, max: 3 }))
      .map(TestHelper.createUser)
      .toArray()));

  static createRandomMultiLanguagesString = () =>
    List.of('en_US', 'en_GB', 'en_NZ').reduce((reduction, language) => reduction.set(language, chance.string()), Map());

  static createRandomMap = () =>
    Range(0, chance.integer({ min: 1, max: 10 }))
      .map(() => Map({ key: chance.string(), value: chance.string() }))
      .reduce((reduction, value) => reduction.set(value.get('key'), value.get('value')), Map());

  static createRandomList = () =>
    Range(0, chance.integer({ min: 1, max: 10 })).map(() => TestHelper.createRandomMap());
}
