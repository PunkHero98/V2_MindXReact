import { Navigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { notification } from "antd";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { getUser } from "../services/apiHandle";
import { login } from "../features/auth/Login";
import { Spin } from "antd";

const CHECK_INTERVAL = 1 * 60 * 1000;

const ProtectedRoute = ({ children }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user?.user);
  const location = useLocation();
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isSessionValid, setIsSessionValid] = useState(false);

  const checkSessionID = async () => {
    const sessionID = localStorage.getItem("sessionID");

    if (!sessionID) {
      setIsCheckingSession(false);
      setIsSessionValid(false);
      return;
    }

    try {
      const result = await getUser();
      if (!result.success) throw new Error(result.message || "Failed to fetch user data");

      const users = result.data;
      const currentUser = users.find((u) => u.sessionID === sessionID);

      if (currentUser) {
        dispatch(login(currentUser)); // Cập nhật user vào Redux
        setIsSessionValid(true);
      } else {
        localStorage.removeItem("sessionID");
        localStorage.removeItem("sessionExpiry");

        notification.error({
          message: "Session expired",
          description: "Please login again",
          placement: "topRight",
          duration: 1.5,
        });

        setIsSessionValid(false);
      }
    } catch (err) {
      notification.error({
        message: "Error",
        description: err.message || "Please try again later!",
        placement: "topRight",
        duration: 1.5,
      });
      setIsSessionValid(false);
    } finally {
      setIsCheckingSession(false);
    }
  };

  useEffect(() => {
    if (!user) {
      checkSessionID();
    } else {
      setIsCheckingSession(false);
      setIsSessionValid(true);
    }

    const interval = setInterval(checkSessionID, CHECK_INTERVAL);
    return () => clearInterval(interval);
  }, [user, location]);

  if (isCheckingSession) return (
    <div  className="flex justify-center items-center h-screen">
      <Spin />
    </div>
  );

  if (!isSessionValid) return <Navigate to="/login" replace />;

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
