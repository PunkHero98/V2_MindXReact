import { useDispatch } from "react-redux";
import { login } from "../../features/auth/Login";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { getUser, updateUser } from "../../services/apiHandle";
import { Button, Input, notification, Checkbox, Divider } from "antd";
import { nanoid } from "nanoid";
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  Loading3QuartersOutlined,
  FacebookFilled,
  GoogleOutlined,
} from "@ant-design/icons";
import { useEffect } from "react";
export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [usernameValue, setUsernameValue] = useState("");
  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");

  // const [tartgetChecked , setTargetChecked] =useState(false);

  const [userNameNotification, setUserNameNotification] = useState("---");
  const [emailNotification, setEmailNotification] = useState("---");
  const [passwordNotification, setPasswordNotification] = useState("---");

  const [isLoading, setIsLoading] = useState(false);

  const userNoti = userNameNotification === "---";
  const emailNoti = emailNotification === "---";
  const passwordNoti = passwordNotification === "---";

  const saveToReduxAndRedirect = (user) => {
    const userData = user;
    dispatch(login(userData));
    navigate("/");
  };

  useEffect(()=>{
    document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
  },[])
  const onChange = (e) => {
    console.log(`checked = ${e.target.checked}`);
    // setTargetChecked(e.target.checked);
  };

  const handleUpdateUserAfterLogin = async (id , user) => {
    try {
      const sessionID = nanoid(30);
      const expiryTime = Date.now() + 24 * 60 * 60 * 1000;
      user.sessionID = sessionID;
      const result = await updateUser(id , user);
      if (result.success === false) {
        notification.error({
          message: "Error when fetching",
          description: result.message,
          placement: "topRight",
          duration: 1.5,
        });
        setIsLoading(false);
        return;
      }
      localStorage.setItem("sessionID", sessionID);
      localStorage.setItem("sessionExpiry", expiryTime);

      setTimeout(() => {
        navigate("/");
      }, 1000);
      const userss = {
        user_id: user["_id"],
        username: user.username,
        department: user.department,
        img_url: user.img_url || null,
        role: user.role,
      };
      saveToReduxAndRedirect(userss);
      // if(tartgetChecked){
      //   localStorage.setItem("currentUser", JSON.stringify(userss));
      // }
      // const selectUser = await handleDepartment(user.department);
      // localStorage.setItem("selectUser", JSON.stringify(selectUser));
      setIsLoading(false);
      notification.success({
        message: "Login Successful",
        description: "You have logged in successfully!",
        placement: "topRight",
        duration: 1.5,
      });
    } 
    catch (err) 
    {
      notification.error({
        message: err.message,
        description: "Please try it again later !",
        placement: "topRight",
        duration: 1.5,
      });
    }
  };

  const checkLogin = async () => {
    try {
      setIsLoading(true);
      const result = await getUser();
      if (result.success === false) {
        notification.error({
          message: "Error when fetching",
          description: result.message,
          placement: "topRight",
          duration: 1.5,
        });
        setIsLoading(false);
        return;
      }
      const user = result.data.find((item) => item.username === usernameValue);

      const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

      if (usernameValue === "") {
        setUserNameNotification("Cannot leave this field blank !");
      } else {
        setUserNameNotification("---");
      }

      if (emailValue === "") {
        setEmailNotification("Cannot leave this field blank !");
      } else if (!regex.test(emailValue)) {
        setEmailNotification("Invalid Email Format !");
      } else {
        setEmailNotification("---");
      }

      if (passwordValue === "") {
        setPasswordNotification("Cannot leave this field blank !");
      } else {
        setPasswordNotification("---");
      }

      if (user) {
        if (user.password === passwordValue && emailValue === user.email) {
          if (user.isActive === false) {
            notification.error({
              message: "Account is not active",
              description: "Please contact admin for more information",
              placement: "topRight",
              duration: 1.5,
            });
            setIsLoading(false);
            return;
          } else {
            handleUpdateUserAfterLogin(user["_id"], user);
            return;
          }
        } else {
          if (user.password !== passwordValue) {
            setPasswordNotification("Incorrect password !");
            setIsLoading(false);
          }
          if (emailValue !== user.email) {
            setEmailNotification("Email does not match with username !");
            setIsLoading(false);
          }
        }
      } else {
        setUserNameNotification("Username not found !");
        setIsLoading(false);
      }
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

  const className = "h-10 text-base mt-2 merriweather";

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      checkLogin();
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-sky-100 ">
      <div className="main py-6 bg-white h-4/5 w-1/3  rounded-xl shadow-xl shadow-slate-400  flex flex-col items-center justify-between">
        <div className="head mb-4 flex flex-col text-center gap-6 ">
          <h1 className="text-4xl mt-10 pacifico text-[#1677ff]">
            Work Management System
          </h1>
        </div>
        <form
          action=""
          onKeyDown={handleKeyDown}
          className="w-full flex flex-col items-center mt-4 "
        >
          <div className="w-full px-10">
            <label
              htmlFor="usernameInput"
              className="text-base merriweather-bolder "
            >
              Username
            </label>
            <Input
              autoComplete="username"
              status={userNoti ? "" : "error"}
              id="usernameInput"
              value={usernameValue}
              onChange={(e) => setUsernameValue(e.target.value)}
              className={className}
              disabled={isLoading}
            />
            <div
              className={`${
                userNoti ? "opacity-0" : "text-[#f5222d]"
              } merriweather-bolder notification mb-4 mt-1 text-sm`}
            >
              <span>{userNameNotification}</span>
            </div>
          </div>
          <div className="w-full px-10">
            <label
              htmlFor="emailInput"
              className="text-base merriweather-bolder "
            >
              Email
            </label>
            <Input
              status={emailNoti ? "" : "error"}
              id="emailInput"
              value={emailValue}
              onChange={(e) => setEmailValue(e.target.value)}
              className={className}
              disabled={isLoading}
            />
            <div
              className={`${
                emailNoti ? "opacity-0" : "text-[#f5222d]"
              } merriweather-bolder notification mb-4 mt-1 text-sm`}
            >
              <span>{emailNotification}</span>
            </div>
          </div>
          <div className="w-full px-10">
            <label
              htmlFor="passwordInput"
              className="text-base merriweather-bolder "
            >
              Password
            </label>
            <Input.Password
              status={passwordNoti ? "" : "error"}
              id="passwordInput"
              value={passwordValue}
              autoComplete="current-password"
              onChange={(e) => setPasswordValue(e.target.value)}
              className={className}
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
              disabled={isLoading}
            />
            <div
              className={`${
                passwordNoti ? "opacity-0" : "text-[#f5222d]"
              } merriweather-bolder notification mb-2 mt-1 text-sm`}
            >
              <span>{passwordNotification}</span>
            </div>
          </div>
          <div className=" px-10 w-full merriweather-bold flex justify-between items-center">
            <Checkbox onChange={onChange}>Remember me !</Checkbox>
            <span
              onClick={() => navigate("/forgot_password")}
              className="text-sm underline text-blue-500 cursor-pointer active:text-blue-800"
            >
              Forgot password
            </span>
          </div>
        </form>
        <div className=" btn_container flex justify-between w-full px-10 mt-7">
          <Button
            className="w-[43%] pacifico h-14 text-2xl"
            variant="outlined"
            color="primary"
            onClick={() => {
              navigate("/register");
            }}
            disabled={isLoading}
          >
            Register
          </Button>
          <Button
            className="w-[43%] h-14 pacifico text-2xl"
            variant="solid"
            color="primary"
            onClick={checkLogin}
            disabled={isLoading}
          >
            {!isLoading ? "Login" : <Loading3QuartersOutlined spin />}
          </Button>
        </div>
        <div className="w-full px-10">
          <Divider style={{ borderColor: "#1677ff" }}>
            <span className="text-blue-300">Or</span>
          </Divider>
        </div>
        <div className="w-full px-20 flex justify-around ">
          <Button
            className="merriweather h-12"
            variant="solid"
            color="lime"
            disabled={isLoading}
          >
            Login With <GoogleOutlined className="text-xl" />
          </Button>
          <Button
            className="merriweather h-12"
            variant="solid"
            color="geekblue"
            disabled={isLoading}
          >
            Login With <FacebookFilled className="text-xl" />
          </Button>
        </div>
      </div>
    </div>
  );
}
