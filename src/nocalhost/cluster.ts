async function list() {
  return await api.get<null, {name: string; id: number}[]>('/v1/cluster')
}

async function find(name: string) {
  const data = await list()

  return data.find(item => item.name === name)
}

export default {find}
