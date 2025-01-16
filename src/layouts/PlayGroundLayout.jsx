import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Menu } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { FaChess } from "react-icons/fa6";
import { GiTicTacToe } from "react-icons/gi";
import "./css/layout.css";
const PlayGroundLayout = () => {
  const [collapsed, setCollapsed] = useState(false); // Trạng thái thu nhỏ
  const [activeTab, setActiveTab] = useState("/playground/caro"); // Tab mặc định
  const navigate = useNavigate();

  const tabArray = [
    { key: "/playground/caro", label: "Caro", icon: <GiTicTacToe /> },
    { key: "/playground/chess", label: "Chess", icon: <FaChess /> },
  ];

  const handleTabClick = (e) => {
    const { key } = e;
    navigate(key); // Điều hướng
    setActiveTab(key); // Cập nhật trạng thái active
  };

  const handleCollapse = () => {
    setCollapsed(!collapsed); // Đảo trạng thái thu nhỏ
  };

  return (
    <div className="w-full h-[76vh] flex px-8 justify-between rounded-lg">
      {/* Slider Menu */}
      <div
        className={`slider transition-all duration-300 flex flex-col justify-between border border-[#1677ff] border-y-2 border-l-2 rounded-l-lg bg-[#000c17] ${
          collapsed ? "flex-[0.05]" : "flex-[0.10]"
        }`}
      >
        <Menu
          mode="inline"
          selectedKeys={[activeTab]}
          onClick={handleTabClick}
          inlineCollapsed={collapsed}
          items={tabArray}
          theme="dark"
        />
        <div
          className="resizeBtn scroll-container text-white text-xl rounded-lg flex items-center justify-center bg-[#1677ff] px-2 py-4 cursor-pointer"
          onClick={handleCollapse}
        >
          <ArrowLeftOutlined
            style={{
              transform: collapsed ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.3s ease",
            }}
          />
        </div>
      </div>

      {/* Main Content */}
      <div
        className="main border border-[#1677ff] border-y-2 border-r-2 rounded-r-lg transition-all duration-300 "
        style={{ flex: collapsed ? 0.95 : 0.9 }}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default PlayGroundLayout;
