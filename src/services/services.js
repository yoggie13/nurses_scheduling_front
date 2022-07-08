import api from "./api";

export default class services {
    static GetNurses = async () => {
        return await api.GET("nurses/");
    }
    static GetDays = async () => {
        return await api.GET("days/");
    }
    static TryNewReport = async (name, data) => {
        return await api.POST("requests/" + name, data);
    }
}