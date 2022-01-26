
import assert from 'assert'

import { getInput } from '@actions/core'

export function getParameters<T>(required: boolean = false): Partial<T> {
    const parameters = process.env.CI ? (getInput("parameters")) : process.env[`INPUT_PARAMETERS`]

    if (required) {
        assert(parameters, TypeError("input 'parameters' not found"))
    }

    return JSON.parse(parameters ?? '{}')

}