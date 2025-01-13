// import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { logout } from "../../features/auth/Login";
import { openAddForm } from "../../features/toggleForm/toggleAddForm";
import { openCalendar } from "../../features/toggleForm/toggleCalendar";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setSearchQuerry } from "../../features/search/searchQuerry";
import { Button, Input, Space, Dropdown, Switch } from "antd";
import {
  UserOutlined,
  CalendarTwoTone,
  UserSwitchOutlined,
  SunOutlined,
  MoonOutlined,
  HomeFilled,
} from "@ant-design/icons";
const { Search } = Input;
const Header = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  //   const calendarState = useSelector((state) => state.toggleCalendar.calendarState)
  const addFormToggleState = useSelector(
    (state) => state.toggleAddForm.addFormStage
  );
  const navigate = useNavigate();
  const items = [
    {
      label: <Link to={"/account"}>Account</Link>,
      key: "0",
    },
    {
      label: <Link to={"/setting"}>Setting</Link>,
      key: "1",
    },
    {
      type: "divider",
    },
    {
      label: (
        <Link
          onClick={() => handleLogout()}
          target="_blank"
          rel="noopener noreferrer"
        >
          Logout
        </Link>
      ),
      key: "3",
    },
  ];
  const handleSearch = (e) => {
    // const querryValue = value;
    // setQuerry(e.target.value);
    dispatch(setSearchQuerry(e.target.value));
  };
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };
  const handleOpenAddForm = () => {
    dispatch(openAddForm({state: true}));
  };
  const handleOpenCalendar = () => {
    dispatch(openCalendar());
  };

  return (
    <div className="flex flex-col px-8">
      <div
        className={` upperContainer flex justify-between items-center  py-10`}
      >
        <h1 className="pacifico text-3xl text-[#1677ff] cursor-default">
          Work Management System
        </h1>
        <HomeFilled
          className="text-3xl text-[#1677ff] cursor-pointer"
          onClick={() => {
            navigate("/");
          }}
        />
        <Search
          placeholder="Search title or description"
          className="roboto-slab-base text-lg w-[500px]"
          enterButton
          size="large"
          //   onSearch={handleSearch}
          onChange={handleSearch}
        />
        <div className="flex items-center gap-4">
          <h4 className="mr-4 text-2xl pacifico">
            Welcome , {user ? user.username : "Guest"} !
          </h4>
          <Dropdown
            menu={{ items }}
            trigger={["click"]}
            overlayClassName="w-[200px] "
          >
            <a onClick={(e) => e.preventDefault()}>
              <Space className="border  bg-[#1677ff] text-white hover:bg-white hover:border-[#1677ff] hover:text-[#1677ff] p-2 rounded-md ">
                <UserOutlined className="text-2xl " />
              </Space>
            </a>
          </Dropdown>
        </div>
        <Switch
          className="px-2"
          checkedChildren={<SunOutlined />}
          unCheckedChildren={<MoonOutlined />}
          defaultChecked
        />
      </div>
      <div className="navbar mb-8 rounded-full flex items-center  h-12">
        <Button
          disabled={addFormToggleState.state}
          onClick={handleOpenAddForm}
          variant={"solid"}
          color="primary"
          className={` addNew pacifico rounded-l-3xl rounded-r-xl h-12 text-xl  `}
        >
          Add New
        </Button>
        <Button
          variant="solid"
          color="primary"
          className={` h-12 rounded-r-xl rounded-l-xl ml-20 text-2xl`}
          onClick={handleOpenCalendar}
          disabled={addFormToggleState.state}
        >
          <span className="pacifico text-xl mr-1">Calendar</span>
          <CalendarTwoTone className="" twoToneColor={["#fffff", "#1677ff"]} />
        </Button>
        <Button
          disabled={addFormToggleState.state}
          onClick={() => {
            navigate("/manageuser");
          }}
          variant="solid"
          color="primary"
          className={` h-12 rounded-r-xl rounded-l-xl ml-20 text-2xl`}
        >
          <span className="pacifico text-xl mr-1">Manage Users</span>
          <UserSwitchOutlined />
        </Button>
      </div>
    </div>
  );
};

export default Header;
