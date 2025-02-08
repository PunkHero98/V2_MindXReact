import { useState, useEffect } from "react";
import { Table, Space, Tag, Input, Button } from "antd";
import { getUser } from "../../../services/apiHandle";
import { debounce, uniqBy } from "lodash";
import { Typography } from "antd";
import dayjs from "dayjs";
const {Paragraph} = Typography;
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
      status: [
        item.isActive ? "Actived" : "Deactived",
        item.password === "Pa55w0rd@" ? "defaut Password" : null
      ].filter(Boolean),
      createddate: item.createAt ? dayjs(item.createAt).format("MMM-DD-YYYY HH:mm:ss") : "N/A",
      createdtimestamp: item.createAt ? dayjs(item.createAt).valueOf() : 0,
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
  }, 300);

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
      render: (text) =>(
        <Space >
          <Paragraph copyable  >{text}</Paragraph>
        </Space>
      )
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
      render: (_, { status }) => (
        <>
          {(status || []).map((tag) => {
            let color = tag === 'Actived' ? 'geekblue' : 'volcano';
            if (tag === "defaut Password") color = "orange";
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, { status }) => {
        const hasDefaultPassword = status.includes("defaut Password");
        const isActive = status.includes("Actived");
    
        return (
          <Space direction="horizontal" align="center">
            {/* Nút Reset Password (Disable nếu có 'defaut Password') */}
            <Button size="small" disabled={hasDefaultPassword} color="purple" variant="outlined">
              Reset Password
            </Button>
    
            {/* Nút Deactivated / Activated (Tùy theo trạng thái) */}
            {isActive ? (
              <Button size="small" color="danger" variant="outlined">
                Deactivated
              </Button>
            ) : (
              <Button size="small" color="blue" variant="outlined">
                Actived
              </Button>
            )}
          </Space>
        );
      },
    },    
    {
      title: "Created Date",
      key: "createddate",
      dataIndex: "createddate",
      render: (text) => <span>{text}</span>, // Hiển thị "N/A" nếu không có ngày tạo
      sorter: (a, b) => a.createdtimestamp - b.createdtimestamp,
    },
    
  ];
  // const filteredData = data.filter((user) =>
  //   user.username.toLowerCase().includes(searchText)
  // );

  return (
    <div className="px-8">
      {/* 🔹 Ô tìm kiếm username */}
      <div className="flex justify-between items-center">
        <Input
          placeholder="Search username..."
          onChange={handleSearch}
          style={{  width: 250 }}
        />
        {/* <Typography.Title className="roboto-slab-base" level={4}>
          Number Of User: {filteredData.length}
        </Typography.Title> */}
      </div>

      {/* 🔹 Hiển thị bảng dữ liệu */}
      <Table
      
        columns={columns}
        dataSource={data.filter((user) =>
          user.username.toLowerCase().includes(searchText)
        )}
        className="roboto-slab-base"
        scroll={{ x: "max-content"  }} // 🔹 Hỗ trợ kéo ngang nếu nhiều cột
        pagination = {{pageSize: 8 , showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} users`,}}
      />
    </div>
  );
};

export default ManageUser;
