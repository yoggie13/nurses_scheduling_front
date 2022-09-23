import api from "./api";

export default class services {
    static GetNursesForSelect = async () => {
        return await api.GET("nursesForSelect/");
    }
    static GetDaysForSelect = async () => {
        return await api.GET("daysForSelect/");
    }
    static TryNewSchedule = async (name, data) => {
        return await api.POST("requests/", data);
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
    static GetPatterns = async () => {
        return await api.GET('patterns/')
    }
    static EditPatterns = async (data) => {
        return await api.PUT('patterns/', data);
    }
    static GetNWDTypes = async () => {
        return await api.GET('nonworkingdaytypes/')
    }
    static EditNWDTypes = async(data) => {
        return await api.POST('nonworkingdaytypes/', data)
    }
    static DeleteNWDTypes = async (id) => {
        return await api.POST('nonworkingdaytypes/' + id)
    }
    static GetSchedules = async () => {
        return await api.GET('schedules/');
    }
    static GetSchedule = async (id) => {
        return await api.GET(`schedules/${id}`);
    }
    static ChoseSchedule = async (id) => {
        return await api.POST(`schedules/${id}`);
    }
}