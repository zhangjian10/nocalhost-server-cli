import assert from 'assert'

import {debug, getInput} from '@actions/core'

export function getParameters<T>(required = false): Partial<T> {
  const parameters = getInput('parameters')

  if (required) {
    assert(parameters, TypeError("input 'parameters' not found"))
  }

  debug(`parameters:${parameters}`)

  return JSON.parse(parameters || '{}')
}
