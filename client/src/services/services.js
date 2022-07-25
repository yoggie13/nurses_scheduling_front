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
        return await api.PUT("nurses/delete", data);
    }
    static EditNurses = async (data) => {
        return await api.PUT("nurses/", data);
    }
    static AddNurse = async (data) => {
        return await api.POST('nurses/', [data]);
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
    static GetSequenceRules = async () => {
        return await api.GET('sequencerules/');
    }
    static DeleteSequenceRule = async (id) => {
        return await api.DELETE('sequencerules/' + id)
    }
    static GetGroupingRules = async () => {
        return await api.GET('groupingrules/');
    }
    static GetNursesGroupingRules = async (id) => {
        return await api.GET(`groupingrules/${id}/nurses`);
    }
    static DeleteNurseFromGroupingRule = async (GroupingRuleID, NurseID) => {
        return await api.DELETE(`groupingrules/${GroupingRuleID}/nurses/${NurseID}`);
    }
    static AddNurseToGroupingRule = async (GroupingRuleID, NurseID) => {
        return await api.POST(`groupingrules/${GroupingRuleID}/nurses/${NurseID}`);
    }
    static DeleteGroupingRule = async (id) => {
        return await api.DELETE('groupingrules/' + id)
    }
    static EditGroupingRules = async (data) => {
        return await api.PUT('groupingrules/', data)
    }
    static EditSequenceRules = async (data) => {
        return await api.PUT('groupingrules/', data)
    }
}