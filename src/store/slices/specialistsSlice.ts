import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SpecialistFilters } from '@/lib/types';

const initialState: Partial<SpecialistFilters> = {
    search: '',
    page: 1,
    limit: 10,
};

export const specialistsSlice = createSlice({
    name: 'specialists',
    initialState,
    reducers: {
        setFilters: (state, action: PayloadAction<Partial<SpecialistFilters>>) => {
            return { ...state, ...action.payload };
        },
        setSearchQuery: (state, action: PayloadAction<string>) => {
            state.search = action.payload;
        },
        resetFilters: () => {
            return initialState;
        },
    },
});

export const { setFilters, setSearchQuery, resetFilters } = specialistsSlice.actions;
export default specialistsSlice.reducer;
