const initialState = {
    isConnected: false
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'CHANGE_CONNECTION_STATUS':
            return { ...state, isConnected: action.isConnected };

        default:
            return state;
    }
};

export default reducer;
