import { LuPencilLine } from "react-icons/lu";
import { BsPaperclip } from "react-icons/bs";
import PropTypes from "prop-types"; // Import PropTypes
import { ClockCircleOutlined, FlagTwoTone } from "@ant-design/icons";
import { Tooltip } from "antd";
import { useDispatch } from "react-redux";
import { openAddForm } from "../../features/toggleForm/toggleAddForm";

function Note({ items , openDetails }) {
  const dispatch = useDispatch();
  const cleanDate = new Date(
    items.date.replace(/(\d+)(st|nd|rd|th)/, "$1")
  ).getTime();
  const today = Date.now();

  const daysDifference = Math.floor((cleanDate - today) / 86400000);

  const handleClick = () => {
    dispatch(openAddForm({state: true , data: items }))
  }
  const getFlagColors = () => {
    if (daysDifference < 0) return ["#ef4444", "#fecaca"];
    if (daysDifference <= 3) return ["#eab308", "#fde68a"];
    return ["#16a34a", "#bbf7d0"];
  };
  const getTooltipMessage = () => {
    if (daysDifference < 0) {
      return `Over Due by ${Math.abs(daysDifference)} day(s)`;
    }
    if (daysDifference === 0) {
      return `Due today!`;
    }
    return `Due in ${daysDifference} day(s)`;
  };

  return (
    <div className="mt-8 bg-white px-4 rounded-lg  dark:bg-slate-600  dark:text-[#E0E0E0]" >
      <div className="top flex justify-between py-4">
        <h1 className="text-base merriweather-bolder">{items.title}</h1>
        <LuPencilLine className="text-2xl" onClick={handleClick}/>
      </div>
      <div className="text_container mb-5 merriweather">
        <p>{items.description}</p>
      </div>
      <div className="flex justify-between">
        <span className="bg-[#1677ff] text-white p-2 rounded-md merriweather-bold dark:bg-[#66A3FF] dark:text-slate-800">
          {items.assignment}
        </span>
        <span className="dark:bg-teal-400 bg-green-500 text-white p-2 rounded-md cursor-pointer dark:text-slate-800" onClick={openDetails} >
          Details
        </span>
      </div>
      <hr className="mt-5 mb-3" />
      <div className="bottom flex justify-center items-center gap-8 pb-4">
        <div className="clip flex justify-center items-center">
          <BsPaperclip className="text-3xl hover:text-[#1677ff]" />
          <label className="roboto-slab-base text-base" htmlFor="">
            3
          </label>
        </div>
        <Tooltip title={getTooltipMessage()}>
          <FlagTwoTone className="text-2xl" twoToneColor={getFlagColors()} />
        </Tooltip>
        <div className="dueTime flex justify-center items-center">
          <ClockCircleOutlined className="text-2xl mr-2" />
          <label className="roboto-slab-base">{items.date}</label>
        </div>
      </div>
    </div>
  );
}

Note.propTypes = {
  items: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    assignment: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
  }).isRequired,
  openDetails: PropTypes.func.isRequired,
  //   onEdit: PropTypes.func.isRequired,
};

export default Note;
