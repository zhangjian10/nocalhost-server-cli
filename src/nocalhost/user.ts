import {ServerInfo} from './type'

export async function login(info: Omit<ServerInfo, 'url'>) {
  const data = await api.post<string, {token: string}>('/v1/login', info)

  return data.token
}

export async function getInfo() {
  const {id} = await api.get<null, {id: number}>('/v1/me')

  global.uid = id
}

export default {getInfo, login}
