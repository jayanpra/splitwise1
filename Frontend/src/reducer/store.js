import { configureStore} from '@reduxjs/toolkit'
import DashReducer from './DashReducer';
import ProfileReducer from './ProfileReducer'
import { composeWithDevTools } from 'redux-devtools-extension'
import RegisterReducer from './RegisterReducer'
import GroupReducer from './GroupReducer'
import CommentReducer from './CommentReducer'
import LogisterReducer from './Logister'
import RecentReducer from './RecentReducer'
import CreateGroupReducer from './CreateGroupReducer'

export default configureStore({
    reducer: {
        profile: ProfileReducer,
        dash: DashReducer,
        register: RegisterReducer,
        group: GroupReducer,
        comment: CommentReducer,
        logister: LogisterReducer,
        recent: RecentReducer,
        create: CreateGroupReducer,
    },
}, composeWithDevTools());