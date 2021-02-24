import Axios from "axios";
import { closeLoading, showLoading, showPopUp, showProgress } from "./PopUp";
import { getPost } from "./Posts";
import SetAuthToken from "./setAuthToken";

const configJson = {
	headers: {
		"Content-type": "application/json",
	},
};
const configForm = (dispatch) => ({
	headers: {
		"Content-type": "multipart/form-data",
	},
	onUploadProgress: (ProgressEvent) => {
		let percentage = Math.round((ProgressEvent.loaded * 100) / ProgressEvent.total);
		dispatch(showProgress(percentage));
	},
});
export const baseUrl = "http://localhost:5000/api/v1";

export const loadData = () => async (dispatch) => {
	dispatch(showLoading());
	if (localStorage.getItem("token")) {
		SetAuthToken(localStorage.getItem("token"));
	}

	try {
		const result = await Axios.get(`${baseUrl}/load`, configJson);
		dispatch({
			type: "LOAD_DATA",
			payload: result.data.account,
		});
		dispatch(closeLoading());
	} catch (error) {
		console.log(error.response);
		dispatch(closeLoading());
		dispatch({
			type: "AUTH_ERROR",
		});
	}
};
export const userLogin = (data) => async (dispatch) => {
	try {
		dispatch(showLoading());
		const results = await Axios.post(`${baseUrl}/login`, data, configJson);
		dispatch({
			type: "LOGIN",
			payload: results.data.account,
		});
		dispatch(loadData());
	} catch (error) {
		dispatch(closeLoading());
		dispatch(showPopUp(error.response.data.message));
	}
};
export const userRegister = (data) => async (dispatch) => {
	try {
		dispatch(showLoading());
		const results = await Axios.post(`${baseUrl}/register`, data, configJson);
		dispatch({
			type: "REGISTER",
			payload: results.data.data.user,
		});
		dispatch(loadData());
	} catch (error) {
		dispatch(closeLoading());
		dispatch(showPopUp(error.response.data.message));
	}
};
export const bookmark = (data) => async (dispatch) => {
	try {
		dispatch(showLoading());
		const result = await Axios.post(`${baseUrl}/bookmark/${data}`);
		dispatch(closeLoading());
		dispatch(getPost(data));
		dispatch(showPopUp(result.data.message));
	} catch (error) {
		dispatch(showPopUp(error.response.data.message));
	}
};
export const logout = () => (dispatch) => {
	dispatch({
		type: "LOGOUT",
	});
};
