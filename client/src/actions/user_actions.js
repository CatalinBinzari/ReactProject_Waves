import axios from 'axios';
import { LOGIN_USER } from './types'
import { USER_SERVER } from '../components/utils/misc';
import { Types } from 'mongoose';

export function loginUser(dataToSubmit) {
    const request = axios.post(`${USER_SERVER}/login`, dataToSubmit). // api/users.login
        then(response => response.data);
    return {
        type: LOGIN_USER,
        payload: request
    }
}