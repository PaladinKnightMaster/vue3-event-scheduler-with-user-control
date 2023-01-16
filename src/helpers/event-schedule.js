export { event2schedule, schedule2event };
import moment from 'moment';

const defaultEvent = {
  // qalendar attr
  id: '',
  title: '',
  with: '',
  time: { start: '', end: '' },
  // default
  isEditable: true,
  colorScheme: "meetings",
  // schedule attr
  name: '',
  date_call: '',
  time_estimate: '',
  time_start: '',
  time_end: '',
  acre: '',
  valve_number: '',
  due_price: '',
  created_by_id: undefined
}

const defaultSchedule = {
  id: '',
  name: '',
  date_call: '',
  date_waterlogging: '',
  time_estimate: '',
  time_start: '',
  time_end: '',
  acre: '',
  valve_number: '',
  due_price: '',
  created_by_id: undefined
}

function event2schedule(event) {
  let schedule = Object.assign({}, defaultSchedule);
  schedule.id = event.id;
  schedule.name = event.name;
  schedule.date_call = event.date_call;
  schedule.date_waterlogging = event.date_waterlogging;
  schedule.time_estimate = event.time_estimate;
  schedule.time_start = event.time_start;
  schedule.time_end = event.time_end;
  schedule.acre = event.acre;
  schedule.valve_number = event.valve_number;
  schedule.due_price = event.due_price;
  schedule.created_by_id = event.created_by_id;
  return schedule;
}

function schedule2event(schedule, isArray) {
  if (isArray) {
    let events = new Array();
    schedule.forEach(element => {
      let event = Object.assign({}, defaultEvent);
      event.id = element.id;
      event.title = element.name;
      event.with = element.created_by_id;
      event.time = {
        start: moment(element.date_waterlogging).format('YYYY-MM-DD') + " " + moment(element.time_start, 'hh:mm:ss').format('hh:mm'),
        end: moment(element.date_waterlogging).format('YYYY-MM-DD') + " " + moment(element.time_end, 'hh:mm:ss').format('hh:mm')
      };
      event.name = element.name;
      event.date_call = element.date_call;
      event.date_waterlogging = moment(element.date_waterlogging).format('YYYY-MM-DDThh:mm');
      event.time_estimate = moment(element.time_estimate, 'hh:mm:ss').format('hh:mm');
      event.time_start = moment(element.time_start, 'hh:mm:ss').format('hh:mm');
      event.time_end = moment(element.time_end, 'hh:mm:ss').format('hh:mm');
      event.acre = element.acre;
      event.valve_number = element.valve_number;
      event.due_price = element.due_price;
      event.created_by_id = element.created_by_id;
      
      events.push(event);
    });
    return events;
  } else {
    let event = Object.assign({}, defaultEvent);
    event.id = schedule.id;
    event.title = schedule.name;
    event.with = schedule.created_by_id;
    event.time = {
      start: moment(schedule.date_waterlogging).format('YYYY-MM-DD') + " " + moment(schedule.time_start, 'hh:mm:ss').format('hh:mm'),
      end: moment(schedule.date_waterlogging).format('YYYY-MM-DD') + " " + moment(schedule.time_end, 'hh:mm:ss').format('hh:mm')
    };
    event.name = schedule.name;
    event.date_call = schedule.date_call;
    event.date_waterlogging = moment(schedule.date_waterlogging).format('YYYY-MM-DDThh:mm');
    event.time_estimate = moment(schedule.time_estimate, 'hh:mm:ss').format('hh:mm');
    event.time_start = moment(schedule.time_start, 'hh:mm:ss').format('hh:mm');
    event.time_end = moment(schedule.time_end, 'hh:mm:ss').format('hh:mm');
    event.acre = schedule.acre;
    event.valve_number = schedule.valve_number;
    event.due_price = schedule.due_price;
    event.created_by_id = schedule.created_by_id;
    return event;
  }
}