import * as core from '@actions/core'

import {NocalhostServe} from './nocalhost'

async function run(): Promise<void> {
  try {
    // let url = core.getInput('url')
    // let email = core.getInput('email')
    // let password = core.getInput('password')
    // const spaceId = core.getInput('spaceId')
    let url = 'http://139.186.146.170:30080/'
    let email = 'admin@admin.com'
    let password = '123456'
    let action = 'devSpace.create'

    global.parameters = '{"clusterName":"foobar"}'

    const serve = NocalhostServe.single({url, email, password})

    serve.call(action)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

;(async () => {
  await run()
})()
