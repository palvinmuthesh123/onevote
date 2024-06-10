import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers'; // Assuming you have a reducers folder with an index.js file

const store = configureStore({
  reducer: rootReducer,
});

export default store;