import { useState  } from "react";
import { Calendar, Modal, Badge, Button , Divider , Typography } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import moment from "moment";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { closeCalendar } from "../../features/toggleForm/toggleCalendar";
const CalendarWithEvents = ({noteItems }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newModalState , setNewModalState] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);

    const dispatch = useDispatch();

  const onSelectDate = (date) => {
    setSelectedDate(date.format("YYYY-MM-DD"));
    setIsModalVisible(true);
  };

  const handleClose = () =>{
    dispatch(closeCalendar());
  }
  const events = noteItems.reduce((acc, item) => {
    const dateKey = moment(item.date, "MMM Do YYYY").format("YYYY-MM-DD");
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push({
      type: calculateBadgeColor(item.date),
      content: item.title,
      id: item._id, 
      title: item.title,
      description: item.description,
      assignBy: item.asign_by,
      status: item.status,
      dueDay: item.date,
    });
    return acc;
  }, {});
  
  function calculateBadgeColor(eventDate) {
    const today = moment();
    const dueDate = moment(eventDate, "MMM Do YYYY");
  
    if (dueDate.isBefore(today, "day")) {
      return "error";
    } else if (dueDate.diff(today, "days") <= 3) {
      return "warning";
    } else {
      return "success";
    }
  }
  const dateCellRender = (value) => {
    const dateKey = value.format("YYYY-MM-DD");
    const currentEvents = events[dateKey] || [];
    return (
      <ul>
        {currentEvents.map((item, index) => (
          <li key={index} className="mb-2">
            <Badge status={item.type} text={
              <span className="inline-block max-w-[70px] overflow-hidden whitespace-nowrap text-ellipsis">
                {item.content}
              </span>
            } />
          </li>
        ))}
      </ul>
    );
  };
  const handleEventClick = (id) => {
    setSelectedEventId(id);
    setNewModalState(true);
  };
  const getEventDetails = (id) => {
    return noteItems.find((item) => item._id === id);
  };
  const eventDetails = selectedEventId ? getEventDetails(selectedEventId) : null;
  return (
    <div className="ant-picker-calendar w-1/2 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[12]">
      <Button
        className="absolute top-8 left-8 "
        onClick={handleClose}
        icon={<CloseOutlined />}
      ></Button>
      <Calendar cellRender={dateCellRender} onSelect={onSelectDate} />
      <Modal
        title={`Events on ${selectedDate}`}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        {selectedDate && events[selectedDate] ? (
          <ul>
            {events[selectedDate].map((event, index) => (
              <li key={index} className="hover:outline hover:outline-2 hover:outline-[#1677ff] cursor-pointer rounded-md p-2 my-2" onClick={() => handleEventClick(event.id)}>
                <Badge status={event.type} text={event.content} />
              </li>
            ))}
          </ul>
        ) : (
          <p>No events for this date.</p>
        )}
      </Modal>
      <Modal open={newModalState} footer={null} onCancel={() => setNewModalState(false)} className="">
      {eventDetails && (
          <div>
            <h3 className="pacifico text-xl">Event on {eventDetails.date}</h3>
            <Divider style={{ borderColor: "#1677ff"  }} className="roboto-slab-base" orientation="left">
              Note
            </Divider>
            <div className="flex flex-col">
              <div className="inline-block border-b border-b-stone-300">
                <label className="text-sm roboto-slab-base">Title: </label>
                <Typography.Title className="mt-2 merriweather-bolder" style={{color: '#1677ff' , fontStyle: 'italic'}}  level={5}>
                  {eventDetails.title}
                </Typography.Title>
              </div>
              <div className="inline-block mt-4 border-b border-b-stone-300">
                <label className="text-sm roboto-slab-base">Description: </label>
                <Typography.Paragraph className="mt-2 merriweather-bolder" style={{color: '#1677ff' , fontStyle: 'italic'}} >
                  {eventDetails.description}
                </Typography.Paragraph>
              </div>
              <div className="inline-block mt-4 border-b border-b-stone-300">
                <label className="text-sm roboto-slab-base">Assigned By: </label>
                <Typography.Title className="mt-2 merriweather-bolder" level={5} style={{color: '#1677ff' , fontStyle: 'italic'}} >
                  {eventDetails.asign_by}
                </Typography.Title>
              </div>
              <div className="inline-block mt-4 border-b border-b-stone-300">
                <label className="text-sm roboto-slab-base">Status: </label>
                <Typography.Title className="mt-2 merriweather-bolder" level={5} style={{color: '#1677ff' , fontStyle: 'italic'}} >
                  {eventDetails.status}
                </Typography.Title>
              </div>
              <div className="inline-block mt-4 border-b border-b-stone-300">
                <label className="text-sm roboto-slab-base">Due Day: </label>
                <Typography.Title className="mt-2 merriweather-bolder" level={5} style={{color: '#1677ff' , fontStyle: 'italic'}} >
                  {eventDetails.date}
                </Typography.Title>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CalendarWithEvents;

CalendarWithEvents.propTypes = {
//   onCloseCalendar: PropTypes.func.isRequired,
  noteItems: PropTypes.array,
}