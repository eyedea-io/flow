import {POSTMAN_API_URL} from '@website/config'
import ApiClient from './api-client'

export const request = new ApiClient(POSTMAN_API_URL)
