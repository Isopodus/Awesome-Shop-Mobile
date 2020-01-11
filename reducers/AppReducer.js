const INITIAL_STATE = {
    user: null,
    cart: {
        order_id: null,
        user_id: null,
        status: 0,
        products: []
    }
};

function AppReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
        case 'UPDATE_USER':
            return {
                ...state,
                user: action.state
            };
        case 'UPDATE_CART':
            return {
                ...state,
                cart: action.state
            };
        default:
            return state
    }
}

export default AppReducer;