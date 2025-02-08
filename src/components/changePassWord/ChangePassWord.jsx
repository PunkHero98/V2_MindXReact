import { useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { Input, Button, message, notification } from "antd";
import { Loading3QuartersOutlined } from "@ant-design/icons";
import { updateUser } from "../../services/apiHandle";
import propTypes from "prop-types";
const ChangePassWord = ({ userData }) => {
  const { id } = useParams();

  const [messageApi, contextHolder] = message.useMessage();

  const [changePassShow, setChangePassShow] = useState(false);

  const [oldPassword, setOldPassword] = useState(null);
  const [newPassword, setNewPassword] = useState(null);
  const [confirmNewPassword, setConfirmNewPassword] = useState(null);

  const [statusForOldPass, setStatusForOldPass] = useState(true);
  const [statusForNewPass, setStatusForNewPass] = useState(true);
  const [statusForConfirmNewPass, setStatusForConfirmNewPass] = useState(true);

  const [isLoading, setIsLoading] = useState(false);

  const inputRef = useRef(null);

  const [statusState, setStatusState] = useState([
    { name: "oldPassword", status: [{ notBlank: null }, { correct: null }] },
    {
      name: "newPassword",
      status: [{ notBlank: null }, { isValidate: null }],
    },
    {
      name: "confirmNewPassword",
      status: [{ notBlank: null }, { match: null }],
    },
  ]);

  const passWordRegex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
  const notiStatus = [
    { name: "oldPassword", itsChildren: [setStatusForOldPass] },
    { name: "newPassword", itsChildren: [setStatusForNewPass] },
    { name: "confirmNewPassword", itsChildren: [setStatusForConfirmNewPass] },
  ];

  const updateStatusState = (fieldName, statusKey, value) => {
    setStatusState((prevState) =>
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

  const handleBlurChangePass = () => {
    if (oldPassword === "") {
      setStatusForOldPass(false);
      updateStatusState("oldPassword", "notBlank", false);
      messageApi.open({
        type: "error",
        content: "Old password can not be empty",
      });
      return;
    }
    if (!(oldPassword === userData["password"])) {
      setStatusForOldPass(false);
      updateStatusState("oldPassword", "correct", false);
      messageApi.open({
        type: "error",
        content: "Your old password is incorrect",
      });

      return;
    }
    setStatusForOldPass(true);
    updateStatusState("oldPassword", "correct", true);
    updateStatusState("oldPassword", "notBlank", true);
  };
  const handleChangeNewPassword = () => {
    if (newPassword === "") {
      setStatusForNewPass(false);
      updateStatusState("newPassword", "notBlank", false);
      return;
    }
    if (!passWordRegex.test(newPassword)) {
      setStatusForNewPass(false);
      updateStatusState("newPassword", "isValidate", false);
      return;
    }
    setStatusForNewPass(true);
    updateStatusState("newPassword", "isValidate", true);
    updateStatusState("newPassword", "notBlank", true);
  };
  const handleBlurNewPassword = () => {
    if (newPassword === "") {
      setStatusForNewPass(false);
      updateStatusState("newPassword", "notBlank", false);
      messageApi.open({
        type: "error",
        content: "New password can not be empty",
      });
      return;
    }
    if (!passWordRegex.test(newPassword)) {
      setStatusForNewPass(false);
      updateStatusState("newPassword", "isValidate", false);
      messageApi.open({
        type: "error",
        content: "Your new password is not right format",
      });
      return;
    }
    setStatusForNewPass(true);
    updateStatusState("newPassword", "isValidate", true);
    updateStatusState("newPassword", "notBlank", true);
  };
  const handleChangeConfirmNewPassword = () => {
    if (confirmNewPassword === "") {
      setStatusForConfirmNewPass(false);
      updateStatusState("confirmNewPassword", "notBlank", false);
      return;
    }
    if (confirmNewPassword !== newPassword) {
      setStatusForConfirmNewPass(false);
      updateStatusState("confirmNewPassword", "match", false);
      return;
    }
    setStatusForConfirmNewPass(true);
    updateStatusState("confirmNewPassword", "match", true);
    updateStatusState("confirmNewPassword", "notBlank", true);
  };
  const handleBlurConfirmNewPassword = () => {
    if (confirmNewPassword === "") {
      setStatusForConfirmNewPass(false);
      updateStatusState("confirmNewPassword", "notBlank", false);
      messageApi.open({
        type: "error",
        content: "Confirm new password can not be empty",
      });
      return;
    }
    if (confirmNewPassword !== newPassword) {
      setStatusForConfirmNewPass(false);
      updateStatusState("confirmNewPassword", "match", false);
      messageApi.open({
        type: "error",
        content: "Your password does not match",
      });
      return;
    }
    setStatusForConfirmNewPass(true);
    updateStatusState("confirmNewPassword", "match", true);
    updateStatusState("confirmNewPassword", "notBlank", true);
  };
  const fetchChangePassword = async () => {
    try {
      const newData = { ...userData, password: newPassword };

      const result = await updateUser(id, newData);
      if (result.success === false) {
        notification.error({
          message: "Error when change password",
          description: result.message,
          placement: "topLeft",
          duration: 1.5,
        });
        setIsLoading(false);

        return;
      }
      notification.success({
        message: "Change password successfully",
        placement: "topLeft",
        duration: 1.5,
      });
      setIsLoading(false);

      setChangePassShow(false);
      setOldPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      resetStatus();
      setChangePassShow(false);
    } catch (error) {
      notification.error({
        message: error.message,
        placement: "topRight",
        duration: 1.5,
      });
    }
  };
  const handleSave = () => {
    let hasFalseValue = false;
    setIsLoading(true);
    statusState.forEach((statusItem) => {
      const notiItem = notiStatus.find((noti) => noti.name === statusItem.name);
      if (!notiItem) return;

      const failedFields = [];

      statusItem.status.forEach((statusObj) => {
        const key = Object.keys(statusObj)[0];
        const value = Object.values(statusObj)[0];

        if (value === null || value === false) {
          hasFalseValue = true;
          failedFields.push(key);
        }
      });
      notiItem.itsChildren.forEach((setStateFunc) =>
        setStateFunc(failedFields.length === 0)
      );

      if (failedFields.length > 0) {
        setIsLoading(false);

        notification.error({
          message: `Error in ${statusItem.name}`,
          description: `Fields failed: ${failedFields.join(", ")}`,
          placement: "topLeft",
          duration: 3,
        });
      }
    });

    if (hasFalseValue) {
      setIsLoading(false);

      return;
    }

    fetchChangePassword();
  };

  const handleChangePassword = () => {
    if (!changePassShow) {
      setChangePassShow(true);
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 0);
      return;
    }
    handleSave();
  };
  const handleEnter = (e) => {
    if (e.key === "Enter") {
      handleSave();
    }
  };

  const resetStatus = () => {
    setStatusState((prevState) =>
      prevState.map((item) => ({
        ...item,
        status: item.status.map((statusObj) =>
          Object.keys(statusObj).reduce((acc, key) => {
            acc[key] = null;
            return acc;
          }, {})
        ),
      }))
    );
  };
  return (
    <>
      {contextHolder}
      <form
        className={`flex flex-col ${
          changePassShow ? "justify-between" : "justify-center"
        } items-center`}
        onKeyUp={handleEnter}
      >
        <div
          className={`${
            changePassShow ? "" : "hidden"
          } flex flex-col gap-4 w-full`}
        >
          <Input.Password
            ref={inputRef}
            size="large"
            placeholder="Enter your old password"
            onChange={(e) => setOldPassword(e.target.value)}
            value={oldPassword}
            status={statusForOldPass ? "" : "error"}
            onBlur={handleBlurChangePass}
            autoComplete="current-password"
            disabled={isLoading}
          />
          <Input.Password
            size="large"
            placeholder="Enter your new password"
            value={newPassword}
            status={statusForNewPass ? "" : "error"}
            onChange={(e) => setNewPassword(e.target.value)}
            onKeyUp={handleChangeNewPassword}
            onBlur={handleBlurNewPassword}
            autoComplete="new-password"
            disabled={isLoading}
          />
          <Input
            size="large"
            placeholder="Confirm your new password"
            type="password"
            status={statusForConfirmNewPass ? "" : "error"}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            value={confirmNewPassword}
            onKeyUp={handleChangeConfirmNewPassword}
            onBlur={handleBlurConfirmNewPassword}
            autoComplete="new-password"
            disabled={isLoading}
          />
        </div>
        <div
          className={`flex ${
            changePassShow ? "justify-between" : "justify-center"
          } gap-12 items-center`}
        >
          <Button
            variant="outlined"
            color="danger"
            onClick={() => {
              setChangePassShow(false);
              setOldPassword("");
              setNewPassword("");
              setConfirmNewPassword("");
              resetStatus();
            }}
            className={`${
              changePassShow ? "" : "hidden"
            } pacifico px-4 py-6 mb-2 text-xl`}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="solid"
            color="blue"
            className="pacifico px-4 py-6 mb-2 text-xl transition-all duration-50 ease-out "
            onClick={handleChangePassword}
            disabled={isLoading}
          >
            {!isLoading ? "Change Password" : <Loading3QuartersOutlined spin />}
          </Button>
        </div>
      </form>
    </>
  );
};

export default ChangePassWord;

ChangePassWord.propTypes = {
  userData: propTypes.object.isRequired,
};
