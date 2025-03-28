// import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { logout } from "../../features/auth/Login";
import { openAddForm } from "../../features/toggleForm/toggleAddForm";
import { openCalendar } from "../../features/toggleForm/toggleCalendar";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setSearchQuerry } from "../../features/search/searchQuerry";
import { Button, Input, Space, Dropdown, Switch, Avatar } from "antd";
import { GrGamepad } from "react-icons/gr";
import './header.css'
import {
  UserOutlined,
  CalendarTwoTone,
  WechatOutlined,
  SunOutlined,
  MoonOutlined,
  HomeFilled,
  GlobalOutlined,
  FundOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { useEffect } from "react";
const { Search } = Input;
const Header = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  //   const calendarState = useSelector((state) => state.toggleCalendar.calendarState)
  const addFormToggleState = useSelector(
    (state) => state.toggleAddForm.addFormStage
  );
  const navigate = useNavigate();
  const [userImgUrl, setUserImgUrl] = useState(null);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const itemsForMem = [
    {
      label: <Link to={`/account/${user?._id || ""}`}>Account</Link>,
      key: "0",
    },
    {
      type: "divider",
    },
    {
      label: <Link onClick={() => handleLogout()}>Logout</Link>,
      key: "3",
    },
  ];

  const itemsForAdd = [
    {
      label: <Link to={`/account/${user?._id || ""}`}>Account</Link>,
      key: "0",
    },
    {
      label: <Link to={`/manage_user`}>Manage User</Link>,
      key: "1",
    },
    {
      type: "divider",
    },
    {
      label: <Link onClick={() => handleLogout()}>Logout</Link>,
      key: "3",
    },
  ];
  const language = [
    {
      label: "English",
      key: "0",
    },
    {
      label: "Vietnamese",
      key: "1",
    },
  ];
  const handleSearch = (e) => {
    // const querryValue = value;
    // setQuerry(e.target.value);
    dispatch(setSearchQuerry(e.target.value));
  };
  const handleLogout = () => {
    dispatch(logout());
    // navigate("/login");
  };
  const handleOpenAddForm = () => {
    dispatch(openAddForm({ state: true }));
  };
  const handleOpenCalendar = () => {
    dispatch(openCalendar());
  };
  useEffect(() => {
    setUserImgUrl(user.img_url);
  }, [user.img_url]);
  return (
    <div className="flex flex-col px-8 dark:bg-slate-800">
      <div
        className={` upperContainer flex justify-between items-center  py-8`}
      >
        <h1 className="pacifico text-3xl text-[#1677ff] cursor-default dark:text-[#66A3FF]">
          Work Management System
        </h1>
        <HomeFilled
          className="text-3xl text-[#1677ff] cursor-pointer dark:text-[#66A3FF]"
          onClick={() => {
            navigate("/");
          }}
        />
        <Search
          placeholder="Search title or description"
          className="roboto-slab-base text-lg w-[500px] dark:text-white custom-search"
          enterButton
          size="large"
          //   onSearch={handleSearch}
          onChange={handleSearch}
        />
        <div className="flex items-center gap-4">
          <h4 className="mr-4 text-2xl pacifico dark:text-[#E0E0E0]">
            Welcome , {user ? user.username : "Guest"} !
          </h4>
          <Dropdown
            menu={{
              items: user.role === "Admin" ? itemsForAdd : itemsForMem,
            }}
            trigger={["click"]}
            overlayClassName="w-[200px] "
          >
            <a onClick={(e) => e.preventDefault()}>
              {userImgUrl ? (
                <Avatar
                  size={64}
                  shape="square"
                  src={user.img_url}
                  className="cursor-pointer"
                />
              ) : (
                <Space className="border  bg-[#1677ff] text-white hover:bg-white hover:border-[#1677ff] hover:text-[#1677ff] p-2 rounded-md ">
                  <UserOutlined className="text-2xl " />
                </Space>
              )}
            </a>
          </Dropdown>
        </div>
        <Dropdown
          menu={{ items: language }}
          trigger={["click"]}
          overlayClassName="w-[100px]"
        >
          <GlobalOutlined className="cursor-pointer text-3xl text-blue-500 dark:text-[#66A3FF]" />
        </Dropdown>
        <Switch
          className="px-2"
          unCheckedChildren={<SunOutlined />}
          checkedChildren={<MoonOutlined />}
          checked={darkMode}
          onChange={() => setDarkMode(!darkMode)}
        />
      </div>
      <div className="navbar mb-8 rounded-full flex items-center  h-12">
        <Button
          disabled={addFormToggleState.state}
          onClick={handleOpenAddForm}
          variant={"solid"}
          color="primary"
          className={` addNew pacifico rounded-l-3xl rounded-r-xl h-12 text-xl dark:bg-[#66A3FF] dark:text-slate-800`}
        >
          Add New
        </Button>
        <Button
          variant="solid"
          color="primary"
          className={` h-12 rounded-r-xl rounded-l-xl ml-20 text-2xl dark:bg-[#66A3FF] dark:text-slate-800`}
          onClick={() => navigate("dashboard")}
        >
          <span className="pacifico text-xl mr-1">Dash Board</span>
          <FundOutlined className="text-2xl" />
        </Button>
        <Button
          variant="solid"
          color="primary"
          className={` h-12 rounded-r-xl rounded-l-xl ml-20 text-2xl dark:bg-[#66A3FF] dark:text-slate-800`}
          onClick={handleOpenCalendar}
          disabled={addFormToggleState.state}
        >
          <span className="pacifico text-xl mr-1">Calendar</span>
          <CalendarTwoTone className="" twoToneColor={["#fffff", "#1677ff"]} />
        </Button>
        <Button
          disabled={addFormToggleState.state}
          onClick={() => {
            navigate("/chatapp");
          }}
          variant="solid"
          color="primary"
          className={` h-12 rounded-r-xl rounded-l-xl ml-20 text-2xl dark:bg-[#66A3FF] dark:text-slate-800 `}
        >
          <span className="pacifico text-xl mr-1">Chat App</span>
          <WechatOutlined className="text-3xl" />
        </Button>
        <Button
          disabled={addFormToggleState.state}
          onClick={() => {
            navigate("/playground/caro");
          }}
          variant="solid"
          color="primary"
          className={` h-12 rounded-r-xl rounded-l-xl ml-20 text-2xl dark:bg-[#66A3FF] dark:text-slate-800`}
        >
          <span className="pacifico text-xl mr-2">Play Ground</span>
          <GrGamepad className="text-3xl" />
        </Button>
        <Button
          onClick={() => {
            navigate("/homework");
          }}
          variant="solid"
          color="primary"
          className={` h-12 rounded-r-xl rounded-l-xl ml-20 text-2xl dark:bg-[#66A3FF] dark:text-slate-800`}
        >
          <span className="pacifico text-xl mr-2">Home work</span>
          <GrGamepad className="text-3xl" />
        </Button>
      </div>
    </div>
  );
};

export default Header;
