import React, {useState} from 'react';
import { Navbar } from '../ui/Navbar';
import {Calendar, momentLocalizer} from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/es-us';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { messages } from '../helpers/calendar-messages-ES';
import { CalendarEvent } from './CalendarEvent';
import { CalendarModal } from './CalendarModal';
import { useDispatch, useSelector } from 'react-redux';
import { uiOpenModal } from '../../actions/ui';
import { eventSetActive } from '../../actions/events';
import { AddNewFab } from '../ui/AddNewFab';

moment.locale('us')

const localizer = momentLocalizer(moment);



export const CalendarScreen = () => {

    const dispatch = useDispatch();
    const {events} = useSelector(state => state.calendar)

    const [lastView, setlastView] = useState(localStorage.getItem('lastView' ) || 'month')

    const onDoubleClick = (e) => {
        dispatch(uiOpenModal());
        
    }

    const onSelectEvent = (e) => {
        dispatch(eventSetActive(e));
        
    }

    const onViewChange = (e) => {
        setlastView(e);
       localStorage.setItem('lastView', e);
    }

    

    const eventStyleGetter = (event, start, end, isSelected) => {
        //console.log(event, start, end, isSelected);

        const style = {
            backgroundColor: '#367cf7',
            borderRadius: '8px',
            opacity:'0.7',
            display: 'block',
            color: 'white'
        }
        return {
            style
        }
    };
    return (
        <div className="calendar-screen">

            <Navbar />

            <Calendar 
            localizer = {localizer}
            events = {events}
            starAccessor = "start"
            endAccesor = "end"
            messages = {messages}
            eventPropGetter = {eventStyleGetter}
            onDoubleClickEvent = {onDoubleClick}
            onSelectEvent = {onSelectEvent}
            onView = {onViewChange}
            view = {lastView}
            components = {{
                event: CalendarEvent
            }}
            />
            <AddNewFab />
            <CalendarModal />
        </div>
    )
}
