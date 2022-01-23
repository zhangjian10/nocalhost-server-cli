import {ServerInfo} from './type'

export async function login(info: Omit<ServerInfo, 'url'>) {
  const data = await api.post<string, {token: string}>('/v1/login', info, {
    headers: {anonymous: true}
  })
  return data.token
}
