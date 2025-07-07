import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import { Loader } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
const App = () => {

  const {authUser, isCheckingAuth} = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  return <></>;
};

export default App;
