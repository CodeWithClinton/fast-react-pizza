import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    cart:[
        {
            pizzaId: 1,
            name: "Mediterranean",
            quantity: 2,
            unitPrice: 16,
            totalPrice: 32
        },
    ]
}

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addItem(state, action){
            // payload = newItem
            state.cart.push(action.payload)
        },
        deleteItem(state, action){
            // payload = pizzaId
            state.cart = state.cart.filter(item => item.pizzaId !== action.payload)
        },
        increaseItemQuantity(state, action){},
        decreaseItemQuantity(state, action){},
        clearCart(state, action){},
    }

})