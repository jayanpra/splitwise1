import { configureStore } from '@reduxjs/toolkit'
import DashReducer from './DashReducer';
import ProfileReducer from './ProfileReducer'
import { composeWithDevTools } from 'redux-devtools-extension'
import RegisterReducer from './RegisterReducer'
import GroupReducer from './GroupReducer'

export default configureStore({
    reducer: {
        profile: ProfileReducer,
        dash: DashReducer,
        register: RegisterReducer,
        group: GroupReducer,
    },
}, composeWithDevTools());