import { 
  USER,
  PAGE_LOADING, 
  LOADING, 
  IS_AUTHENTICATED, 
} from "../../actions";
  
import { ac_boolean } from "../boolean";
import axios from 'axios';

import { toast } from 'react-toastify';
toast.configure();

export const ac_userAuthentication =  () => async (dispatch) => {
  try {
    dispatch(ac_boolean(PAGE_LOADING, true))
    const token = localStorage.getItem('token');
    const res = await axios({
      method: "GET",
      url: "http://localhost:5000/admin",
      headers: { 'Authorization' : `Bearer ${token}` } 
    });
    if (res.status === 200) {
      toast.success(res.data.msg, { autoClose: 2000, position: "bottom-right" });
      dispatch({
        type: USER,
        payload: res.data.user,
      });
      dispatch(ac_boolean(PAGE_LOADING, false));
      dispatch(ac_boolean(IS_AUTHENTICATED, true));
    }
  } catch (err) {
    dispatch(ac_boolean(PAGE_LOADING, false));
    // toast.info(err.response.data.msg, { autoClose: 2000, position: "bottom-right" });
  }
}

export const ac_userSignInSignUp =  (formData, urlSubStr) => async (dispatch) => {
  try {
    const msg = urlSubStr === "signup" ? "registered" : "signed in";
    dispatch(ac_boolean(LOADING, true));
    const res = await axios.post(`http://localhost:5000/user/${urlSubStr}`, { ...formData });
    if (res.status === 200) {
      toast.success(`You are successfully ${msg}...`, { autoClose: 2000, position: "bottom-right" });
      localStorage.setItem("token", res.data.token);
      console.log(res.data.user);
      dispatch({
        type: USER,
        payload: res.data.user,
      });
      dispatch(ac_boolean(LOADING, false));
      dispatch(ac_boolean(IS_AUTHENTICATED, true));
    }
  } catch (err) {
    toast.info(err.response.data.msg, { autoClose: 2000, position: "bottom-right" });
    dispatch(ac_boolean(LOADING, false));
  }
}

export const ac_userSignOut = () => (dispatch) => {
  localStorage.removeItem("token");
  dispatch(ac_boolean(IS_AUTHENTICATED, false));
  dispatch({
    type: USER,
    payload: "",
  });
  toast.success("Sign out successfully", { autoClose: 2000, position: "bottom-right" });
}

export const ac_userProfileUpdate = (formData) => async (dispatch) => {
  try {
    const { _id, firstName, lastName, email } = formData;
    dispatch(ac_boolean(LOADING, true));
    const res = await axios.put(`http://localhost:5000/user/${_id}`, {
      firstName, lastName, email,
    });
    console.log(res);
    toast.success(res.data.msg, { autoClose: 5000, position: "bottom-right" });
    if(res.status === 200){
      dispatch({
        type: USER,
        payload: res.data.user,
      });
      dispatch(ac_boolean(IS_AUTHENTICATED, true));
    }
    dispatch(ac_boolean(LOADING, false));
  } catch (err) {
    toast.info(err.response.data.msg, { autoClose: 2000, position: "bottom-right" });
    dispatch(ac_boolean(LOADING, false));
  }
}