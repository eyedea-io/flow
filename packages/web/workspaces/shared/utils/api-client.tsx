import * as axios from 'axios'

interface ExtendedAxiosPromise extends axios.AxiosPromise {
  cancel?: () => void
}

const {default: request} = axios
const CancelToken = request.CancelToken

export default class APIClient {
  private host?: string

  constructor(
    host: string
  ) {
    this.host = host
  }

  private get headers() {
    return {
      Authorization: localStorage.getItem('token'),
    }
  }

  public get(endpoint: string, params?: object) {
    const source = CancelToken.source()
    let promise: ExtendedAxiosPromise = request.get(this.url(endpoint), {
      headers: this.headers,
      params: params || {},
      cancelToken: source.token,
    })

    promise = promise.then(res => res.data)

    promise.cancel = source.cancel

    return promise
  }

  public post(endpoint: string, data?: any) {
    const source = CancelToken.source()
    let promise: ExtendedAxiosPromise = request.post(this.url(endpoint), data || {}, {
      headers: this.headers,
      cancelToken: source.token,
    })

    promise = promise.then(res => res.data)

    promise.cancel = source.cancel

    return promise
  }

  public url(path: string): string {
    const endpoint = path.startsWith('/') ? path : `/${path}`

    return `${this.host}${endpoint}`
  }
}
