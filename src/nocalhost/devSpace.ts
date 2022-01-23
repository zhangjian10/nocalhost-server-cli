import {delay} from 'lodash'

async function create() {
  const {id} = await api.post<any, {id: number}>('/v1/dev_space', {
    cluster_id: 1,
    cluster_admin: 0,
    user_id: 2,
    space_name: 'test',
    space_resource_limit: null,
    dev_space_type: 3,
    virtual_cluster: {service_type: 'NodePort', version: '0.5.2', values: null}
  })

  await waitingForCompletion(id)
}
interface VirtualCluster {
  status: 'Installing' | 'Upgrading' | 'Ready'
}

async function waitingForCompletion(id: number) {
  const data = await api.get<
    any,
    {
      [key: number]: {
        virtual_cluster: VirtualCluster
      }
    }
  >('/v1/dev_space/status', {
    params: {ids: id}
  })

  if (data[id].virtual_cluster.status !== 'Ready') {
    await delay(waitingForCompletion.bind(null, id), 5_000)
  }
  return
}

async function deleteDevSpace(id: number) {
  api.delete(`/v1/dev_space/${id}`)
}
export {deleteDevSpace, create}
