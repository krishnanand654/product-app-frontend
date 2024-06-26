const initialState = {
    dataStatus: false,
    loginStatus: false,
    token: null,
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_DATA_STATUS':
            return {
                ...state,
                dataStatus: action.payload
            };
        case 'SET_LOGIN_STATUS':
            return {
                ...state,
                loginStatus: action.payload
            }
        case 'SET_ACCESS_TOKEN':
            return {
                ...state,
                token: action.payload
            }
        default:
            return state;
    }
};

export default reducer;
