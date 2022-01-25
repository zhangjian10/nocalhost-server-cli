import * as core from '@actions/core'

import { NocalhostServe } from './nocalhost'

async function run(): Promise<void> {
  try {
    const url = core.getInput('url')
    const email = core.getInput('email')
    const password = core.getInput('password')
    const action = core.getInput('action')

    const serve = NocalhostServe.single({ url, email, password })

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

; (async () => {
  await run()
})()
