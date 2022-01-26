import * as core from '@actions/core'

import { NocalhostServe } from './nocalhost'

async function run(): Promise<void> {
  try {
    const host = core.getInput('host')
    const email = core.getInput('email')
    const password = core.getInput('password')
    const action = core.getInput('action')

    core.debug(`host:${host},email:${email},password:${password},action:${action}`)

    const serve = NocalhostServe.single({ host, email, password })

    await serve.call(action)

    process.exit(1)
  } catch (error) {
    if (process.env.CI) {
      if (error instanceof Error) {
        core.setFailed(error.message)
      }
    }
    else {
      console.error(error)
      process.exit(-1)
    }
  }
}

run()
