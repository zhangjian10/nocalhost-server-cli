import assert from 'assert'

import {getInput, getState, debug} from '@actions/core'

export function getParameters<T>(required = false): Partial<T> {
  const parameters = getInput('parameters') || getState('parameters')

  if (required) {
    assert(parameters, TypeError("'parameters' not found"))
  }

  debug(`parameters:${parameters}`)

  return JSON.parse(parameters || '{}')
}
