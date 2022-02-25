import {getInput, saveState} from '@actions/core'
import {NocalhostServe} from './nocalhost'

import run from './run'

run(async () => {
  const host = getInput('host')
  const email = getInput('email')
  const password = getInput('password')
  const action = getInput('action')

  const serve = NocalhostServe.single({host, email, password})

  const result = await serve.call(action)

  if (result) {
    saveState('action', result.action)
    saveState('parameters', result.parameters)
  }
})
