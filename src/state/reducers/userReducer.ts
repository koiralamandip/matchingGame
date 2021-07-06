import { combineReducers } from "redux";

// type of Action which is a union of specific action types
// Needed for specifying action variable types in necessary sections 
export type Action = UserFetchAction | UserLoadAction | UserAddAction | CurrentUserSetAction | CurrentScoreUpdate | ScoreUpdateAction;

// Type denoting the action of fetching users..
// Redux Saga catches actions of this type as the action to be performed is asynchronous
type UserFetchAction = {
    type: "FETCH_USER"
}

// Type denoting the action of loading users to screen/ setting users on Redux store (to be exact)
type UserLoadAction = {
    type: "LOAD_USER",
    payload: User[]
}

// Action tpye for setting current user to be the one supplied as payload 
type CurrentUserSetAction = {
    type: "SET_CURRENT_USER",
    payload: User
}

// Action type to update score of current user on Redux store, and eventually reflect that on screen
type CurrentScoreUpdate = {
    type: "UPDATE_CURRENT_SCORE",
    payload: number
}

// Action type to update score of the player on json-server
// The action to be performed is asynchronous and Redux Saga catches actions of this type 
export type ScoreUpdateAction = {
    type: "UPDATE_SCORE_DB",
    payload: {
        last: number,
        user: User
    }
}

// Redux saga catches this type of actions as it is asynchronous, to add user to json-server db 
export type UserAddAction = {
    type: "ADD_USER",
    payload: User
}

// Type denoting the structure of a User/Player (used interchangably in comments here) model
export type User = {
    name: string,
    id: string,
    score: {
        high: number,
        last: number,
    },
    gameplay: number // How many times has this user played the game? 
}

// Structure of state to be placed in Redux Store
// i.e. A list of registered user and a current user playing the game
export type InitialState = {
    users: User[];
    currentUser: User;
}

// Creating initial state from the structure above, to be used during Store creation
const initialState: InitialState = {
    users: [],
    currentUser: {name: "Guest", id: "1", score: {high: 0, last: 0}, gameplay: 0}
}

// User Reducer, to catch relevant action related to user state changes
// Here the type ACTION can be from any of its uinon-ed types, as above,
// Typescript is smart enough to select corresponding Action Type based on the type ".." string in switch case below. 
const userReducer = (state: InitialState = initialState, action: Action) => {
    switch (action.type){
        // For loading user, i.e. storing users on Redux store, create a new state including new users to be stored
        // Becuase load user is done initially after fetching all users, so there is no need to keep previous state of users
        // But because load user is also called at anytime during runtime after registering new user, we preserve the previous state...
        // ... to prevent database fetch every time a new user is registered, so that a new user is just added to already-fetched list of users 
        case "LOAD_USER":
            return {...state, users: [...state.users, ...action.payload]}
        // To set the current user of this game play session, payload is the User who is selected to be a current player 
        case "SET_CURRENT_USER":
            return {...state, currentUser: action.payload}
        // To update the score of the current player, if needed, on Redux store and eventually on screen
        case "UPDATE_CURRENT_SCORE":
            return {...state, currentUser: action.payload}
        default:
            return state;
    }
}

// Not needed for now
// Combining all reducers because Store expects a single reducer variable. 
// Used in this way, just so that modifying/adding new reducers, if necessary, would be easy
const reducers = combineReducers({
    userState: userReducer
})

export default reducers;

// The type of State kept in Redux store. Because the reducer returns the state, the type is set to the return type of reducer
export type State = ReturnType<typeof reducers>;