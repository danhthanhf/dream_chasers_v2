import { userInstance } from "../instance";


export const searchContact = async (name) => {
    try {
        const res = await userInstance.get(`/search-friend?name=${name}`);
        return res.content;
    } catch (error) {
        return Promise.reject(error);
    }
};

export const registerInstructor = async () => {
    try {
        const res = await userInstance.post("/instructor/register");
        return res.content;
    } catch (error) {
        return Promise.reject(error);
    }
};

export const getAlEnrollCourse = async () => {
    try {
        const res = await userInstance.get("/courses/enrolled");
        return res.content;
    } catch (error) {
        return Promise.reject(error);
    }
};

export const sendAddFriend = async (email) => {
    try {
        const res = await userInstance.post(`${email}/add-friend`);
        return res.conntent;
    } catch (error) {
        return Promise.reject(error);
    }
};

export const removeCommentByIdInPost = async (cmtId) => {
    try {
        return await userInstance.delete(`/comments/${cmtId}/post`);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const removeCommentByIdInLesson = async (cmtId) => {
    try {
        return await userInstance.delete(`/comments/${cmtId}/lesson`);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const updateComment = async (cmt) => {
    try {
        const res = await userInstance.put(`/comments/${cmt.id}`, cmt);
        return res.content;
    } catch (error) {
        return Promise.reject(error);
    }
};

export const followAsk = async (askId) => {
    try {
        await userInstance.post(`/comments/${askId}/follow`);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const unFollowAsk = async (askId) => {
    try {
        await userInstance.post(`/comments/${askId}/un-follow`);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const saveAsk = async (ask, courseId, lessonId) => {
    try {
        const res = await userInstance.post(
            `/comments/${courseId}/${lessonId}`,
            ask
        );
        return res.content;
    } catch (error) {
        return Promise.reject(error);
    }
};

export const deleteNoteById = async (noteId) => {
    try {
        await userInstance.delete(`/notes/${noteId}`);
    } catch (error) {
        return Promise.error(error);
    }
};

export const getNoteByTime = async (lessonId, time) => {
    try {
        const rest = await userInstance.get(`/notes/${lessonId}?time=${time}`);
        return rest.content;
    } catch (error) {
        return Promise.reject(error);
    }
};

export const getCourseByCourseAndLectureAndSortBy = async (
    courseId,
    lessonId,
    order,
    page,
    size
) => {
    try {
        let res;
        if (lessonId == 0) {
            res = await userInstance.get(
                `/notes?courseId=${courseId}&order=${order}&page=${page}&size=${size}`
            );
        } else {
            res = await userInstance.get(
                `/notes?courseId=${courseId}&lessonId=${lessonId}&order=${order}&page=${page}&size=${size}`
            );
        }

        return res.content;
    } catch (error) {
        return Promise.reject(error);
    }
};

export const saveNote = async (courseId, lessonId, note) => {
    try {
        const res = await userInstance.post(
            `/notes/${courseId}/${lessonId}`,
            note
        );
        return res.content;
    } catch (error) {
        return Promise.reject(error);
    }
};

export const updateNote = async (note) => {
    try {
        const res = await userInstance.put(`/notes/${note.id}`, note);
        return res.content;
    } catch (error) {
        return Promise.reject(error);
    }
};

export const ratingCourse = async (courseId, rating) => {
    try {
        await userInstance.post(`/courses/${courseId}/rating`, rating);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const completedLesson = async (courseId, lessonId) => {
    try {
        const res = await userInstance.put(
            `/courses/${courseId}/lessons/${lessonId}/completed`
        );
        return res.content;
    } catch (error) {
        return Promise.reject(error);
    }
};

export const getEnrollment = async (id) => {
    try {
        const res = await userInstance.get(`/courses/${id}/enrollment`);
        return res.content;
    } catch (error) {
        return Promise.reject(error);
    }
};

export const getPaymentVNPAY = async (method, courseId) => {
    try {
        const res = await userInstance.get(
            `create-payment?method=${method}&courseId=${courseId}`
        );
        return res.content;
    } catch (error) {
        return Promise.reject(error);
    }
};

export const checkEnrollmentAndRetrieveCourse = async (id) => {
    try {
        const res = await userInstance.get(`/courses/${id}/check-enrollment`);
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
