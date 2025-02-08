import { useNavigate } from "react-router-dom";
import { Col, Button, Input, Typography, Select, notification } from "antd";
import {
  SyncOutlined,
  Loading3QuartersOutlined,
  CheckCircleTwoTone,
  LeftOutlined,
} from "@ant-design/icons";
import { useState, useEffect } from "react";
import {
  getUser,
  getDepartment,
  addUser,
  updateDepartment,
} from "../../services/apiHandle";
export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [deparment, setDepartment] = useState(null);
  const [selectList, setSelectList] = useState(null);

  const [usernameNoti, setUsernameNoti] = useState("---");
  const [emailNoti, setEmailNoti] = useState("---");
  const [pasNoti, setPasNoti] = useState("---");
  const [confirmPaNoti, setConfirmPassNoti] = useState("---");

  const [isLoadingUser, setIsLoadingUser] = useState(false);
  const [isLoadingEmail, setIsLoadingEmail] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [stateForUserIcon, setStateForUserIcon] = useState(false);
  const [stateForEmailIcon, setStateForEmailIcon] = useState(false);

  const [saveState, setSaveState] = useState([
    { name: "username", status: [{ notBlank: null }, { unique: null }] },
    {
      name: "email",
      status: [{ notBlank: null }, { isValid: null }, { unique: null }],
    },
    { name: "password", status: [{ notBlank: null }, { isValid: null }] },
    { name: "confirmPass", status: [{ notBlank: null }, { isMatch: null }] },
  ]);

  const userNameState = usernameNoti === "---";
  const emailState = emailNoti === "---";
  const passState = pasNoti === "---";
  const confirmState = confirmPaNoti === "---";

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passWordRegex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;

  const navigate = useNavigate();

  const component = [
    { name: "username", itsChildren: [setUsernameNoti] },
    { name: "email", itsChildren: [setEmailNoti] },
    { name: "password", itsChildren: [setPasNoti] },
    { name: "confirmPass", itsChildren: [setConfirmPassNoti] },
  ];

  const notiMessage = [
    { name: "notBlank", message: "Cannot leave this field blank!" },
    { name: "isValid", message: "Invalid Input!" },
    {
      name: "unique",
      message: "Input already exists! Please try another one.",
    },
    { name: "notMatch", message: "Passwords do not match!" },
  ];
  useEffect(() => {
    getSelectData();
  }, []);

  const updateSaveState = (fieldName, statusKey, value) => {
    setSaveState((prevState) =>
      prevState.map((field) =>
        field.name === fieldName
          ? {
              ...field,
              status: field.status.map((statusObj) =>
                Object.prototype.hasOwnProperty.call(statusObj, statusKey)
                  ? { ...statusObj, [statusKey]: value }
                  : statusObj
              ),
            }
          : field
      )
    );
  };

  const getSelectData = async () => {
    try {
      const result = await getDepartment();
      if (result.success === false) {
        notification.error({
          message:
            "Error when get data! Department field will set to OPERATION",
          description: result.message,
          placement: "topRight",
          duration: 1.5,
        });
        setDepartment("OPERATION");
        return;
      }
      const selectData = result.data.map((item) => item.name);
      localStorage.setItem("currentDeparment", JSON.stringify(result.data));
      setSelectList(selectData);
      setDepartment(selectData[0]);
    } catch (err) {
      notification.error({
        message: err.message,
        description: "Please try it again later !",
        placement: "topRight",
        duration: 1.5,
      });
    }
  };
  const renderSelect = () => {
    return [
      ...selectList.map((f) => ({
        label: <span>{f}</span>,
        value: f,
      })),
    ];
  };
  const handleAssingment = (value) => {
    setDepartment(value);
  };
  const handleFocusOnUserName = () => {
    setUsernameNoti("---");
    setStateForUserIcon(false);
  };
  const handleFocusOnEmail = () => {
    setEmailNoti("---");
    setStateForEmailIcon(false);
  };
  const handleBlurOnuserName = async () => {
    try {
      if (username === "") {
        setUsernameNoti("Cannot leave this field blank!");
        updateSaveState("username", "notBlank", false);
        return;
      }
      setIsLoadingUser(true);
      const result = await getUser();
      if (result.success === false) {
        notification.error({
          message: "Error when fetching !",
          description: result.message,
          placement: "topRight",
          duration: 1.5,
        });
        setIsLoadingUser(false);
        return;
      }
      const newResult = result.data.find((item) => username === item.username);
      if (newResult) {
        setUsernameNoti("Username already exist ! Please try another one");
        updateSaveState("username", "unique", false);
        setIsLoadingUser(false);
        setStateForUserIcon(false);
      } else {
        updateSaveState("username", "unique", true);
        updateSaveState("username", "notBlank", true);
        setUsernameNoti("---");
        setIsLoadingUser(false);
        setStateForUserIcon(true);
      }
    } catch (err) {
      setIsLoadingUser(false);
      setStateForUserIcon(false);
      notification.error({
        message: err.message,
        description: "Please try it again later !",
        placement: "topRight",
        duration: 1.5,
      });
    }
  };
  const handleBlurOnEmail = async () => {
    try {
      if (email === "") {
        setEmailNoti("Cannot leave this field blank !");
        updateSaveState("email", "notBlank", false);
        return;
      }
      if (!emailRegex.test(email)) {
        setEmailNoti("Invalid Email Format !");
        updateSaveState("email", "isValid", false);
        return;
      }
      setIsLoadingEmail(true);
      const result = await getUser();
      if (result.success === false) {
        notification.error({
          message: "Error when fetching !",
          description: result.message,
          placement: "topRight",
          duration: 1.5,
        });
        setIsLoadingEmail(false);
        return;
      }
      const newResult = result.data.find((item) => email === item.email);
      if (newResult) {
        setEmailNoti("Email already exist ! Please try another one");
        updateSaveState("email", "unique", false);
        setIsLoadingEmail(false);
        setStateForEmailIcon(false);
      } else {
        updateSaveState("email", "notBlank", true);
        updateSaveState("email", "isValid", true);
        updateSaveState("email", "unique", true);
        setEmailNoti("---");
        setIsLoadingEmail(false);
        setStateForEmailIcon(true);
      }
    } catch (err) {
      setIsLoadingEmail(false);
      setStateForEmailIcon(false);
      notification.error({
        message: err.message,
        description: "Please try it again later !",
        placement: "topRight",
        duration: 1.5,
      });
    }
  };
  const onTypingPassWord = () => {
    if (password === "") {
      setPasNoti("Cannot leave PassWord field blank !");
      updateSaveState("password", "notBlank", false);
      return;
    }
    if (!passWordRegex.test(password)) {
      setPasNoti("Invalid PassWord !");
      updateSaveState("password", "isValid", false);
      return;
    }
    updateSaveState("password", "notBlank", true);
    updateSaveState("password", "isValid", true);
    setPasNoti("---");
    return;
  };
  const onTypingConfirm = () => {
    if (confirmPass === "") {
      setConfirmPassNoti("Cannot leave this field blank !");
      updateSaveState("confirmPass", "notBlank", false);
      return;
    }
    if (!(confirmPass === password)) {
      setConfirmPassNoti("Passwords do not match ! ");
      updateSaveState("confirmPass", "isMatch", false);
      return;
    }
    setConfirmPassNoti("---");
    updateSaveState("confirmPass", "notBlank", true);
    updateSaveState("confirmPass", "isMatch", true);
    return;
  };
  const addUserToDeparment = async (data) => {
    try {
      const department = [
        ...JSON.parse(localStorage.getItem("currentDeparment")),
      ];
      if (!department.length) {
        setIsLoading(false);
        return;
      }
      let idIndex = 0;
      department.forEach((item, index) => {
        if (item.name === data.deparment) {
          item.member.push({ id: data.id, username: data.username });
          idIndex = index;
        }
      });
      const result = await updateDepartment(
        department[idIndex]["_id"],
        department[idIndex]
      );
      if (result.success === false) {
        notification.error({
          message: "Fail to fetching data. Please try it again later !",
          description: result.message,
          placement: "topRight",
          duration: 1.5,
        });
        setIsLoading(false);
        return;
      }
      localStorage.removeItem("currentDeparment");
      notification.success({
        message: "Register successfully !",
        description: "Go to login page in a few seconds.",
        placement: "topRight",
        duration: 1.5,
      });
      setIsLoading(false);
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (err) {
      notification.error({
        message: err.message,
        description: "Please try it again later !",
        placement: "topRight",
        duration: 1.5,
      });
    }
  };
  const handleAddUser = async (user) => {
    try {
      const result = await addUser(user);
      if (result.success === false) {
        notification.error({
          message: "Fail to register new user. Please try it again later !",
          description: result.message,
          placement: "topRight",
          duration: 1.5,
        });
        setIsLoading(false);
        return;
      }
      const filterData = {
        username: result.data.username,
        id: result.data["_id"],
        deparment: result.data.department,
      };
      addUserToDeparment(filterData);
    } catch (err) {
      setIsLoading(false);
      notification.error({
        message: err.message,
        description: "Please try it again later !",
        placement: "topRight",
        duration: 1.5,
      });
    }
  };
  const handleSave = () => {
    const fieldsWithFalseOrNullStatus = [];
    setIsLoading(true);
    saveState.forEach((field) => {
      const falseOrNullStatuses = [];
      field.status.forEach((statusObj) => {
        Object.entries(statusObj).forEach(([key, value]) => {
          if (value === false || value === null) {
            falseOrNullStatuses.push({ [key]: value });
          }
        });
      });
      if (falseOrNullStatuses.length > 0) {
        fieldsWithFalseOrNullStatus.push({
          name: field.name,
          status: falseOrNullStatuses,
        });
      }
    });

    fieldsWithFalseOrNullStatus.forEach((fieldWithStatus) => {
      const componentMatch = component.find(
        (comp) => comp.name === fieldWithStatus.name
      );
      if (componentMatch) {
        fieldWithStatus.status.forEach((statusObj) => {
          Object.entries(statusObj).forEach(([key, value]) => {
            if (value === false || value === null) {
              const notiMatch = notiMessage.find((noti) => noti.name === key);
              if (notiMatch) {
                componentMatch.itsChildren.forEach((setNoti) => {
                  setNoti(notiMatch.message);
                });
              }
            }
          });
        });
      }
    });

    if (!fieldsWithFalseOrNullStatus.length) {
      const data = {
        username: username,
        email: email,
        password: confirmPass,
        department: deparment,
        role: "Member",
        history_imgs: [null],
      };
      handleAddUser(data);
      return;
    }
    setIsLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-sky-100">
      <div
        className="p-6  bg-white h-4/5 w-1/2 border-2 rounded-xl shadow-xl shadow-slate-400 flex flex-col items-center justify-between"
        onKeyDown={handleKeyDown}
      >
        <div className="top w-full flex flex-col">
          <div>
            <Typography.Title
              level={5}
              type=""
              className="text-left roboto-slab-base "
            >
              Work Management System
            </Typography.Title>
          </div>
          <h1 className="text-4xl mt-2  pacifico text-center text-[#1677ff]">
            Sign Up Form
          </h1>
        </div>
        <div className="w-full mt-12 flex justify-between items-center">
          <Col span={11}>
            <Typography.Title className="merriweather-bold" level={5}>
              Username
            </Typography.Title>
            <Input
              size="large"
              status={!userNameState && "error"}
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onFocus={handleFocusOnUserName}
              addonAfter={
                isLoadingUser ? (
                  <SyncOutlined spin className="text-black" />
                ) : (
                  <CheckCircleTwoTone
                    twoToneColor={
                      stateForUserIcon
                        ? ["#1677ff", "#ffff"]
                        : ["#9ca3af", "#ffff"]
                    }
                  />
                )
              }
              disabled={isLoading}
              onBlur={handleBlurOnuserName}
            />
            <Typography.Paragraph
              className={`${
                userNameState ? "opacity-0" : "text-red-500"
              } merriweather mt-1`}
            >
              {usernameNoti}
            </Typography.Paragraph>
          </Col>
          <Col span={11}>
            <Typography.Title className="merriweather-bold" level={5}>
              Email
            </Typography.Title>
            <Input
              size="large"
              onFocus={handleFocusOnEmail}
              status={!emailState && "error"}
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              addonAfter={
                isLoadingEmail ? (
                  <SyncOutlined spin className="text-black" />
                ) : (
                  <CheckCircleTwoTone
                    twoToneColor={
                      stateForEmailIcon
                        ? ["#1677ff", "#ffff"]
                        : ["#9ca3af", "#ffff"]
                    }
                  />
                )
              }
              disabled={isLoading}
              onBlur={handleBlurOnEmail}
            />
            <Typography.Paragraph
              className={`${
                emailState ? "opacity-0" : "text-red-500"
              } merriweather mt-1`}
            >
              {emailNoti}
            </Typography.Paragraph>
          </Col>
        </div>

        <div className="w-full mt-5  flex justify-between items-center">
          <Col span={11}>
            <Typography.Title className="merriweather-bold" level={5}>
              Password
            </Typography.Title>
            <Input.Password
              status={!passState && "error"}
              size="large"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyUp={onTypingPassWord}
              disabled={isLoading}
            />
            <Typography.Paragraph
              className={`${passState && "opacity-0"} merriweather mt-1`}
              type={!passState && "danger"}
            >
              {pasNoti}
            </Typography.Paragraph>
            <Typography.Paragraph className="merriweather" type="secondary">
              * Password must contain at least 1 Capital letter , 1 Special
              letter , 1 Number and 8 letters long.
            </Typography.Paragraph>
          </Col>
          <Col span={11}>
            <Typography.Title className="merriweather-bold" level={5}>
              Confirm password
            </Typography.Title>
            <Input.Password
              status={!confirmState && "error"}
              placeholder="Confirm password"
              size="large"
              value={confirmPass}
              onKeyUp={onTypingConfirm}
              onChange={(e) => setConfirmPass(e.target.value)}
              disabled={isLoading}
            />
            <Typography.Paragraph
              className={`${confirmState && "opacity-0"} merriweather mt-1`}
              type={!confirmState && "danger"}
            >
              {confirmPaNoti}
            </Typography.Paragraph>
            <Typography.Paragraph
              className="merriweather opacity-0"
              type="danger"
            >
              * Password must contain at least 1 Capital letter , 1 Special
              letter , 1 Number and 8 letters long.
            </Typography.Paragraph>
          </Col>
        </div>

        <div className="w-full mt-5 flex justify-between items-center">
          <Col span={11}>
            <Typography.Title className="merriweather-bold" level={5}>
              Deparment
            </Typography.Title>
            <Select
              className="w-full h-12"
              value={deparment}
              onChange={handleAssingment}
              loading={selectList && deparment !== null ? false : true}
              options={selectList && renderSelect()}
              disabled={isLoading}
            />
            <Typography.Paragraph
              className="merriweather mt-1 opacity-0"
              type="danger"
            >
              Cannot leave this field blank !
            </Typography.Paragraph>
          </Col>
          <Col span={11}>
            <Typography.Title className="merriweather-bold" level={5}>
              Role
            </Typography.Title>
            <Select
              className="w-full  h-12"
              defaultValue="Member"
              disabled
              options={[
                {
                  value: "member",
                  label: "Member",
                },
              ]}
            />
            <Typography.Paragraph
              className="merriweather mt-1 opacity-0"
              type="danger"
            >
              Cannot leave this field blank !
            </Typography.Paragraph>
          </Col>
        </div>

        <div className=" btn_container flex justify-between w-full px-10 mt-7">
          <Button
            className="w-[43%] pacifico h-14 text-2xl "
            variant="outlined"
            color="primary"
            onClick={() => {
              //   localStorage.removeItem('currentDeparment');
              navigate("/login");
            }}
            disabled={isLoading}
          >
            <LeftOutlined className="relative right-9" />
            Back
          </Button>
          <Button
            className="w-[43%] h-14 pacifico text-2xl"
            variant="solid"
            color="primary"
            onClick={handleSave}
            disabled={isLoading}
          >
            {!isLoading ? "Sign Up" : <Loading3QuartersOutlined spin />}
          </Button>
        </div>
      </div>
    </div>
  );
}
