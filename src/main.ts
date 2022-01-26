import {getInput, setFailed} from '@actions/core'

import {NocalhostServe} from './nocalhost'

async function run(): Promise<void> {
  try {
    const host = getInput('host')
    const email = getInput('email')
    const password = getInput('password')
    const action = getInput('action')

    const serve = NocalhostServe.single({host, email, password})

    await serve.call(action)

    process.exit(0)
  } catch (error) {
    if (process.env.CI) {
      if (error instanceof Error) {
        setFailed(error.message)
      }
    } else {
      throw error
    }
  }
}

run()
