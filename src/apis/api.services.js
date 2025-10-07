import apiEndpoints from "./api.endpoints";
import axiosInstance from "./axios.instance";


export const SendOtp = async (data) => {
    return axiosInstance.post(apiEndpoints.sendOtp, data);
}

export const RegisterCoworking = async (data) => {
    return axiosInstance.post(apiEndpoints.coworkingRegister, data);
}

export const InitiateCoworkingPayment = async (data) => {
    return axiosInstance.post(apiEndpoints.coworkingInitiatePayment, data);
}

export const FindRegisteredPaidUser = async (data) => {
    return axiosInstance.post(apiEndpoints.findRegisteredPaidUser, data);
}

export const GetSystemConfig = async (key) => {
    return axiosInstance.get(`${apiEndpoints.getSystemConfig}/${key}`);
}

