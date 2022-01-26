import core from '@actions/core'

import {NocalhostServe} from './nocalhost'

async function run(): Promise<void> {
  try {
    const host = core.getInput('host')
    const email = core.getInput('email')
    const password = core.getInput('password')
    const action = core.getInput('action')

    const serve = NocalhostServe.single({host, email, password})

    await serve.call(action)

    process.exit(0)
  } catch (error) {
    if (process.env.CI) {
      if (error instanceof Error) {
        core.setFailed(error.message)
      }
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      process.stderr.write(error as any)
      process.stderr.end()
      process.exit(1)
    }
  }
}

run()
