import { useState, useEffect } from "react";
import { Table, Space, Tag, Input, Button } from "antd";
import { getUser, updateUser } from "../../../services/apiHandle";
import { debounce, uniqBy } from "lodash";
import { Typography, Modal, notification, Select, Popconfirm } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { CloseCircleOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
const { Paragraph } = Typography;
const ManageUser = () => {
  const user = useSelector((state) => state.user.user);

  const [data, setData] = useState([]);
  const [usernameFilters, setUsernameFilters] = useState([]); // Lưu filters động

  const [openModal, setOpenModal] = useState(false);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [openModalChangeRole, setOpenModalChangeRole] = useState(false);

  const [tableLoading, setTableLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingForChangeRole, setLoadingForChangeRole] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState(null);
  const [loadingForAction, setLoadingForAction] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [userName, setUserName] = useState(null);
  const [id, setId] = useState(null);
  const [idForChangeRole, setIdForChangeRole] = useState(null);
  const [roleForChange, setRoleForChange] = useState(null);
  const [password, setPassword] = useState(null);
  const [valueForSelect, setValueForSelect] = useState("Member");

  const fetchGetUser = async () => {
    try {
      const result = await getUser();
      if (result.success === false) {
        notification.error({
          message: "Error when fetching",
          description: result.message,
          placement: "topRight",
          duration: 1.5,
        });
        setTableLoading(false);
        return;
      }
      return result.data;
    } catch (err) {
      notification.error({
        message: err.message,
        description: "Please try it again later !",
        placement: "topRight",
        duration: 1.5,
      });
      setTableLoading(false);
    }
  };
  const fetchData = async () => {
    try {
      setTableLoading(true);
      const result = await fetchGetUser();
      setTableLoading(false);
      transformData(result);
    } catch (err) {
      notification.error({
        message: err.message,
        description: "Please try it again later !",
        placement: "topRight",
        duration: 1.5,
      });
    }
  };
  useEffect(() => {
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
        item.password === "Pa55w0rd@" ? "defaut Password" : null,
      ].filter(Boolean),
      createddate: item.createAt
        ? dayjs(item.createAt).format("MMM-DD-YYYY HH:mm:ss")
        : "N/A",
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

  const handleAction = (id, username, actionType) => {
    const status = localStorage.getItem("AdminUnlocked");
    if (status === "true") {
      setUserName(username);
      setId(id);
      setActionType(actionType);
      setOpenConfirmModal(true);
    } else {
      setOpenModal(true);
    }
  };

  const resetPasswordFetch = async (id) => {
    try {
      const user = await fetchGetUser();
      const filteredUser = user.find((item) => item._id === id);
      const newUser = { ...filteredUser, password: "Pa55w0rd@" };
      const result = await updateUser(id, newUser);
      if (result.success === false) {
        notification.error({
          message: "Error when fetching",
          description: result.message,
          placement: "topRight",
          duration: 1.5,
        });
        setLoadingForAction(false);
        return;
      }
      setLoadingForAction(false);

      notification.success({
        message: "Reset password successfully",
        placement: "topRight",
        duration: 1.5,
      });

      setUserName(null);
      setId(null);
      setActionType(null);
      setOpenConfirmModal(false);
      fetchData();
    } catch (err) {
      notification.error({
        message: err.message,
        description: "Please try it again later !",
        placement: "topRight",
        duration: 1.5,
      });
      setLoadingForAction(false);
    }
  };
  const toggleActivateUserFetch = async (id, actionType) => {
    try {
      const user = await fetchGetUser();
      const filteredUser = user.find((item) => item._id === id);
      const newUser = {
        ...filteredUser,
        isActive: actionType === "activate" ? true : false,
      };
      const result = await updateUser(id, newUser);
      if (result.success === false) {
        notification.error({
          message: "Error when fetching",
          description: result.message,
          placement: "topRight",
          duration: 1.5,
        });
        setLoadingForAction(false);

        return;
      }
      setLoadingForAction(false);

      notification.success({
        message: "Deactivated user successfully",
        placement: "topRight",
        duration: 1.5,
      });
      setUserName(null);
      setId(null);
      setActionType(null);
      setOpenConfirmModal(false);
      fetchData();
    } catch (err) {
      notification.error({
        message: err.message,
        description: "Please try it again later !",
        placement: "topRight",
        duration: 1.5,
      });
      setLoadingForAction(false);
    }
  };
  const handleFetchChangeRole = async () => {
    try {
      if (valueForSelect === roleForChange) {
        notification.error({
          message: "Cannot change to the same role !",
          placement: "topLeft",
          duration: 1.5,
        });
        return;
      }
      setLoadingForChangeRole(true);
      const user = await fetchGetUser();
      const filteredUser = user.find((item) => item._id === idForChangeRole);
      const newUser = { ...filteredUser, role: valueForSelect };
      const result = await updateUser(idForChangeRole, newUser);
      if (result.success === false) {
        notification.error({
          message: "Error when fetching",
          description: result.message,
          placement: "topRight",
          duration: 1.5,
        });
        setLoadingForChangeRole(false);
        return;
      }
      setLoadingForChangeRole(false);

      notification.success({
        message: "Change role successfully",
        placement: "topRight",
        duration: 1.5,
      });
      setLoadingForChangeRole(false);
      setOpenModalChangeRole(false);
      fetchData();
    } catch (err) {
      notification.error({
        message: err.message,
        description: "Please try it again later !",
        placement: "topRight",
        duration: 1.5,
      });
      setLoadingForChangeRole(false);
    }
  };

  const handleAccountAction = async () => {
    setLoadingForAction(true);
    if (actionType === "reset") {
      resetPasswordFetch(id);
    } else {
      toggleActivateUserFetch(id, actionType);
    }
  };
  const fetchCheckAdmin = async () => {
    try {
      if (password === null || password == "") {
        notification.error({
          message: "Cannot leave password field blank !",
          placement: "topLeft",
          duration: 1.5,
        });
        return;
      }
      setLoading(true);
      const result = await fetchGetUser();
      const filteredUser = result.find(
        (item) => item.username === user.username
      );
      if (filteredUser.password !== password) {
        notification.error({
          message: "Your password is incorrect !",
          placement: "topLeft",
          duration: 1.5,
        });
        setPasswordStatus(false);
        setLoading(false);
        return;
      }
      localStorage.setItem("AdminUnlocked", "true");
      setTimeout(() => {
        localStorage.removeItem("AdminUnlocked");
      }, 300000);
      setPassword("");
      setPasswordStatus(null);
      setLoading(false);
      setOpenModal(false);
    } catch (err) {
      notification.error({
        message: err.message,
        description: "Please try it again later !",
        placement: "topRight",
        duration: 1.5,
      });
      setLoading(false);
    }
  };
  const handleSubmitBtn = () => {
    fetchCheckAdmin();
  };
  const handleSubmit = (e) => {
    if (e.key === "Enter") {
      fetchCheckAdmin();
    }
  };
  const handleChangeRole = (id, role) => {
    const status = localStorage.getItem("AdminUnlocked");
    if (status === "true") {
      if (user.user_id === id) {
        notification.error({
          message: "Cannot change role of your account !",
          placement: "topLeft",
          duration: 1.5,
        });
        return;
      }
      setRoleForChange(role);
      setIdForChangeRole(id);
      setOpenModalChangeRole(true);
    } else {
      setOpenModal(true);
    }
  };
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
      render: (text) => (
        <Space>
          <Paragraph copyable>{text}</Paragraph>
        </Space>
      ),
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
      render: (_, record) => (
        <Tag
          className="cursor-pointer"
          onClick={() => handleChangeRole(record.id, record.role)}
          color={record.role === "Admin" ? "red" : "green"}
        >
          {record.role}
        </Tag>
      ),
    },
    {
      title: "Status",
      key: "status",
      dataIndex: "status",
      render: (_, { status }) => (
        <>
          {(status || []).map((tag) => {
            let color = tag === "Actived" ? "geekblue" : "volcano";
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
      render: (_, record) => {
        const hasDefaultPassword = record.status.includes("defaut Password");
        const isActive = record.status.includes("Actived");

        return (
          <Space direction="horizontal" align="center">
            {/* Nút Reset Password (Disable nếu có 'defaut Password') */}
            <Button
              size="small"
              disabled={hasDefaultPassword}
              color="purple"
              variant="outlined"
              onClick={() => handleAction(record.id, record.username, "reset")}
            >
              Reset Password
            </Button>

            {/* Nút Deactivated / Activated (Tùy theo trạng thái) */}
            {isActive ? (
              <Button
                size="small"
                color="danger"
                variant="outlined"
                onClick={() =>
                  handleAction(record.id, record.username, "deactivate")
                }
              >
                Deactivated
              </Button>
            ) : (
              <Button
                size="small"
                color="blue"
                variant="outlined"
                onClick={() =>
                  handleAction(record.id, record.username, "activate")
                }
              >
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
    <>
      <div className="px-8">
        {/* 🔹 Ô tìm kiếm username */}
        <div className="flex justify-between items-center">
          <Input
            placeholder="Search username..."
            onChange={handleSearch}
            style={{ width: 250 }}
          />
          {/* <Typography.Title className="roboto-slab-base" level={4}>
            Number Of User: {filteredData.length}
          </Typography.Title> */}
        </div>

        {/* 🔹 Hiển thị bảng dữ liệu */}
        <Table
          className="  roboto-slab-base"
          columns={columns}
          dataSource={
            tableLoading
              ? []
              : data.filter((user) =>
                  user.username.toLowerCase().includes(searchText)
                )
          }
          scroll={{ x: "max-content" }} // 🔹 Hỗ trợ kéo ngang nếu nhiều cột
          pagination={{
            pageSize: 8,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} users`,
          }}
          loading={tableLoading}
        />
      </div>
      <Modal
        open={openModal}
        onCancel={() => setOpenModal(false)}
        title="Enter admin password to proceed"
        okText="Submit"
        okType="primary"
        cancelButtonProps={{
          style: {
            color: "red",
            borderColor: "red",
            fontFamily: "Pacifico",
            fontWeight: "400",
            fontStyle: "normal",
            fontSize: "20px",
            padding: "20px",
          },
        }}
        okButtonProps={{
          style: {
            fontFamily: "Pacifico",
            fontWeight: "400",
            fontStyle: "normal",
            fontSize: "20px",
            padding: "20px",
          },
        }}
        onOk={handleSubmitBtn}
        loading={loading}
      >
        <div className="py-6 px-8">
          <div className="flex flex-col gap-4 " onKeyUp={handleSubmit}>
            <div>
              <Input
                type="password"
                placeholder="Password"
                size="large"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                suffix={
                  !loading && passwordStatus !== null ? ( // 🔹 Chỉ hiển thị khi `loading` đã xong & đã nhập mật khẩu
                    passwordStatus ? (
                      <CheckCircleOutlined style={{ color: "green" }} />
                    ) : (
                      <CloseCircleOutlined style={{ color: "red" }} />
                    )
                  ) : null
                }
              />
              {/* <div className="mt-1 ml-1">
                <span>wrong password</span>
              </div> */}
            </div>
          </div>
        </div>
      </Modal>
      <Modal
        open={openConfirmModal}
        onCancel={() => setOpenConfirmModal(false)}
        onOk={handleAccountAction}
        okText={loadingForAction ? <LoadingOutlined /> : "Confirm"}
      >
        <div className="py-6 px-8">
          <div className="flex flex-col gap-4">
            <h1 className="text-2xl">{`Are you sure to proceed to ${actionType} ${userName} ${
              actionType === "reset" ? "password" : "account"
            } ?`}</h1>
          </div>
        </div>
      </Modal>
      <Modal
        open={openModalChangeRole}
        onCancel={() => setOpenModalChangeRole(false)}
        footer={null}
      >
        <Select
          value={valueForSelect}
          onChange={(value) => setValueForSelect(value)}
          size="large"
          style={{ width: "30%" }}
          options={[
            { value: "Admin", label: <span>Admin</span> },
            { value: "Member", label: <span>Member</span> },
          ]}
        />
        <div className="mt-4 flex justify-end gap-4">
          <Button
            color="volcano"
            variant="outlined"
            onClick={() => setOpenModalChangeRole(false)}
            disabled={loadingForChangeRole}
          >
            Cancel
          </Button>
          <Popconfirm
            title="Are you sure you want to change the role?"
            placement="bottomRight"
            onConfirm={() => handleFetchChangeRole()} // Gọi hàm xử lý
            onCancel={() => console.log("User cancelled")}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="primary"
              // loading={loadingForChangeRole}
              disabled={loadingForChangeRole}
            >
              Confirm
            </Button>
          </Popconfirm>
        </div>
      </Modal>
    </>
  );
};

export default ManageUser;
