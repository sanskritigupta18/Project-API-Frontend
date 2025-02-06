import {configureStore} from "@reduxjs/toolkit"
import profile from "../Slices/Profile/profile.js"

// creating store
export const store = configureStore({
    reducer:
    {
        profile: profile
    }
})