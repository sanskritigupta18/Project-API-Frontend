import toast from "react-hot-toast";
import { userEndpoints } from "../api.js";
import { setLoading, setToken, setUser } from "../../Slices/Profile/profile.js";
import { apiConnector } from "../apiConnector";
import { Navigate } from "react-router-dom";
const {
  REGISTER_USER,
  LOGIN_USER,
  LOGOUT_USER,
  UPDATE_REFRESH_TOKEN,
  CHANGE_PASSWORD,
} = userEndpoints;

export function signup(email, password, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));

    try {
      const response = await apiConnector("POST", REGISTER_USER, {
        email,
        password,
      });

      toast.success("Signup Successful");
      navigate("/login");
    } catch (e) {
      toast.error("Signup Failed");
      navigate("/signup");
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}

export function login(email, password, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", LOGIN_USER, {
        email,
        password,
      });
      toast.success("Login Successful");
      dispatch(setToken(response.data.data.accessToken));
      localStorage.setItem("user", JSON.stringify(response.data.data.user));
      localStorage.setItem(
        "accessToken",
        JSON.stringify(response.data.data.accessToken)
      );
      navigate("/user");
    } catch (error) {
      console.log("LOGIN API ERROR............", error);
      toast.error("Login Failed");
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}

export function changePassword(oldPassword, newPassword) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    const accessToken = JSON.parse(localStorage.getItem("accessToken"));
    dispatch(setLoading(true));
    try {
      const response = await apiConnector(
        "POST",
        CHANGE_PASSWORD,
        {
          oldPassword,
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        }
      );

      if (!response.data.data.success) {
        throw new Error(response.data.data.message);
      }

      toast.success("Updated refresh token");
    } catch (e) {
      console.log("LOGIN API ERROR............", e);
      toast.error("Login Failed");
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}

export function updateRefreshToken() {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector(
        "POST",
        UPDATE_REFRESH_TOKEN,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`, // Assuming you store the token in localStorage
          },
        }
      );

      if (!response.data.data.success) {
        throw new Error(response.data.data.message);
      }
      dispatch(setToken(response.data.data.accessToken));
      localStorage.setItem(
        "token",
        JSON.stringify(response.data.data.accessToken)
      );
      toast.success("Token updated");
    } catch (e) {
      console.log("LOGIN API ERROR............", e);
      toast.error("Login Failed");
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}

export function logout(token, navigate) {
  return async (dispatch) => {
    const accessToken = JSON.parse(localStorage.getItem("accessToken"));
    const toastId = toast.loading("Loading...");

    dispatch(setLoading(true));
    try {
      const response = await apiConnector(
        "POST",
        LOGOUT_USER,
        {},
        {
          Authorization: `Bearer ${token}`,
        }
      );
      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      dispatch(setToken(null));
      dispatch(setUser(null));
      /*
       */
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      navigate("/");
      toast.success("Logout successful");
    } catch (e) {
      console.log("LOGIN API ERROR............", e);
      toast.error("Logout Failed");
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}
