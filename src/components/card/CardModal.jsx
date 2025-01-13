import { BsThreeDots } from "react-icons/bs";
import Note from "../note/Note";
import { Card } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";

function CardModal({ title, items }) {
  const searchQuerry = useSelector((state) => state.search.searchQuerry);
  const filteredNotes = items.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuerry.toLowerCase()) ||
      note.description.toLowerCase().includes(searchQuerry.toLowerCase())
  );
  return (
    <Card
      className={`mx-4 px-4 py-6 bg-[#E6ECF0] overflow-y-auto h-fit max-h-[75vh] min-h-[100px]`}
    >
      <div className="top_show flex justify-between items-center ">
        <div className="left flex items-center">
          <h2 className="text-2xl font-bold mr-8 pacifico">{title}</h2>
          <span
            className={`numberOfNote cursor-default roboto-slab-base flex justify-center items-center w-8 h-8 rounded-full  text-lg `}
          >
            0
          </span>
        </div>
        <div className="right flex items-center">
          <div
            // onClick={openAddNew}
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
              key={`${note.date}-${note.title}`}
              // onEdit={() => onEdit(note)}
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
  //     onEdit: PropTypes.func.isRequired,
  //     searchQuerry: PropTypes.string.isRequired,
  //     openAddNew: PropTypes.func.isRequired,
  //     isCalendarVisible: PropTypes.bool.isRequired
};
export default CardModal;
