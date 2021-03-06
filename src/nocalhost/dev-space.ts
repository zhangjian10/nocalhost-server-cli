import assert from 'assert'
import crypto from 'crypto'
import {setTimeout} from 'timers/promises'
import fs from 'fs/promises'
import path from 'path'
import {homedir} from 'os'
import {isNumber} from 'lodash'
import {setOutput} from '@actions/core'

import {getParameters} from '../utils'
import cluster from './cluster'
import {Action} from './type'

const create: Action = async () => {
  let cluster_id = 1

  const parameters = getParameters<{clusterName: string; savePath: string}>()

  if (parameters.clusterName) {
    const {clusterName} = parameters
    const item = await cluster.find(clusterName)

    assert(item, `cluster '${clusterName}' not found`)

    cluster_id = item.id
  }

  const space_name = `test-${crypto
    .randomUUID()
    .replaceAll('-', '')
    .substring(0, 6)}`

  const spaceInfo = await api.post<unknown, {id: number}>('/v1/dev_space', {
    cluster_id,
    cluster_admin: 0,
    user_id: global.uid,
    space_name,
    space_resource_limit: null,
    dev_space_type: 3,
    virtual_cluster: {service_type: 'NodePort', version: '0.5.2', values: null}
  })

  const {id} = spaceInfo

  await new Promise<void>(async (resolve, reject) => {
    global.setTimeout(
      reject.bind(null, `Waiting for '${id}' completion timeout`),
      300_0000
    )

    await waitingForCompletion(id)

    resolve()
  })

  const {id: space_id, kubeconfig} = await get(id)

  setOutput('space_id', space_id)

  await saveKubeconfig(kubeconfig, parameters.savePath)

  return Promise.resolve({action: 'devSpace.remove', parameters: space_id})
}

export async function saveKubeconfig(kubeconfig: string, savePath?: string) {
  if (!savePath) {
    const kubePath = path.join(homedir(), '.kube')
    await fs.mkdir(kubePath, {recursive: true})

    savePath = path.join(kubePath, 'config')
  }

  await fs.writeFile(savePath, kubeconfig)
}

async function get(id: number) {
  return api.get<null, {kubeconfig: string; id: number}>(
    `/v1/dev_space/${id}/detail?user_id=${global.uid}`
  )
}

interface VirtualCluster {
  status: 'Installing' | 'Upgrading' | 'Ready'
}

async function waitingForCompletion(id: number) {
  const getStatus = async () => {
    const data = await api.get<
      unknown,
      {
        [key: number]: {
          virtual_cluster: VirtualCluster
        }
      }
    >('/v1/dev_space/status', {
      params: {ids: id}
    })

    return data[id].virtual_cluster.status
  }

  while ((await getStatus()) !== 'Ready') {
    await setTimeout(5_000)
  }
}

const remove: Action = async () => {
  const id = getParameters<number>(true)

  assert(id && isNumber(id), TypeError("'id' is not numeric type"))

  await api.delete(`/v1/dev_space/${id}`)
}

export default {remove, create, get}
