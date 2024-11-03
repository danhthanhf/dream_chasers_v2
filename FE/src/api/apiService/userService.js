import { userInstance } from "../instance";

export const getPaymentVNPAY = async (method, courseId ) => {
    try {
        const res = await userInstance.get(
            `create-payment?method=${method}&courseId=${courseId}`
        );
        return res.content;
    } catch (error) {
        return Promise.reject(error);
    }
};

export const checkEnrollmentAndRetrieveCourse = async (title) => {
    try {
        const res = await userInstance.get(`/courses/${title}`);
        return res.content;
    } catch (error) {
        return Promise.reject(error);
    }
};

export const enrollCourse = async (courseId) => {
    try {
        const res = await userInstance.post(`/courses/${courseId}/enroll`);
        return res;
    } catch (error) {
        return Promise.reject(error);
    }
};

export default async function getMyPostList(
    status,
    deleted = false,
    pagination = { page: 0, size: 10 }
) {
    try {
        status = status.toUpperCase();
        const res = await userInstance.get(
            `/posts?status=${status}&deleted=${deleted}&page=${pagination.page}&size=${pagination.size}`
        );
        return res.content;
    } catch (error) {
        return Promise.reject(error);
    }
}
