import { privateInstance } from "../instance";

export const getStatisticByTypeAndDate = async (
    type = "course",
    date = "year"
) => {
    try {
        const res = await privateInstance.get(
            `/statistic?type=${type}&dateTime=${date}`
        );
        return res.content;
    } catch (error) {
        return Promise.reject(error);
    }
};

export const getStatisticAll = async () => {
    try {
        const res = await privateInstance.get(`/statistic/all`);
        return res.content;
    } catch (error) {
        return Promise.reject(error);
    }
};
