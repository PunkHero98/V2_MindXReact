import { useState, useEffect } from "react";
import { Table, Space, Tag, Input } from "antd";
import { getUser } from "../../../services/apiHandle";
import { debounce, uniqBy } from "lodash";
import { Typography } from "antd";

const ManageUser = () => {
  const [data, setData] = useState([]);
  const [usernameFilters, setUsernameFilters] = useState([]); // Lưu filters động

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getUser();
        if (result.success === false) {
          return;
        }
        transformData(result.data);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchData();
  }, []);

  const transformData = (data) => {
    const newData = data.map((item, index) => ({
      key: index + 1,
      username: item.username,
      email: item.email,
      id: item._id,
      department: [item.department],
      role: item.role,
      status: item.status,
    }));

    setData(newData);

    // 🔹 Tạo danh sách filter động dựa trên dữ liệu fetch
    const uniqueUsernames = uniqBy(newData, "username").map((user) => ({
      text: user.username,
      value: user.username,
    }));
    setUsernameFilters(uniqueUsernames);
  };

  // 🔹 Tìm kiếm `username`
  const [searchText, setSearchText] = useState("");
  const handleSearch = debounce((e) => {
    setSearchText(e.target.value.toLowerCase());
  }, 300); // Giảm tải tìm kiếm bằng debounce

  const columns = [
    {
      title: "UserName",
      dataIndex: "username",
      key: "username",
      sorter: (a, b) => a.username.localeCompare(b.username),
      filters: usernameFilters, // 🔹 Filter động từ API
      onFilter: (value, record) => record.username.includes(value),
      filterSearch: true,
      render: (text) => (
        <div className="username-cell" title={text}>
          {text}
        </div>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Department",
      key: "department",
      dataIndex: "department",
      render: (_, { department }) => (
        <>
          {department.map((tag) => {
            let color = tag === "IT" ? "geekblue" : "green";
            if (tag === "HR") color = "volcano";
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
      filters: [
        { text: "IT", value: "IT" },
        { text: "HR", value: "HR" },
        { text: "Operation", value: "Operation" },
      ],
      filterMode: "tree",
      filterSearch: true,
      onFilter: (value, record) => record.department.includes(value),
    },
    {
      title: "Role",
      key: "role",
      dataIndex: "role",
      render: (role) => (
        <Tag color={role === "Admin" ? "red" : "green"}>{role}</Tag>
      ),
    },
    {
      title: "Status",
      key: "status",
      dataIndex: "status",
    },
    {
      title: "Action",
      key: "action",
      render: () => (
        <Space size="middle">
          <a>Reset Password</a>
          <a>Deactivated</a>
        </Space>
      ),
    },
  ];
  const filteredData = data.filter((user) =>
    user.username.toLowerCase().includes(searchText)
  );

  return (
    <div className="px-8">
      {/* 🔹 Ô tìm kiếm username */}
      <div className="flex justify-between items-center">
        <Input
          placeholder="Search username..."
          onChange={handleSearch}
          style={{ marginBottom: 10, width: 250 }}
        />
        <Typography.Title className="roboto-slab-base" level={4}>
          Number Of User: {filteredData.length}
        </Typography.Title>
      </div>

      {/* 🔹 Hiển thị bảng dữ liệu */}
      <Table
        columns={columns}
        dataSource={data.filter((user) =>
          user.username.toLowerCase().includes(searchText)
        )}
        scroll={{ x: "max-content" }} // 🔹 Hỗ trợ kéo ngang nếu nhiều cột
      />
    </div>
  );
};

export default ManageUser;
