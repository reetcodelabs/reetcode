import { test, expect } from '@jest/globals'

function sum(a, b) {
  return a + b
}

function multiply(a, b) {
  return a * b
}

test('add two numbers', () => {
  expect(sum(2, 2)).toEqual(4)
})

test('multiply two numbers', () => {
  expect(multiply(2, 2)).toEqual(4)
})

test('add two numbers 2', () => {
  expect(multiply(2, 2)).toEqual(8)
})

test('multiply two numbers 2', () => {
  expect(multiply(2, 2)).toEqual(8)
})
