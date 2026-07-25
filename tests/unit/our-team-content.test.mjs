import assert from 'node:assert/strict'
import test from 'node:test'

import {
  FALLBACK_OUR_TEAM_CONTENT,
  selectOurTeamContent,
} from '../../src/lib/cms/our-team.ts'

function member(index) {
  return {
    _key: `member-${index}`,
    name: `Member ${index}`,
    role: `Role ${index}`,
    title: `Specialization ${index}`,
    description: `Introduction for member ${index}.`,
    photoUrl: `https://cdn.sanity.io/images/project/dataset/member-${index}.jpg`,
    imageAlt: `Portrait of member ${index}`,
  }
}

function sectionWithCount(count) {
  return {
    useSanityContent: true,
    sectionTitle: 'Sanity team title',
    sectionDescription: 'Sanity team description',
    teamMembers: Array.from({ length: count }, (_, index) => member(index + 1)),
  }
}

test('toggle absent or off returns the complete fallback team', () => {
  assert.deepEqual(
    selectOurTeamContent({ teamMembers: [member(1)] }),
    FALLBACK_OUR_TEAM_CONTENT
  )
  assert.deepEqual(
    selectOurTeamContent({ ...sectionWithCount(2), useSanityContent: false }),
    FALLBACK_OUR_TEAM_CONTENT
  )
})

for (const count of [1, 2, 3, 4, 6]) {
  test(`valid enabled content renders exactly ${count} Sanity member(s)`, () => {
    const result = selectOurTeamContent(sectionWithCount(count))

    assert.equal(result.source, 'sanity')
    assert.equal(result.teamMembers.length, count)
    assert.deepEqual(
      result.teamMembers.map((item) => item.key),
      Array.from({ length: count }, (_, index) => `member-${index + 1}`)
    )
    assert.equal(
      result.teamMembers.some((item) =>
        FALLBACK_OUR_TEAM_CONTENT.teamMembers.some(
          (fallback) => fallback.key === item.key
        )
      ),
      false
    )
  })
}

test('member ordering and image alt text are mapped without field fallback', () => {
  const value = sectionWithCount(2)
  value.teamMembers.reverse()
  const result = selectOurTeamContent(value)

  assert.deepEqual(
    result.teamMembers.map((item) => item.key),
    ['member-2', 'member-1']
  )
  assert.equal(result.teamMembers[0].imageAlt, 'Portrait of member 2')
})

test('empty, malformed, or section-incomplete enabled content falls back atomically', () => {
  const cases = [
    sectionWithCount(0),
    { ...sectionWithCount(1), teamMembers: [{ ...member(1), role: null }] },
    { ...sectionWithCount(1), teamMembers: [{ ...member(1), imageAlt: ' ' }] },
    { ...sectionWithCount(1), sectionDescription: null },
  ]

  for (const value of cases) {
    assert.deepEqual(selectOurTeamContent(value), FALLBACK_OUR_TEAM_CONTENT)
  }
})

test('missing data or fetch-failure equivalent returns the complete fallback', () => {
  assert.deepEqual(selectOurTeamContent(null), FALLBACK_OUR_TEAM_CONTENT)
})
