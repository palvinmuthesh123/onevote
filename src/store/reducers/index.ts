import { combineReducers } from 'redux';
// Import your individual reducers here
import firbasAuthReducer from './firebaseAuth';

const rootReducer = combineReducers({
  firebaseAuth:firbasAuthReducer,
});

export default rootReducer;