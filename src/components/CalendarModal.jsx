import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const CalendarModal = ({ visible, onClose, currentDate, onDateChange }) => {
  const closeModal = () => {
    onClose(); // Call the onClose function when the button is clicked
  };
  const locale = 'en-US';
  return (
    <div className={`calendar-modal ${visible ? 'visible' : ''}`}>
      {visible && (
        <div className="modal-content">
          <button onClick={closeModal} className="close-button">
            Close
          </button>
          <Calendar
            onChange={onDateChange}
            value={currentDate}
            className="custom-calendar"
            locale={locale}
          />
        </div>
      )}
    </div>
  );
};

export default CalendarModal;
