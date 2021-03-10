import moment from "moment";
import { types } from "../types/types";


const initialState ={
     events: [{
         id: new Date().getTime(),
        title: 'consulta general',
        start: moment().toDate(),
        end: moment().add(1,'hours').toDate(),
        bgcolor: '#fafafa',
        notes: 'consulta correspondiente',
        user:{
            _id: '123',
            name: 'Marco Brass'
        }
    }],
    activeEvent: null
};

export const calendarReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.eventSetActive:
            return{
                ...state,
                activeEvent: action.payload
            }
        case types.eventAddNew:
            return{
                ...state,
                events:[
                    ...state.events,
                    action.payload
                ]
            }
        case types.eventClearActiveEvent:
            return{
                ...state,
                activeEvent: null
            }
        case types.eventUpdated:
            return{
              ...state,
              events: state.events.map(
                  e => (e.id === action.payload.id) ? action.payload : e
              )
            }  
        default:
            return state;
    }
}