import { BsThreeDots } from "react-icons/bs";
import Note from "../note/Note";
import { Card } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { openAddForm } from "../../features/toggleForm/toggleAddForm";

function CardModal({ title, items , openDetails }) {
  const dispatch = useDispatch();
  const searchQuerry = useSelector((state) => state.search.searchQuerry);
  const filteredNotes = items.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuerry.toLowerCase()) ||
      note.description.toLowerCase().includes(searchQuerry.toLowerCase())
  );

  const handleAddnew = () => {
    dispatch(openAddForm({state: true , data: {status: title}}))
  }
  return (
    <Card
      className={`px-4 py-2 bg-[#E6ECF0] overflow-y-auto h-fit max-h-[75vh] min-h-[100px]`}
    >
      <div className="top_show flex justify-between items-center ">
        <div className="left flex items-center">
          <h2 className="text-2xl font-bold mr-8 pacifico">{title}</h2>
          <span
            className={`numberOfNote cursor-default roboto-slab-base flex justify-center items-center w-8 h-8 rounded-full  text-lg ${
              filteredNotes.length > 0
                ? "bg-background text-white"
                : "bg-[#D5D5D5]"
            }`}
          >
            {filteredNotes.length}
          </span>
        </div>
        <div className="right flex items-center">
          <div
            onClick={handleAddnew}
            className="add hover:bg-[#1677ff] transs hover:text-white hover:text-xl  transition duration-300 ease-out flex justify-center cursor-pointer items-center w-8 h-8 rounded-full bg-[#D5D5D5] text-sm mr-4"
          >
            <PlusOutlined className="cursor-pointer" />
          </div>
          <div className="more flex justify-center items-center w-8 h-8 rounded-full bg-[#D5D5D5] text-sm">
            <BsThreeDots />
          </div>
        </div>
      </div>
      <div className="main">
        {filteredNotes.length > 0 &&
          filteredNotes.map((note) => (
            <Note
              openDetails={openDetails}
              key={`${note.date}-${note.title}`}
              items={note}
            />
          ))}
      </div>
    </Card>
  );
}

CardModal.propTypes = {
  items: PropTypes.array.isRequired,
  //     toggle: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  openDetails: PropTypes.func.isRequired,
  //     onEdit: PropTypes.func.isRequired,
  //     searchQuerry: PropTypes.string.isRequired,
  //     openAddNew: PropTypes.func.isRequired,
  //     isCalendarVisible: PropTypes.bool.isRequired
};
export default CardModal;
