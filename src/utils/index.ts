
import assert from 'assert'

import { getInput, debug } from '@actions/core'

export function getParameters<T>(required: boolean = false): Partial<T> {
    const parameters = getInput("parameters")

    if (required) {
        assert(parameters, TypeError("input 'parameters' not found"))
    }

    debug(`parameters:${parameters}`)

    return JSON.parse(parameters || '{}')

}