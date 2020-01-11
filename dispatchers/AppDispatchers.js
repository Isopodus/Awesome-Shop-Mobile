export function mapStateToProps(state) {
    return {
        user: state.user,
        cart: state.cart
    }
}

export function mapDispatchToProps(dispatch) {
    return {
        updateUser: (newUser) => dispatch({type: 'UPDATE_USER', state: newUser}),
        updateCart: (newCart) => dispatch({type: 'UPDATE_CART', state: newCart})
    }
}