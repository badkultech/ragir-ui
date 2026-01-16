import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CompareState {
    tripIds: string[];
}

const initialState: CompareState = {
    tripIds: [],
};

const compareSlice = createSlice({
    name: "compare",
    initialState,
    reducers: {
        addToCompare: (state, action: PayloadAction<string>) => {
            if (state.tripIds.includes(action.payload)) return;
            if (state.tripIds.length >= 3) return;

            state.tripIds.push(action.payload);
            localStorage.setItem("compareTrips", JSON.stringify(state.tripIds));
        },

        removeFromCompare: (state, action: PayloadAction<string>) => {
            state.tripIds = state.tripIds.filter(id => id !== action.payload);
            localStorage.setItem("compareTrips", JSON.stringify(state.tripIds));
        },

        clearCompare: (state) => {
            state.tripIds = [];
            localStorage.removeItem("compareTrips");
        },
    },
});

export const { addToCompare, removeFromCompare, clearCompare } =
    compareSlice.actions;

export default compareSlice.reducer;
