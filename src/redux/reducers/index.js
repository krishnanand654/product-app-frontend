const initialState = {
    insertStatus: false,
    loginStatus: false
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_INSERT_STATUS':
            return {
                ...state,
                insertStatus: action.payload
            };
        case 'SET_LOGIN_STATUS':
            return {
                ...state,
                loginStatus: action.payload
            }
        default:
            return state;
    }
};

export default reducer;
