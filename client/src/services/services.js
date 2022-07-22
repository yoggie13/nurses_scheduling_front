import api from "./api";

export default class services {
    static GetNursesForSelect = async () => {
        return await api.GET("nursesForSelect/");
    }
    static GetDaysForSelect = async () => {
        return await api.GET("daysForSelect/");
    }
    static TryNewReport = async (name, data) => {
        return await api.POST("requests/" + name, data);
    }
    static GetNurses = async () => {
        return await api.GET("nurses/");
    }
    static DeleteNurses = async (data) => {
        return await api.DELETE("nurses/", data);
    }
    static EditNurses = async (data) => {
        return await api.PUT("nurses/", data);
    }
    static GetParameters = async () => {
        return await api.GET('parameters/');
    }
    static EditParameters = async (data) => {
        return await api.PUT('parameters/', data);
    }
    static GetShifts = async (data) => {
        return await api.GET('shifts/', data);
    }
    static EditShifts = async (data) => {
        return await api.PUT('shifts/', data);
    }
}