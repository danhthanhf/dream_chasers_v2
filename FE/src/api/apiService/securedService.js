import { securedInstance } from "../instance";

export const getAskByFilter = async (
    courseId,
    lessonId = 0,
    order = "desc",
    askFilterType = "ALL",
    page = 0,
    size = 10
) => {
    try {
        let api = `/courses/${courseId}/asks?orderBy=${order}&askFilterType=${askFilterType}&page=${page}&size=${size}`;
        if (lessonId != 0) {
            api += `&lessonId=${lessonId}`;
        }
        const res = await securedInstance.get(api);
        return res.content;
    } catch (error) {
        return Promise.error(error);
    }
};
