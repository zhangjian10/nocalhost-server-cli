import assert from 'assert'

import core from '@actions/core'

export function getParameters<T>(required = false): Partial<T> {
  const parameters = core.getInput('parameters')

  if (required) {
    assert(parameters, TypeError("input 'parameters' not found"))
  }

  core.debug(`parameters:${parameters}`)

  return JSON.parse(parameters || '{}')
}
