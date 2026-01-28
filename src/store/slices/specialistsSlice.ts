import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SpecialistFilter } from '@/lib/types';

const initialState: SpecialistFilter = {
    status: 'All',
    search: '',
};

export const specialistsSlice = createSlice({
    name: 'specialists',
    initialState,
    reducers: {
        setFilterStatus: (state, action: PayloadAction<SpecialistFilter['status']>) => {
            state.status = action.payload;
        },
        setSearchQuery: (state, action: PayloadAction<string>) => {
            state.search = action.payload;
        },
    },
});

export const { setFilterStatus, setSearchQuery } = specialistsSlice.actions;
export default specialistsSlice.reducer;
