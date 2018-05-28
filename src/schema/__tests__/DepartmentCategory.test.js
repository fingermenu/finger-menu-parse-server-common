// @flow

import { Map } from 'immutable';
import TestHelper from '../../../TestHelper';
import { DepartmentCategory } from '..';
import createTags from '../../services/__tests__/TagService.test';

export const createDepartmentCategoryInfo = async () => {
  const tag = (await createTags(1)).first();
  const ownedByUser = await TestHelper.createUser();
  const maintainedByUsers = await TestHelper.createUsers();
  const departmentCategory = Map({
    tagId: tag.get('id'),
    ownedByUserId: ownedByUser.id,
    maintainedByUserIds: maintainedByUsers.map(maintainedByUser => maintainedByUser.id),
  });

  return {
    departmentCategory,
    tag,
    ownedByUser,
    maintainedByUsers,
  };
};

export const createDepartmentCategory = async object => DepartmentCategory.spawn(object || (await createDepartmentCategoryInfo()).departmentCategory);

export const expectDepartmentCategory = (object, expectedObject, { departmentCategoryId, expectedTag } = {}) => {
  expect(object.get('tagId')).toBe(expectedObject.get('tagId'));
  expect(object.get('ownedByUserId')).toBe(expectedObject.get('ownedByUserId'));
  expect(object.get('maintainedByUserIds')).toEqual(expectedObject.get('maintainedByUserIds'));

  if (departmentCategoryId) {
    expect(object.get('id')).toBe(departmentCategoryId);
  }

  if (expectedTag) {
    expect(object.get('tagId')).toEqual(expectedTag.get('id'));
  }
};

describe('constructor', () => {
  test('should set class name', async () => {
    expect((await createDepartmentCategory()).className).toBe('DepartmentCategory');
  });
});

describe('static public methods', () => {
  test('spawn should set provided info', async () => {
    const { departmentCategory } = await createDepartmentCategoryInfo();
    const object = await createDepartmentCategory(departmentCategory);
    const info = object.getInfo();

    expectDepartmentCategory(info, departmentCategory);
  });
});

describe('public methods', () => {
  test('getObject should return provided object', async () => {
    const object = await createDepartmentCategory();

    expect(new DepartmentCategory(object).getObject()).toBe(object);
  });

  test('getId should return provided object Id', async () => {
    const object = await createDepartmentCategory();

    expect(new DepartmentCategory(object).getId()).toBe(object.id);
  });

  test('updateInfo should update object info', async () => {
    const object = await createDepartmentCategory();
    const { departmentCategory: updatedDepartmentCategory } = await createDepartmentCategoryInfo();

    object.updateInfo(updatedDepartmentCategory);

    const info = object.getInfo();

    expectDepartmentCategory(info, updatedDepartmentCategory);
  });

  test('getInfo should return provided info', async () => {
    const { departmentCategory } = await createDepartmentCategoryInfo();
    const object = await createDepartmentCategory(departmentCategory);
    const info = object.getInfo();

    expect(info.get('id')).toBe(object.getId());
    expectDepartmentCategory(info, departmentCategory);
  });
});
