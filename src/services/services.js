import api from "./api";

export default class services {
    static GetNurses = async () => {
        return await api.GET("nurses/");
    }
}