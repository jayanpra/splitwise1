import { configureStore } from '@reduxjs/toolkit'
import DashReducer from './DashReducer';
import ProfileReducer from './ProfileReducer'
import { composeWithDevTools } from 'redux-devtools-extension'

export default configureStore({
    reducer: {
        profile: ProfileReducer,
        dash: DashReducer,
    },
}, composeWithDevTools());