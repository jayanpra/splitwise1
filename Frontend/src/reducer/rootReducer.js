const info_form = {
    email: null, 
    password: null,
    fname: null,
    lname: null
}

function rootReducer(state = info_form, action){
    switch(action.type){
        case "Register": {
            return {
                email: action.payload.email,
                password: action.payload.password,
                fname: action.payload.fname,
                lname: action.payload.lname
            }
        }
        case "Login": {
            return {
                ...state,
                email: action.payload.email,
                password: action.payload.password
            }
        }
        default:
            return state
    }
}
export default rootReducer;