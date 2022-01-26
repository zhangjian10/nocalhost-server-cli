import assert from 'assert'
import crypto from 'crypto'
import { setTimeout } from 'timers/promises'

import { isNumber } from 'lodash'
import * as core from '@actions/core'

import { getParameters } from '../utils'
import cluster from './cluster'

async function create() {
  let cluster_id = 1

  const condition = getParameters<{ clusterName: string }>()

  if (condition.clusterName) {
    const { clusterName } = condition
    const info = await cluster.find(clusterName)

    assert(info, `cluster '${clusterName}' not found`)

    cluster_id = info.id
  }

  const space_name = `test-${crypto
    .randomUUID()
    .replaceAll('-', '')
    .substring(0, 6)}`

  const spaceInfo = await api.post<any, { id: number }>('/v1/dev_space', {
    cluster_id,
    cluster_admin: 0,
    user_id: global.uid,
    space_name,
    space_resource_limit: null,
    dev_space_type: 3,
    virtual_cluster: { service_type: 'NodePort', version: '0.5.2', values: null }
  })

  const { id } = spaceInfo

  await new Promise<void>(async (resolve, reject) => {

    global.setTimeout(reject.bind(null, `Waiting for '${id}' completion timeout`), 300_0000)

    await waitingForCompletion(id)

    resolve()
  })

  const { id: space_id, kubeconfig } = await get(id)

  core.setOutput('space_id', space_id)
  core.setOutput('kubeconfig', kubeconfig)
}

async function get(id: number) {
  return api.get<null, { kubeconfig: string; id: number }>(
    `/v1/dev_space/${id}/detail?user_id=${global.uid}`
  )
}

interface VirtualCluster {
  status: 'Installing' | 'Upgrading' | 'Ready'
}

async function waitingForCompletion(id: number) {
  const getStatus = async () => {
    const data = await api.get<
      any,
      {
        [key: number]: {
          virtual_cluster: VirtualCluster
        }
      }
    >('/v1/dev_space/status', {
      params: { ids: id }
    })

    return data[id].virtual_cluster.status
  }

  while ((await getStatus()) !== 'Ready') {
    await setTimeout(5_000)
  }

}

async function remove() {
  const id = getParameters<number>(true)

  assert(id && isNumber(id), TypeError("'id' is not numeric type"))

  return api.delete(`/v1/dev_space/${id}`)
}

export { remove, create, get }
