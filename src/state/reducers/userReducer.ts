import { combineReducers } from "redux";

export type Action = UserFetchAction | UserLoadAction | UserAddAction | CurrentUserSetAction | CurrentScoreUpdate | ScoreUpdateAction;

type UserFetchAction = {
    type: "FETCH_USER"
}

type UserLoadAction = {
    type: "LOAD_USER",
    payload: User[]
}

type CurrentUserSetAction = {
    type: "SET_CURRENT_USER",
    payload: User
}

type CurrentScoreUpdate = {
    type: "UPDATE_CURRENT_SCORE",
    payload: number
}

export type ScoreUpdateAction = {
    type: "UPDATE_SCORE_DB",
    payload: {
        last: number,
        user: User
    }
}

export type UserAddAction = {
    type: "ADD_USER",
    payload: User
}

export type User = {
    name: string,
    id: string,
    score: {
        high: number,
        last: number,
    },
    gameplay: number
}

export type InitialState = {
    users: User[];
    currentUser: User;
}

const initialState: InitialState = {
    users: [],
    currentUser: {name: "Guest", id: "1", score: {high: 0, last: 0}, gameplay: 0}
}

const userReducer = (state: InitialState = initialState, action: Action) => {
    switch (action.type){
        // case "FETCH_USER":
        //     return {...state, users: [...state.users, {name: "AppleMan", id: 1}, {name: "BallCat", id: 2}]}
        case "LOAD_USER":
            // console.log(action.payload);
            // console.log(...action.payload);
            return {...state, users: [...state.users, ...action.payload]}
        case "SET_CURRENT_USER":
            return {...state, currentUser: action.payload}
        case "UPDATE_CURRENT_SCORE":
            return {...state, currentUser: action.payload}
            // return state;
        default:
            return state;
    }
}

const reducers = combineReducers({
    userState: userReducer
})

export default reducers;

export type State = ReturnType<typeof reducers>;