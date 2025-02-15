import React, { useState, useEffect } from 'react'
import Modal from 'react-modal';
import DateTimePicker from 'react-datetime-picker';
import moment from 'moment';
import Swalert from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { uiOCloseModal } from '../../actions/ui';
import { eventAddNew, eventClearActiveEvent, eventUpdated } from '../../actions/events';


const customStyles = {
    content : {
      top                   : '50%',
      left                  : '50%',
      right                 : 'auto',
      bottom                : 'auto',
      marginRight           : '-50%',
      transform             : 'translate(-50%, -50%)'
    }
  };
  Modal.setAppElement('#root');

  const now = moment().minutes(0).seconds(0).add(1, 'hours');
  const nowPlus1 = now.clone().add(1,'hours')
  const initEvent = {
    title: '',
    notes: '',
    start: now.toDate(),
    end: nowPlus1.toDate()
}

export const CalendarModal = () => {

        const { modalOpen } = useSelector(state => state.ui);
        const { activeEvent } = useSelector(state => state.calendar);

        const dispatch = useDispatch();
        const [dateStart, setdateStart] = useState(now.toDate());
        const [dateEnd, setdateEnd] = useState(nowPlus1.toDate());
        const [titleValid, settitleValid] = useState(true);

        const [formValues, setformValues] = useState({
            title: 'Evento',
            notes: '',
            start: now.toDate(),
            end: nowPlus1.toDate()
        });

        const {notes, title, start, end} = formValues;


        useEffect(() => {
            if(activeEvent){
                setformValues(activeEvent);
            }else{
                setformValues(initEvent);
            }
            
        }, [activeEvent, setformValues])


        const handleInputChange = ({target}) => {
            setformValues({
                ...formValues,
                [target.name]: target.value
            });
        }
    const closeModal = () => {
        //TODO: cerrar modal
        dispatch(uiOCloseModal());
        dispatch(eventClearActiveEvent());
        setformValues(initEvent);
    }
    const handleStarDateChange = (e) => {
        setdateStart( e );
        setformValues({
            ...formValues,
            start: e
        })
    }
    const handleEndDateChange = (e) => {
        setdateEnd( e );
        setformValues({
            ...formValues,
            end: e
        })
    }

    const handleSubmitForm = (e) => {

        e.preventDefault();
        console.log(formValues)

        const momentStart = moment(start);
        const momentEnd = moment(end);

        if(momentStart.isSameOrAfter(momentEnd)){
            return Swalert.fire('Error la fecha fin debe ser mayor a la inicial')
            
        }
        if(title.trim().length < 2){
            return settitleValid(false)
        }
        //TODO: Hacer grabacion
        if(activeEvent){
            dispatch(eventUpdated(formValues))
        }else{
            dispatch(eventAddNew({
                ...formValues,
                id: new Date().getTime(),
                user:{
                    _id: '123',
                    name: 'Sandra'
                }
            }));
    
        }
        
        settitleValid(true)
        closeModal();
    }
    return (
        <Modal
          isOpen={modalOpen}
        //   onAfterOpen={afterOpenModal}
          onRequestClose={closeModal}
          style={customStyles}
          closeTimeoutMS = {200}
          className="modal"
          overlayClassName="modal-fondo"
        >
            <h1> {(activeEvent)? 'Editar consulta': 'Nueva consulta'} </h1>
        <hr />
        <form 
        className="container"
        onSubmit={handleSubmitForm}
        >

            <div className="form-group">
                <label>Fecha y hora inicio</label>
                <DateTimePicker 
                    onChange={handleStarDateChange}
                    value = {dateStart}
                    className="form-control"
                    
                />
            </div>

            <div className="form-group">
                <label>Fecha y hora fin</label>
                <DateTimePicker 
                    onChange={handleEndDateChange}
                    value = {dateEnd}
                    minDate = {dateStart}
                    className="form-control"
                    
                />
            </div>

            <hr />
            <div className="form-group">
                <label>Titulo y notas</label>
                <input 
                    type="text" 
                    className={`form-control ${!titleValid && 'is-invalid'}`}
                    placeholder="Título del evento"
                    name="title"
                    autoComplete="off"
                    value = {title}
                    onChange = {handleInputChange}
                />
                <small id="emailHelp" className="form-text text-muted">Una descripción corta</small>
            </div>

            <div className="form-group">
                <textarea 
                    type="text" 
                    className="form-control"
                    placeholder="Notas"
                    rows="5"
                    name="notes"
                    value = {notes}
                    onChange = {handleInputChange}
                ></textarea>
                <small id="emailHelp" className="form-text text-muted">Información adicional</small>
            </div>

            <button
                type="submit"
                className="btn btn-outline-primary btn-block"
            >
                <i className="far fa-save"></i>
                <span> Guardar</span>
            </button>

        </form>
        </Modal>
    )
}
