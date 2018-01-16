// @flow

import Chance from 'chance';
import { Map } from 'immutable';
import '../../../bootstrap';
import { Language } from '../';

const chance = new Chance();

export const createLanguageInfo = async () => {
  const language = Map({
    key: chance.string(),
    name: chance.string(),
    imageUrl: chance.string(),
  });

  return {
    language,
  };
};

export const createLanguage = async object => Language.spawn(object || (await createLanguageInfo()).language);

export const expectLanguage = (object, expectedObject, { languageId } = {}) => {
  expect(object.get('key')).toBe(expectedObject.get('key'));
  expect(object.get('name')).toBe(expectedObject.get('name'));
  expect(object.get('imageUrl')).toBe(expectedObject.get('imageUrl'));

  if (languageId) {
    expect(object.get('id')).toBe(languageId);
  }
};

describe('constructor', () => {
  test('should set class name', async () => {
    expect((await createLanguage()).className).toBe('Language');
  });
});

describe('static public methods', () => {
  test('spawn should set provided info', async () => {
    const { language } = await createLanguageInfo();
    const object = await createLanguage(language);
    const info = object.getInfo();

    expectLanguage(info, language);
  });
});

describe('public methods', () => {
  test('getObject should return provided object', async () => {
    const object = await createLanguage();

    expect(new Language(object).getObject()).toBe(object);
  });

  test('getId should return provided object Id', async () => {
    const object = await createLanguage();

    expect(new Language(object).getId()).toBe(object.id);
  });

  test('updateInfo should update object info', async () => {
    const object = await createLanguage();
    const { language: updatedLanguage } = await createLanguageInfo();

    object.updateInfo(updatedLanguage);

    const info = object.getInfo();

    expectLanguage(info, updatedLanguage);
  });

  test('getInfo should return provided info', async () => {
    const { language } = await createLanguageInfo();
    const object = await createLanguage(language);
    const info = object.getInfo();

    expect(info.get('id')).toBe(object.getId());
    expectLanguage(info, language);
  });
});
