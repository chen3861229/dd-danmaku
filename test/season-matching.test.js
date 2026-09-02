'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const source = fs.readFileSync(path.join(__dirname, '..', 'ede.js'), 'utf8');
const start = source.indexOf('    // 标题标准化函数');
const end = source.indexOf('    // 计算字符串相似度', start);
assert.ok(start >= 0 && end > start, 'season matching helpers must remain in ede.js');

const helpers = new Function(`${source.slice(start, end)}; return {
    parseSearchKeyword,
    getSeasonMatchScore,
    isSeasonCompatible,
    prioritizeSeasonCandidates,
    getSeasonEpisodeOffset,
    selectSeasonInfo,
    createSeasonInfo,
};`)();

test('parses season and episode from Emby episode names', () => {
    assert.deepEqual(helpers.parseSearchKeyword('间谍过家家 S03E01'), {
        title: '间谍过家家',
        season: 3,
        episode: 1,
    });
});

test('rejects a first-season cache for a later-season episode', () => {
    assert.equal(helpers.isSeasonCompatible('Bang Dream S02E01', 'Bang Dream'), false);
    assert.equal(helpers.isSeasonCompatible('Bang Dream S02E01', 'Bang Dream 2'), true);
    assert.equal(helpers.isSeasonCompatible('Bang Dream S02E01', 'Bang Dream S01'), false);
});

test('prioritizes the requested season while preserving API order for ties', () => {
    const candidates = [{ animeTitle: 'Bang Dream' }, { animeTitle: 'Bang Dream 3' }, { animeTitle: 'Bang Dream 2' }];
    const ordered = helpers.prioritizeSeasonCandidates('Bang Dream S02E01', candidates);
    assert.deepEqual(
        ordered.map(({ animeTitle }) => animeTitle),
        ['Bang Dream 2', 'Bang Dream', 'Bang Dream 3'],
    );
});

test('does not reorder searches without explicit season information', () => {
    const candidates = [{ animeTitle: 'A' }, { animeTitle: 'B' }];
    assert.strictEqual(helpers.prioritizeSeasonCandidates('Bang Dream', candidates), candidates);
});

test('parses Season 0 specials from Emby episode names', () => {
    assert.deepEqual(helpers.parseSearchKeyword('水星领航员 S00E13'), {
        title: '水星领航员',
        season: 0,
        episode: 13,
    });
});

test('accepts OVA and TV Special candidates for Season 0 but rejects TV series', () => {
    assert.equal(helpers.isSeasonCompatible('水星领航员 S00E13', '水星领航员 The AVVENIRE', 'ova'), true);
    assert.equal(helpers.isSeasonCompatible('水星领航员 S00E13', '水星领航员 特别篇', 'tvspecial'), true);
    assert.equal(helpers.isSeasonCompatible('水星领航员 S00E13', '水星领航员', 'tvseries'), false);
});

test('prefers the most recently selected OVA cache for Season 0', () => {
    const regularSeason = {
        name: '水星领航员',
        episodeOffset: 0,
        animeId: 1,
        animeType: 'tvseries',
        updatedAt: 300,
    };
    const olderOva = {
        name: '水星领航员 OVA',
        episodeOffset: -10,
        animeId: 2,
        animeType: 'ova',
        updatedAt: 100,
    };
    const selectedOva = {
        name: '水星领航员 The AVVENIRE',
        episodeOffset: -10,
        animeId: 3,
        animeType: 'ova',
        updatedAt: 200,
    };

    assert.strictEqual(
        helpers.selectSeasonInfo('水星领航员 S00E13', [regularSeason, olderOva, selectedOva], 13),
        selectedOva,
    );
});

test('continues from manually selected OVA episode using a one-based offset', () => {
    const seasonInfo = helpers.createSeasonInfo({
        animeTitle: '水星领航员 The AVVENIRE',
        animeId: 3,
        type: 'ova',
        apiPrefix: 'official',
        apiName: '官方API',
    }, 1, 12);

    assert.equal(seasonInfo.episodeOffset, -10);
    assert.equal(seasonInfo.episodeOffsetVersion, 2);
    assert.equal(13 + seasonInfo.episodeOffset, 3);
    assert.equal(seasonInfo.animeType, 'ova');
    assert.equal(seasonInfo.animeId, 3);
});

test('migrates legacy manual-match offsets without requiring cache cleanup', () => {
    const legacySeasonInfo = {
        name: '水星领航员 The AVVENIRE',
        episodeOffset: -11,
    };

    assert.equal(helpers.getSeasonEpisodeOffset(legacySeasonInfo), -10);
    assert.equal(13 + helpers.getSeasonEpisodeOffset(legacySeasonInfo), 3);
});
