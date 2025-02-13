import { Input, Button, notification } from "antd";
import { LeftOutlined, Loading3QuartersOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { getUser } from "../../services/apiHandle";
import axios from "axios";
const ForgotPassword = () => {
  const navigate = useNavigate();
  const [emailOrUsername, setEmailOrUsername] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
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
        setIsLoading(false);

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
      setIsLoading(false);

      return;
    }
  };
  const fetchBackend = async (
    endpoint,
    method = "GET",
    data = null,
    headers = {}
  ) => {
    try {
      console.log(data);
      const response = await axios({
        url: `http://localhost:3000/api/${endpoint}`,
        method,
        data,
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
      });
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching backend:",
        error.response?.data || error.message
      );
      throw error;
    }
  };
  const handleCheckEmailOrUser = async () => {
    setIsLoading(true);
    const user = await fetchGetUser();
    const filteredUser = user.find(
      (item) =>
        item.username === emailOrUsername || item.email === emailOrUsername
    );
    if (!filteredUser) {
      notification.error({
        message: "Your email or user name is not exist .",
        placement: "topRight",
        duration: 1.5,
      });
      setIsLoading(false);
      return;
    }
    // const emailsss = JSON.stringify({ email: filteredUser.email });
    await fetchBackend("email/send-code", "POST", {
      email: filteredUser.email,
    });
    navigate("/vertification");
  };
  return (
    <div className="flex justify-center items-center h-screen bg-sky-100">
      <div className="py-6 bg-white h-2/5 w-1/3 rounded-xl shadow-xl shadow-slate-400 flex flex-col justify-between items-center">
        <div>
          <h1 className="pacifico text-3xl text-[#1677ff]">Forgot Password</h1>
        </div>
        <div className="flex flex-col gap-4 w-full px-12">
          <label className="merriweather">Email or user name: </label>
          <Input
            size="large"
            placeholder="Enter your user name or email"
            value={emailOrUsername}
            onChange={(e) => setEmailOrUsername(e.target.value)}
          />
          <div>
            <span>---</span>
          </div>
        </div>
        <div className=" btn_container flex justify-between w-full px-10 mt-7">
          <Button
            className="w-[43%] pacifico h-14 text-2xl cursor-pointer"
            variant="outlined"
            color="primary"
            onClick={() => {
              //   localStorage.removeItem('currentDeparment');
              navigate("/login");
            }}
            disabled={isLoading}
          >
            <LeftOutlined className="relative right-6" />
            Back
          </Button>
          <Button
            className="w-[43%] h-14 pacifico text-2xl cursor-pointer"
            variant="solid"
            color="primary"
            onClick={handleCheckEmailOrUser}
            disabled={isLoading}
          >
            {!isLoading ? "Next" : <Loading3QuartersOutlined spin />}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
