import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";

const ProtectedRoute = ({ children }) => {
  const user = useSelector((state) => state.user.user);
  // const localUser = JSON.parse(localStorage.getItem('currentUser'))

  // if(localUser){
  //   return children;
  // }else if(user){
  //   return children;
  // }else{
  //   return <Navigate to="/login" />;
  // }
  return user ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
