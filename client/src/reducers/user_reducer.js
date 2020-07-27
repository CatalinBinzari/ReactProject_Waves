import { LOGIN_USER, REGISTER_USER } from '../actions/types'
//aici exportam ce sa apara in redux?
export default function (state = {}, action) {
    switch (action.type) {
        case REGISTER_USER:
            return { ...state, register: action.payload }
        case LOGIN_USER:
            return { ...state, loginSucces: action.payload }
        default:
            return state;
    }

}