// @flow

import Chance from 'chance';
import { Map } from 'immutable';
import TestHelper from '../../../TestHelper';
import { ChoiceItem } from '../';
import createTags from '../../services/__tests__/TagService.test';

const chance = new Chance();

export const createChoiceItemInfo = async () => {
  const ownedByUser = await TestHelper.createUser();
  const maintainedByUsers = await TestHelper.createUsers();
  const tags = await createTags(chance.integer({ min: 1, max: 3 }));
  const choiceItem = Map({
    name: TestHelper.createRandomMultiLanguagesString(),
    description: TestHelper.createRandomMultiLanguagesString(),
    choiceItemPageUrl: chance.string(),
    imageUrl: chance.string(),
    tagIds: tags.map(tag => tag.get('id')),
    ownedByUserId: ownedByUser.id,
    maintainedByUserIds: maintainedByUsers.map(maintainedByUser => maintainedByUser.id),
  });

  return {
    choiceItem,
    tags,
    ownedByUser,
    maintainedByUsers,
  };
};

export const createChoiceItem = async object => ChoiceItem.spawn(object || (await createChoiceItemInfo()).choiceItem);

export const expectChoiceItem = (object, expectedObject, { choiceItemId, expectedTags } = {}) => {
  expect(object.get('name')).toEqual(expectedObject.get('name'));
  expect(object.get('description')).toEqual(expectedObject.get('description'));
  expect(object.get('choiceItemPageUrl')).toBe(expectedObject.get('choiceItemPageUrl'));
  expect(object.get('imageUrl')).toBe(expectedObject.get('imageUrl'));
  expect(object.get('tagIds')).toEqual(expectedObject.get('tagIds'));
  expect(object.get('ownedByUserId')).toBe(expectedObject.get('ownedByUserId'));
  expect(object.get('maintainedByUserIds')).toEqual(expectedObject.get('maintainedByUserIds'));

  if (choiceItemId) {
    expect(object.get('id')).toBe(choiceItemId);
  }

  if (expectedTags) {
    expect(object.get('tagIds')).toEqual(expectedTags.map(_ => _.get('id')));
  }
};

describe('constructor', () => {
  test('should set class name', async () => {
    expect((await createChoiceItem()).className).toBe('ChoiceItem');
  });
});

describe('static public methods', () => {
  test('spawn should set provided info', async () => {
    const { choiceItem } = await createChoiceItemInfo();
    const object = await createChoiceItem(choiceItem);
    const info = object.getInfo();

    expectChoiceItem(info, choiceItem);
  });
});

describe('public methods', () => {
  test('getObject should return provided object', async () => {
    const object = await createChoiceItem();

    expect(new ChoiceItem(object).getObject()).toBe(object);
  });

  test('getId should return provided object Id', async () => {
    const object = await createChoiceItem();

    expect(new ChoiceItem(object).getId()).toBe(object.id);
  });

  test('updateInfo should update object info', async () => {
    const object = await createChoiceItem();
    const { choiceItem: updatedChoiceItem } = await createChoiceItemInfo();

    object.updateInfo(updatedChoiceItem);

    const info = object.getInfo();

    expectChoiceItem(info, updatedChoiceItem);
  });

  test('getInfo should return provided info', async () => {
    const { choiceItem } = await createChoiceItemInfo();
    const object = await createChoiceItem(choiceItem);
    const info = object.getInfo();

    expect(info.get('id')).toBe(object.getId());
    expectChoiceItem(info, choiceItem);
  });
});
