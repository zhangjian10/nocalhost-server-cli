import * as core from '@actions/core'
import {NocalhostServe} from './nocalhost'

async function run(): Promise<void> {
  try {
    // let url = core.getInput('url')
    // let email = core.getInput('email')
    // let password = core.getInput('password')
    // const spaceId = core.getInput('spaceId')
    let url = 'http://127.0.0.1/'
    let email = 'admin@admin.com'
    let password = '123456'
    let spaceId = 10

    const serve = NocalhostServe.single({url, email, password})
    if (spaceId) {
      serve.DevSpace.deleteDevSpace(10)
      return
    }

    await serve.DevSpace.create()
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

;(async () => {
  await run()
})()
