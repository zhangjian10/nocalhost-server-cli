
import assert from 'assert'

import { getInput } from '@actions/core'

export function getParameters<T>(required: boolean = false): Partial<T> {
    const parameters = process.env.CI ? (getInput("parameters")) : global.parameters

    if (required) {
        assert(parameters, TypeError("input 'parameters' not found"))
    }

    return JSON.parse(parameters ?? '{}')

}