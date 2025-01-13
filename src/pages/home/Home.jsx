import { useId, useState, useEffect } from "react";
import CardModal from "../../components/card/CardModal";
import { getNote } from "../../services/apiHandle";
import { useSelector } from "react-redux";
import { notification  } from "antd";
import { SyncOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { addNoteItems } from "../../features/data/items";

export default function Home() {
  const dispatch = useDispatch();
  const addFormToggleState = useSelector(
    (state) => state.toggleAddForm.addFormStage
  );
  const id = useId();
  const listCard = ["To do", "In Progress", "In Review", "Done"];
  const currentUser = useSelector((state) => state.user.user);
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    try {
      const result = await getNote();
      if (result.success === true) {
        setItems(() =>
          result.data.filter((item) => item.assignment == currentUser.username)
        );
        dispatch(addNoteItems(result.data.filter((item) => item.assignment == currentUser.username)))
        setIsLoading(true);
        return;
      }
      setIsLoading(true);
      notification.error({
        message: result.message,
        placement: "topRight",
        duration: 1.5,
      });
      return;
    } catch (err) {
      setIsLoading(true);

      notification.error({
        message: err.message,
        placement: "topRight",
        duration: 1.5,
      });
    }
  };
  const filterItemsByStatus = (status) => {
    const result = items.filter((item) => item.status === status);
    return result;
  };
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if(addFormToggleState.isUpdate){
      fetchData();
    }
  }, [addFormToggleState.state]);
  return (
    <>
      {isLoading ? (
          <div className={` main px-8 grid grid-cols-4 gap-8 h-[77vh]`}>
            {listCard.map((item, index) => (
              <CardModal
                key={`${Date.now()}-${index}-${id}`}
                title={item}
                items={filterItemsByStatus(item)}
              />
            ))}
          </div>
      ) : (
        <div className="absolute left-[800px] top-1/3 text-4xl text-[#1677ff]">
          <SyncOutlined spin className="mr-12" />
          <span className="pacifico ">Loading data ...</span>
        </div>
      )}
      
    </>
  );
}
