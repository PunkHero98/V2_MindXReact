// import { HiXMark } from "react-icons/hi2";
import { useState, useEffect } from "react";
import { Select, Input, DatePicker, Button, notification, Modal } from "antd";
import {
  FlagFilled,
  CloseSquareOutlined,
  Loading3QuartersOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import moment from "moment";
import {
  insertNote,
  updateNote,
  deleteNote,
  getDepartment,
} from "../../services/apiHandle.js";
import { useDispatch } from "react-redux";
import {
  closeAddForm,
  openAddForm,
} from "../../features/toggleForm/toggleAddForm.js";
import { useSelector } from "react-redux";
const { TextArea } = Input;
const { confirm } = Modal;

function AddModal() {
  const listCard = ["To do", "In Progress", "In Review", "Done"];

  const [id, setId] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [assignment, setAssignment] = useState("");
  const [status, setStatus] = useState(listCard[0]);

  // const [note , setNote] = useState(null);
  const [options, setOptions] = useState([]);

  const [check, setCheck] = useState("---");
  const [descriptNoti, setDescriptNoti] = useState("---");
  const [dateNoti, setDateNoti] = useState("---");
  const [assignNoti, setAssignNoti] = useState("---");

  const [isLoading, setIsLoading] = useState(false);
  const [loadingForDelete, setLoadingForDelete] = useState(false);

  const checkState = check === "---";
  const descriptState = descriptNoti === "---";
  const dateState = dateNoti === "---";
  const assignState = assignNoti === "---";

  const dispatch = useDispatch();
  const note = useSelector((state) => state.toggleAddForm.addFormStage);
  const user = useSelector((state) => state.user.user);
  const handleCloseAdd = () => {
    dispatch(closeAddForm());
  };

  useEffect(() => {
    if (note.data) {
      setId(note.data["_id"] || null);
      setTitle(note.data.title);
      setDescription(note.data.description);
      setAssignment(note.data.assignment);
      setDate(note.data.date);
      setStatus(note.data.status);
    }
  }, [note]);

  // useEffect(() => {
  //   if(note.state){
  //     handleRenderSelect();
  //   }
  // } , [note.state])

  function getUsernamesByDepartmentName(response, departmentName) {
    const department = response.find((group) => group.name === departmentName);
    if (department && department.member) {
      return department.member
        .filter((member) => member !== null) // Loại bỏ giá trị null
        .map((member) => member.username); // Lấy danh sách username
    }
    return [];
  }
  const handleDepartment = async (name) => {
    try {
      const result = await getDepartment();
      if (result.success === false) {
        notification.error({
          message: "Error when get data !",
          description: result.message,
          placement: "topRight",
          duration: 1.5,
        });
        return null;
      }
      return getUsernamesByDepartmentName(result.data, name);
    } catch (err) {
      notification.error({
        message: err.message,
        description: "Please try it again later !",
        placement: "topRight",
        duration: 1.5,
      });
      return null;
    }
  };
  const renderSelectStatus = () => {
    return listCard.map((f) => ({
      label: <span>{f}</span>,
      value: f,
    }));
  };
  useEffect(() => {
    fetchOptions(); // Gọi hàm khi component mount
  }, [user.department]);

  const fetchOptions = async () => {
    const users = await handleDepartment(user.department);
    setAssignment(users[0]);
    if (users) {
      setOptions(
        users.map((f) => ({
          label: <span>{f}</span>,
          value: f,
        }))
      );
    }
  };
  const handleSave = async () => {
    try {
      const { user_id, username } = user;
      const updatedNote = {
        user_id,
        title,
        description,
        assignment,
        date,
        status,
        asign_by: username,
      };
      const result = await insertNote(updatedNote);
      if (result.success === true) {
        dispatch(openAddForm({ state: false, isUpdate: true }));
        notification.success({
          message: "Success",
          placement: "topRight",
          duration: 1.5,
        });
        setTitle("");
        setDescription("");
        setDate("");
        setAssignment("");
        setStatus("To do");
        setIsLoading(false);
        return;
      }

      notification.error({
        message: result.message,
        placement: "topRight",
        duration: 1.5,
      });
    } catch (err) {
      notification.error({
        message: err.message,
        description: "Please try it again later !",
        placement: "topRight",
        duration: 1.5,
      });
    }
  };
  const handleOk = () => {
    setLoadingForDelete(true);
    handleDelete();
  };
  const handleDelete = async () => {
    try {
      const result = await deleteNote(id);
      if (result.success === true) {
        dispatch(openAddForm({ state: false, isUpdate: true }));
        setTitle("");
        setDescription("");
        setDate("");
        setAssignment("");
        setStatus("To do");
        notification.success({
          message: "Success",
          placement: "topRight",
          duration: 1.5,
        });
        setLoadingForDelete(false);

        return;
      }

      notification.error({
        message: result.message,
        placement: "topRight",
        duration: 1.5,
      });
    } catch (err) {
      notification.error({
        message: err.message,
        description: "Please try it again later !",
        placement: "topRight",
        duration: 1.5,
      });
    }
  };

  const handleEdit = async () => {
    try {
      const updatedNote = { title, description, assignment, date, status };
      const result = await updateNote(id, updatedNote);
      if (result.success === true) {
        dispatch(openAddForm({ state: false, isUpdate: true }));
        setTitle("");
        setDescription("");
        setDate("");
        setAssignment("");
        setStatus("To do");
        notification.success({
          message: "Success",
          placement: "topRight",
          duration: 1.5,
        });
        setIsLoading(false);
        return;
      }

      notification.error({
        message: result.message,
        placement: "topRight",
        duration: 1.5,
      });
    } catch (err) {
      notification.error({
        message: err.message,
        description: "Please try it again later !",
        placement: "topRight",
        duration: 1.5,
      });
    }
  };
  const handleDate = (date) => {
    if (date) {
      const customFormat = date.format("MMM Do YYYY");
      setDate(customFormat);
    } else {
      setDate(null);
    }
  };
  const handleAssingment = (value) => {
    setAssignment(value);
  };
  const handleStatus = (value) => {
    setStatus(value);
  };
  const checkTitle = () => {
    let state = true;
    if (!title) {
      setCheck("Title is required");
      state = false;
    }
    if (!date) {
      setDateNoti("Date is required");
      state = false;
    }
    if (!description) {
      setDescriptNoti("Description is required");
      state = false;
    }
    if (!assignment) {
      setAssignNoti("Assignment is required");
      state = false;
    }
    if (state) {
      setCheck("---");
      id ? handleEdit() : handleSave();
      setIsLoading(true);
    }
  };

  // useEffect(() => {
  //   console.log(status);
  // }, [status]);
  const showDeleteConfirm = () => {
    confirm({
      title: "Are you sure delete this task?",
      icon: <ExclamationCircleFilled />,
      content: "Some descriptions",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        handleOk();
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };
  return (
    <div className="w-[700px] h-[600px] bg-white rounded-lg px-4 py-2 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[50] border-2 shadow-lg">
      <div className="first_row flex justify-between items-center mt-5">
        <div className=" w-fit p-1 rounded-xl border-2">
          <FlagFilled className="text-3xl text-green-400" />
        </div>

        <CloseSquareOutlined
          onClick={handleCloseAdd}
          className="text-4xl text-[#f5222d] hover:bg-[#f5222d] hover:text-white"
        />
      </div>
      <h2 className="table_name pacifico text-left text-4xl mt-6 mb-9">
        {id ? "Edit Task" : "Save Task"}
      </h2>
      <div className="second_row flex gap-6 mb-1">
        <div className="title w-4/6 flex flex-col">
          <label className="merriweather-bolder text-lg mb-1">
            Title<span className="text-red-500">*</span>
          </label>

          <Input
            className="merriweather-bold text-lg"
            placeholder="Enter title"
            showCount
            value={title}
            style={{ height: 50 }}
            status={!checkState && "error"}
            maxLength={50}
            onChange={(e) => setTitle(e.target.value)}
          />
          <div
            className={`merriweather-bolder text-sm mt-1 ${
              checkState ? "opacity-0" : "text-red-500"
            }`}
          >
            <span>{check}</span>
          </div>
        </div>
        <div className="endDate w-2/6 flex flex-col">
          <label className="merriweather-bolder text-lg mb-1" htmlFor="">
            End Date <span className="text-red-500">*</span>
          </label>

          <DatePicker
            className="merriweather"
            value={date ? moment(date, "MMM Do YYYY") : null}
            style={{ height: 50 }}
            status={!dateState && "error"}
            format="DD-MMM-YYYY"
            onChange={handleDate}
            needConfirm
          />
          <div
            className={`${
              dateState ? "opacity-0" : "text-red-500"
            } merriweather-bolder text-sm mt-1`}
          >
            <span>{dateNoti}</span>
          </div>
        </div>
      </div>
      <div className="third flex gap-6 mt-2">
        <div className="description w-4/6 flex flex-col">
          <label className="merriweather-bolder text-lg mb-1" htmlFor="">
            Description <span className="text-red-500">*</span>
          </label>

          <TextArea
            placeholder="Enter description"
            className="merriweather"
            status={!descriptState && "error"}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            autoSize={{
              minRows: 2,
              maxRows: 6,
            }}
          />
          <div
            className={`${
              descriptState ? "opacity-0" : "text-red-500"
            } merriweather-bolder text-sm mt-1`}
          >
            <span>{descriptNoti}</span>
          </div>
        </div>
        <div className="assign w-2/6 flex flex-col">
          <label className="merriweather-bolder text-lg mb-1" htmlFor="">
            Assign <span className="text-red-500">*</span>
          </label>
          <Select
            style={{
              height: 50,
              zIndex: 50,
            }}
            className="merriweather"
            status={!assignState && "error"}
            value={assignment}
            loading={assignment == "" ? true : false}
            onChange={handleAssingment}
            options={options}
          />
          <div
            className={`${
              assignState ? "opacity-0" : "text-red-500"
            } merriweather-bolder text-sm mt-1`}
          >
            <span>{assignNoti}</span>
          </div>
        </div>
      </div>
      <div className="fourth_row flex flex-col mt-2">
        <label className="merriweather-bolder text-lg mb-1" htmlFor="">
          Status <span className="text-red-500">*</span>
        </label>
        <Select
          className="merriweather"
          style={{
            height: 50,
            zIndex: 50,
            width: 200,
          }}
          value={status}
          onChange={handleStatus}
          options={renderSelectStatus()}
        />
        <div className="opacity-0">
          <span>---</span>
        </div>
      </div>
      <div className="last_row flex justify-between items-center mt-2">
        <Button
          color="danger"
          onClick={id ? showDeleteConfirm : handleCloseAdd}
          variant="outlined"
          loading={loadingForDelete}
          disabled={loadingForDelete}
          className="cancel pacifico w-[46%] h-12 text-2xl"
        >
          {id ? "Delete" : "Cancel"}
        </Button>
        <Button
          color="primary"
          onClick={checkTitle}
          variant="solid"
          className="save pacifico w-[46%] h-12 text-2xl "
          disabled={isLoading}
        >
          {!isLoading ? "Save" : <Loading3QuartersOutlined spin />}
        </Button>
      </div>
    </div>
  );
}

export default AddModal;
