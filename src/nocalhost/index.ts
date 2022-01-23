import axios, {AxiosResponse} from 'axios'
import {login} from './login'
import * as devSpace from './devSpace'
import {ServerInfo} from './type'

interface Response {
  code: number
  message: string
  data: unknown
}

export class NocalhostServe {
  private token?: string
  public DevSpace = devSpace

  private constructor(info: ServerInfo) {
    const api = axios.create({baseURL: info.url})

    api.interceptors.request.use(async config => {
      config.headers = config.headers ?? {}

      if (!this.token && config.headers['anonymous'] !== true) {
        this.token = await login(info)
      }

      if (this.token) {
        config.headers['authorization'] = 'Bearer ' + this.token
      }

      return config
    })

    api.interceptors.response.use<Response['data']>(
      async (response: AxiosResponse<Response>) => {
        if (response.data.code !== 0) {
          throw Error(JSON.stringify(response.data))
        }
        return response.data.data
      }
    )

    global.api = api
  }

  static single(info: ServerInfo) {
    return new NocalhostServe(info)
  }
}
