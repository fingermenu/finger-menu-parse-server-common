// @flow

import Chance from 'chance';
import Immutable, { List, Map, Range } from 'immutable';
import '../../../bootstrap';
import { TagService } from '..';
import { createTagInfo, expectTag } from '../../schema/__tests__/Tag.test';

const chance = new Chance();
const tagService = new TagService();

const getLanguages = object => {
  const languages = object ? object.get('name').keySeq() : List();
  const language = languages.isEmpty() ? null : languages.first();

  return { languages, language };
};

const createCriteriaWthoutConditions = (languages, language) =>
  Map({
    fields: List.of('languages_name', 'languages_description', 'key', 'level', 'forDisplay', 'parentTag', 'ownedByUser', 'maintainedByUsers')
      .concat(languages ? languages.map(_ => `${_}_name`) : List())
      .concat(languages ? languages.map(_ => `${_}_description`) : List()),
    language,
    include_parentTag: true,
    include_ownedByUser: true,
    include_maintainedByUsers: true,
  });

const createCriteria = object => {
  const { language, languages } = getLanguages(object);

  return Map({
    conditions: Map({
      key: object ? object.get('key') : chance.string(),
      level: object ? object.get('level') : chance.integer(),
      forDisplay: object ? object.get('forDisplay') : chance.bool(),
      parentTagId: object && object.get('parentTagId') ? object.get('parentTagId') : undefined,
      ownedByUserId: object ? object.get('ownedByUserId') : chance.string(),
      maintainedByUserIds: object ? object.get('maintainedByUserIds') : List.of(chance.string(), chance.string()),
    }),
  }).merge(createCriteriaWthoutConditions(languages, language));
};

const createTags = async (count, useSameInfo = false, createParentTag = true) => {
  const parentTag = createParentTag ? await createTags(1, false, false) : undefined;
  let tag;

  if (useSameInfo) {
    const { tag: tempTag } = await createTagInfo();

    tag = tempTag;
  }

  return Immutable.fromJS(
    await Promise.all(
      Range(0, count)
        .map(async () => {
          let finalTag;

          if (useSameInfo) {
            finalTag = tag;
          } else {
            const { tag: tempTag } = await createTagInfo();

            finalTag = tempTag;
          }

          return tagService.read(
            await tagService.create(createParentTag ? finalTag.set('parentTagId', parentTag.get('id')) : finalTag),
            createCriteriaWthoutConditions(),
          );
        })
        .toArray(),
    ),
  );
};

export default createTags;

describe('create', () => {
  test('should return the created tag Id', async () => {
    const tagId = await tagService.create((await createTagInfo()).tag);

    expect(tagId).toBeDefined();
  });

  test('should create the tag', async () => {
    const { tag } = await createTagInfo();
    const tagId = await tagService.create(tag);
    const fetchedTag = await tagService.read(tagId, createCriteriaWthoutConditions());

    expect(fetchedTag).toBeDefined();
  });
});

describe('read', () => {
  test('should reject if the provided tag Id does not exist', async () => {
    const tagId = chance.string();

    try {
      await tagService.read(tagId);
    } catch (ex) {
      expect(ex.message).toBe(`No tag found with Id: ${tagId}`);
    }
  });

  test('should read the existing tag', async () => {
    const { tag: parentTag } = await createTagInfo();
    const parentTagId = await tagService.create(parentTag);
    const { tag: expectedTag, ownedByUser: expectedOwnedByUser, maintainedByUsers: expectedMaintainedByUsers } = await createTagInfo({ parentTagId });
    const tagId = await tagService.create(expectedTag);
    const tag = await tagService.read(tagId, createCriteriaWthoutConditions());

    expectTag(tag, expectedTag, {
      expectedOwnedByUser,
      expectedMaintainedByUsers,
    });
  });
});

describe('update', () => {
  test('should reject if the provided tag Id does not exist', async () => {
    const tagId = chance.string();

    try {
      const tag = await tagService.read(await tagService.create((await createTagInfo()).tag), createCriteriaWthoutConditions());

      await tagService.update(tag.set('id', tagId));
    } catch (ex) {
      expect(ex.message).toBe(`No tag found with Id: ${tagId}`);
    }
  });

  test('should return the Id of the updated tag', async () => {
    const { tag: expectedTag } = await createTagInfo();
    const tagId = await tagService.create((await createTagInfo()).tag);
    const id = await tagService.update(expectedTag.set('id', tagId));

    expect(id).toBe(tagId);
  });

  test('should update the existing tag', async () => {
    const { tag: parentTag } = await createTagInfo();
    const parentTagId = await tagService.create(parentTag);
    const { tag: expectedTag, ownedByUser: expectedOwnedByUser, maintainedByUsers: expectedMaintainedByUsers } = await createTagInfo({ parentTagId });
    const tagId = await tagService.create((await createTagInfo()).tag);

    await tagService.update(expectedTag.set('id', tagId));

    const tag = await tagService.read(tagId, createCriteriaWthoutConditions());

    expectTag(tag, expectedTag, { expectedOwnedByUser, expectedMaintainedByUsers });
  });
});

describe('delete', () => {
  test('should reject if the provided tag Id does not exist', async () => {
    const tagId = chance.string();

    try {
      await tagService.delete(tagId);
    } catch (ex) {
      expect(ex.message).toBe(`No tag found with Id: ${tagId}`);
    }
  });

  test('should delete the existing tag', async () => {
    const tagId = await tagService.create((await createTagInfo()).tag);
    await tagService.delete(tagId);

    try {
      await tagService.delete(tagId);
    } catch (ex) {
      expect(ex.message).toBe(`No tag found with Id: ${tagId}`);
    }
  });
});

describe('search', () => {
  test('should return no tag if provided criteria matches no tag', async () => {
    const tags = await tagService.search(createCriteria());

    expect(tags.count()).toBe(0);
  });

  test('should return the tag matches the criteria', async () => {
    const { tag: parentTag } = await createTagInfo();
    const parentTagId = await tagService.create(parentTag);
    const { tag: expectedTag, ownedByUser: expectedOwnedByUser, maintainedByUsers: expectedMaintainedByUsers } = await createTagInfo({ parentTagId });
    const results = Immutable.fromJS(
      await Promise.all(
        Range(0, chance.integer({ min: 2, max: 5 }))
          .map(async () => tagService.create(expectedTag))
          .toArray(),
      ),
    );
    const tags = await tagService.search(createCriteria(expectedTag));

    expect(tags.count).toBe(results.count);
    tags.forEach(tag => {
      expect(results.find(_ => _.localeCompare(tag.get('id')) === 0)).toBeDefined();
      expectTag(tag, expectedTag, { expectedOwnedByUser, expectedMaintainedByUsers });
    });
  });
});

describe('searchAll', () => {
  test('should return no tag if provided criteria matches no tag', async () => {
    let tags = List();
    const result = tagService.searchAll(createCriteria());

    try {
      result.event.subscribe(info => {
        tags = tags.push(info);
      });

      await result.promise;
    } finally {
      result.event.unsubscribeAll();
    }

    expect(tags.count()).toBe(0);
  });

  test('should return the tag matches the criteria', async () => {
    const { tag: parentTag } = await createTagInfo();
    const parentTagId = await tagService.create(parentTag);
    const { tag: expectedTag, ownedByUser: expectedOwnedByUser, maintainedByUsers: expectedMaintainedByUsers } = await createTagInfo({ parentTagId });
    const results = Immutable.fromJS(
      await Promise.all(
        Range(0, chance.integer({ min: 2, max: 5 }))
          .map(async () => tagService.create(expectedTag))
          .toArray(),
      ),
    );

    let tags = List();
    const result = tagService.searchAll(createCriteria(expectedTag));

    try {
      result.event.subscribe(info => {
        tags = tags.push(info);
      });

      await result.promise;
    } finally {
      result.event.unsubscribeAll();
    }

    expect(tags.count).toBe(results.count);
    tags.forEach(tag => {
      expect(results.find(_ => _.localeCompare(tag.get('id')) === 0)).toBeDefined();
      expectTag(tag, expectedTag, { expectedOwnedByUser, expectedMaintainedByUsers });
    });
  });
});

describe('exists', () => {
  test('should return false if no tag match provided criteria', async () => {
    expect(await tagService.exists(createCriteria())).toBeFalsy();
  });

  test('should return true if any tag match provided criteria', async () => {
    const tags = await createTags(chance.integer({ min: 1, max: 10 }), true);

    expect(await tagService.exists(createCriteria(tags.first()))).toBeTruthy();
  });
});

describe('count', () => {
  test('should return 0 if no tag match provided criteria', async () => {
    expect(await tagService.count(createCriteria())).toBe(0);
  });

  test('should return the count of tag match provided criteria', async () => {
    const tags = await createTags(chance.integer({ min: 1, max: 10 }), true);

    expect(await tagService.count(createCriteria(tags.first()))).toBe(tags.count());
  });
});
