import { getInput } from '@actions/core'

export function getParameters<T>(): Partial<T>  {
    const parameters = process.env.CI ? (getInput("parameters")) : global.parameters

    return JSON.parse(parameters ?? '{}') 
}