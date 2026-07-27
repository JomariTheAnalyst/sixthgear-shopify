import assert from 'node:assert/strict'
import test from 'node:test'

import {
  handleDraftModeDisable,
  handleDraftModeEnable,
  hasUnsafeDraftModeRedirect,
} from '../../src/lib/cms/draft-mode.ts'

test('unauthorized Draft Mode activation is rejected by the validated activator', async () => {
  const response = await handleDraftModeEnable(
    new Request('https://shop.test/api/draft-mode/enable?secret=bad'),
    async () => new Response('Invalid secret', { status: 401 }),
    'server-token'
  )
  assert.equal(response.status, 401)
})

test('valid activation delegates to Sanity validation with the server token', async () => {
  let activated = false
  const response = await handleDraftModeEnable(
    new Request('https://shop.test/api/draft-mode/enable?secret=valid&sanity-preview-pathname=%2Fph'),
    async (_request, token) => {
      activated = token === 'server-token'
      return new Response(null, { status: 307 })
    },
    'server-token'
  )
  assert.equal(activated, true)
  assert.equal(response.status, 307)
})

test('missing read token fails safely before activation', async () => {
  let called = false
  const response = await handleDraftModeEnable(
    new Request('https://shop.test/api/draft-mode/enable'),
    async () => {
      called = true
      return new Response()
    },
    null
  )
  assert.equal(response.status, 503)
  assert.equal(called, false)
})

test('external and protocol-relative redirects are rejected', async () => {
  assert.equal(
    hasUnsafeDraftModeRedirect('https://shop.test/api/draft-mode/enable?redirect=https%3A%2F%2Fevil.test'),
    true
  )
  assert.equal(
    hasUnsafeDraftModeRedirect('https://shop.test/api/draft-mode/enable?sanity-preview-pathname=%2F%2Fevil.test'),
    true
  )
})

test('disable handler clears Draft Mode and redirects internally', async () => {
  let disabled = false
  const response = await handleDraftModeDisable(
    new Request('https://shop.test/api/draft-mode/disable?redirect=%2Fph%2Fabout'),
    () => {
      disabled = true
    }
  )
  assert.equal(disabled, true)
  assert.equal(response.status, 307)
  assert.equal(response.headers.get('location'), 'https://shop.test/ph/about')
})
