import test from 'ava'
import { getJson } from '../lib'
import graph from './fixture'

test('getJson does not include JSON Graph references', t =>
  t.deepEqual(getJson(graph, ['list', [0, 1]]), {
    list: {}
  }))

test('getJson returns the value of atoms', t =>
  t.deepEqual(getJson(graph, ['videosById', 22, 'bookmark']), {
    videosById: { 22: { bookmark: 73973 } }
  }))

test('getJson throws the value of JSON Graph errors', t =>
  t.throws(() => getJson(graph, ['videosById', 44, 'bookmark'])))

test('getJson treats JSON Graph primitives as primitives', t =>
  t.deepEqual(getJson(graph, ['videosById', 22, 'bookmark', 'value']), {
    videosById: { 22: { bookmark: 73973 } }
  }))

test('getJson returns non-primitive atom values', t =>
  t.deepEqual(getJson(graph, ['supportedLanguages']), {
    supportedLanguages: ['fr', 'en']
  }))
