import bootstrap5Plugin from '@fullcalendar/bootstrap5';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import 'bootstrap-icons/font/bootstrap-icons.css';
import PropTypes from 'prop-types';
import { useEffect, useRef } from 'react';

const TeachingStaffCalendar = (props) => {
  const {
    direction,
    calendarApi,
    calendarsColor,
    setCalendarApi,
    handleLeftSidebarToggle,
    handleAddEventSidebarToggle,
    attendances,
    setSelected
  } = props;

  const calendarRef = useRef();

  useEffect(() => {
    if (calendarApi === null) {
      setCalendarApi(calendarRef.current?.getApi());
    }
  }, [calendarApi, setCalendarApi]);

  // Map attendance data to FullCalendar's event format
  const events = attendances ? attendances.data?.map((item) => ({
    title: `${item.status}`,  // You can customize the title as needed
    date: item.date,  // FullCalendar expects a date string in ISO format
    status: item.status,  // Optional: You could use this for custom styling
    color: item.status === 'present' ? 'green' : 'red' // Example: Green for 'present', Red for 'absent'
  })) : [];

  const calendarOptions = {
    events,
    displayEventTime: false,
    plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin, bootstrap5Plugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      start: 'sidebarToggle, prev, next, title',
      end: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth'
    },
    views: {
      week: {
        titleFormat: { year: 'numeric', month: 'long', day: 'numeric' }
      }
    },
    editable: false,
    eventResizableFromStart: true,
    dragScroll: true,
    dayMaxEvents: 2,
    navLinks: true,
    eventClassNames({ event: calendarEvent }) {
      const colorName = calendarsColor[calendarEvent._def.title];
      return [`bg-${colorName}`];
    },
    eventClick() {
      handleAddEventSidebarToggle();
    },
    customButtons: {
      sidebarToggle: {
        icon: 'bi bi-list',
        click() {
          handleLeftSidebarToggle();
        }
      }
    },
    dateClick(info) {
      setSelected(info);
      handleAddEventSidebarToggle();
    },
    ref: calendarRef,
    direction
  };
  console.log(calendarOptions)
  return <FullCalendar {...calendarOptions} />;
};

TeachingStaffCalendar.propTypes = {
  direction: PropTypes.any,
  calendarApi: PropTypes.any,
  calendarsColor: PropTypes.any,
  setCalendarApi: PropTypes.any,
  handleLeftSidebarToggle: PropTypes.any,
  handleAddEventSidebarToggle: PropTypes.any,
  attendances: PropTypes.arrayOf(PropTypes.object),
  setSelected: PropTypes.func
};

export default TeachingStaffCalendar;
