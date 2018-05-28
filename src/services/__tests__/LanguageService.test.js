// @flow

import Chance from 'chance';
import Immutable, { List, Map, Range } from 'immutable';
import '../../../bootstrap';
import { LanguageService } from '..';
import { createLanguageInfo, expectLanguage } from '../../schema/__tests__/Language.test';

const chance = new Chance();
const languageService = new LanguageService();

const createCriteriaWthoutConditions = () =>
  Map({
    fields: List.of('key', 'name', 'imageUrl'),
  });

const createCriteria = object =>
  Map({
    conditions: Map({
      key: object ? object.get('key') : chance.string(),
      name: object ? object.get('name') : chance.string(),
      imageUrl: object ? object.get('imageUrl') : chance.string(),
    }),
  }).merge(createCriteriaWthoutConditions());

const createLanguages = async (count, useSameInfo = false) => {
  let language;

  if (useSameInfo) {
    const { language: tempLanguage } = await createLanguageInfo();

    language = tempLanguage;
  }

  return Immutable.fromJS(
    await Promise.all(
      Range(0, count)
        .map(async () => {
          let finalLanguage;

          if (useSameInfo) {
            finalLanguage = language;
          } else {
            const { language: tempLanguage } = await createLanguageInfo();

            finalLanguage = tempLanguage;
          }

          return languageService.read(await languageService.create(finalLanguage), createCriteriaWthoutConditions());
        })
        .toArray(),
    ),
  );
};

export default createLanguages;

describe('create', () => {
  test('should return the created language Id', async () => {
    const languageId = await languageService.create((await createLanguageInfo()).language);

    expect(languageId).toBeDefined();
  });

  test('should create the language', async () => {
    const { language } = await createLanguageInfo();
    const languageId = await languageService.create(language);
    const fetchedLanguage = await languageService.read(languageId, createCriteriaWthoutConditions());

    expect(fetchedLanguage).toBeDefined();
  });
});

describe('read', () => {
  test('should reject if the provided language Id does not exist', async () => {
    const languageId = chance.string();

    try {
      await languageService.read(languageId);
    } catch (ex) {
      expect(ex.message).toBe(`No language found with Id: ${languageId}`);
    }
  });

  test('should read the existing language', async () => {
    const { language: expectedLanguage, ownedByUser: expectedOwnedByUser, maintainedByUsers: expectedMaintainedByUsers } = await createLanguageInfo();
    const languageId = await languageService.create(expectedLanguage);
    const language = await languageService.read(languageId, createCriteriaWthoutConditions());

    expectLanguage(language, expectedLanguage, {
      languageId,
      expectedOwnedByUser,
      expectedMaintainedByUsers,
    });
  });
});

describe('update', () => {
  test('should reject if the provided language Id does not exist', async () => {
    const languageId = chance.string();

    try {
      const language = await languageService.read(
        await languageService.create((await createLanguageInfo()).language),
        createCriteriaWthoutConditions(),
      );

      await languageService.update(language.set('id', languageId));
    } catch (ex) {
      expect(ex.message).toBe(`No language found with Id: ${languageId}`);
    }
  });

  test('should return the Id of the updated language', async () => {
    const { language: expectedLanguage } = await createLanguageInfo();
    const languageId = await languageService.create((await createLanguageInfo()).language);
    const id = await languageService.update(expectedLanguage.set('id', languageId));

    expect(id).toBe(languageId);
  });

  test('should update the existing language', async () => {
    const { language: expectedLanguage, ownedByUser: expectedOwnedByUser, maintainedByUsers: expectedMaintainedByUsers } = await createLanguageInfo();
    const languageId = await languageService.create((await createLanguageInfo()).language);

    await languageService.update(expectedLanguage.set('id', languageId));

    const language = await languageService.read(languageId, createCriteriaWthoutConditions());

    expectLanguage(language, expectedLanguage, {
      languageId,
      expectedOwnedByUser,
      expectedMaintainedByUsers,
    });
  });
});

describe('delete', () => {
  test('should reject if the provided language Id does not exist', async () => {
    const languageId = chance.string();

    try {
      await languageService.delete(languageId);
    } catch (ex) {
      expect(ex.message).toBe(`No language found with Id: ${languageId}`);
    }
  });

  test('should delete the existing language', async () => {
    const languageId = await languageService.create((await createLanguageInfo()).language);
    await languageService.delete(languageId);

    try {
      await languageService.delete(languageId);
    } catch (ex) {
      expect(ex.message).toBe(`No language found with Id: ${languageId}`);
    }
  });
});

describe('search', () => {
  test('should return no language if provided criteria matches no language', async () => {
    const languages = await languageService.search(createCriteria());

    expect(languages.count()).toBe(0);
  });

  test('should return the language matches the criteria', async () => {
    const { language: expectedLanguage, ownedByUser: expectedOwnedByUser, maintainedByUsers: expectedMaintainedByUsers } = await createLanguageInfo();
    const results = Immutable.fromJS(
      await Promise.all(
        Range(0, chance.integer({ min: 1, max: 10 }))
          .map(async () => languageService.create(expectedLanguage))
          .toArray(),
      ),
    );
    const languages = await languageService.search(createCriteria(expectedLanguage));

    expect(languages.count).toBe(results.count);
    languages.forEach(language => {
      expect(results.find(_ => _.localeCompare(language.get('id')) === 0)).toBeDefined();
      expectLanguage(language, expectedLanguage, {
        languageId: language.get('id'),
        expectedOwnedByUser,
        expectedMaintainedByUsers,
      });
    });
  });
});

describe('searchAll', () => {
  test('should return no language if provided criteria matches no language', async () => {
    let languages = List();
    const result = languageService.searchAll(createCriteria());

    try {
      result.event.subscribe(info => {
        languages = languages.push(info);
      });

      await result.promise;
    } finally {
      result.event.unsubscribeAll();
    }

    expect(languages.count()).toBe(0);
  });

  test('should return the language matches the criteria', async () => {
    const { language: expectedLanguage, ownedByUser: expectedOwnedByUser, maintainedByUsers: expectedMaintainedByUsers } = await createLanguageInfo();
    const results = Immutable.fromJS(
      await Promise.all(
        Range(0, chance.integer({ min: 2, max: 5 }))
          .map(async () => languageService.create(expectedLanguage))
          .toArray(),
      ),
    );

    let languages = List();
    const result = languageService.searchAll(createCriteria(expectedLanguage));

    try {
      result.event.subscribe(info => {
        languages = languages.push(info);
      });

      await result.promise;
    } finally {
      result.event.unsubscribeAll();
    }

    expect(languages.count).toBe(results.count);
    languages.forEach(language => {
      expect(results.find(_ => _.localeCompare(language.get('id')) === 0)).toBeDefined();
      expectLanguage(language, expectedLanguage, {
        languageId: language.get('id'),
        expectedOwnedByUser,
        expectedMaintainedByUsers,
      });
    });
  });
});

describe('exists', () => {
  test('should return false if no language match provided criteria', async () => {
    expect(await languageService.exists(createCriteria())).toBeFalsy();
  });

  test('should return true if any language match provided criteria', async () => {
    const languages = await createLanguages(chance.integer({ min: 1, max: 10 }), true);

    expect(await languageService.exists(createCriteria(languages.first()))).toBeTruthy();
  });
});

describe('count', () => {
  test('should return 0 if no language match provided criteria', async () => {
    expect(await languageService.count(createCriteria())).toBe(0);
  });

  test('should return the count of language match provided criteria', async () => {
    const languages = await createLanguages(chance.integer({ min: 1, max: 10 }), true);

    expect(await languageService.count(createCriteria(languages.first()))).toBe(languages.count());
  });
});
