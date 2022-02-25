import {getState} from '@actions/core'
import assert from 'assert'

import {NocalhostServe} from './nocalhost'
import {ServerInfo} from './nocalhost/type'

import run from './run'

run(async () => {
  const serverStr = getState('serverInfo')
  const action = getState('action')

  assert(serverStr, 'serverInfo is not cannot be empty')
  assert(action, 'action is not cannot be empty')

  const serverInfo = JSON.parse(serverStr) as ServerInfo

  const serve = NocalhostServe.single(serverInfo)

  await serve.call(action)
})
