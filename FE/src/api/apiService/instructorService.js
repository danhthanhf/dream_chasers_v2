import { instructorInstance } from "../instance";

export const getCourseById = async (id) => {
    try {
        const res = await instructorInstance.get(`/courses/${id}`);
        return res.content;
    } catch (error) {
        return Promise.reject(error);
    }
};

export const getAvailableCourseByNameAndCategory = async (
    title,
    categoryId = 0,
    page = 0,
    selected = 5,
    isDeleted = "false"
) => {
    try {
        const result = await instructorInstance.get(
            `/courses/available?title=${encodeURIComponent(
                title
            )}&categoryId=${categoryId}&isDeleted=${isDeleted}&page=${page}&selected=${selected}`
        );
        return result.content;
    } catch (error) {
        Promise.reject(error.mess);
    }
};

export const restoreListCourse = async (ids) => {
    try {
        return await instructorInstance.delete(`/courses/restore/list`, {
            params: { ids: ids.join(", ") },
        });
    } catch (error) {
        return Promise.reject(error);
    }
};

export const restoreCourseById = async (id, page = 0, selected = 5) => {
    try {
        const result = await instructorInstance.delete(
            `/courses/restore/${id}?page=${page}&size=${selected}`
        );
        return result.content;
    } catch (error) {
        Promise.reject(error);
    }
};
export const softDeleteListCourse = async (ids) => {
    console.log("🚀 ~ softDeleteListCourse ~ ids:", ids);
    try {
        return await instructorInstance.delete(`/courses/delete/soft/list`, {
            params: {
                ids: ids.join(", "),
            },
        });
    } catch (error) {
        return Promise.reject(error);
    }
};

export const softDeleteCourse = async (id, page = 0, selected = 5) => {
    try {
        const result = await instructorInstance.delete(
            `/courses/delete/soft/${id}?page=${page}&size=${selected}`
        );
        return result.content;
    } catch (error) {
        return Promise.reject(error);
    }
};

export const processStatusCourse = async (id, status) => {
    try {
        const result = await instructorInstance.put(
            `/courses/${id}/status`,
            status,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        return result;
    } catch (error) {
        return Promise.reject(error);
    }
};

export const updateCourse = async (id, course) => {
    try {
        let categories = course.categories.map((cate) => cate.label);
        course.categories = categories;
        const response = await instructorInstance.put(`/courses/${id}`, course);
        return response.content;
    } catch (error) {
        return Promise.reject(error);
    }
};

export const createCourse = async (course) => {
    try {
        let categories = course.categories.map((cate) => cate.label);
        course.categories = categories;
        const response = await instructorInstance.post("/courses", course);
        return response;
    } catch (error) {
        return Promise.reject(error);
    }
};

export const getListCourseDraftOrPublishedAndAvailableAndCategory = async (
    status = "ALL",
    categoryId,
    page,
    size
) => {
    try {
        const result = await instructorInstance.get(
            `/courses/available/getAll?status=${status}&categoryId=${categoryId}&page=${page}&size=${size}`
        );
        return result.content;
    } catch (error) {
        return Promise.reject(error);
    }
};

export const getCoursesByCategoryAndStatus = async (
    deleted = false,
    categoryId,
    status = "ALL",
    page,
    size
) => {
    try {
        const result = await instructorInstance.get(
            `/courses/category?status=${status}&categoryId=${categoryId}&deleted=${deleted}&page=${page}&size=${size}`
        );
        return result.content;
    } catch (error) {
        console.log(error.mess);
        Promise.reject(error);
    }
};

export const getCoursesDeletedByCategory = async (
    deleted = false,
    id,
    page,
    size
) => {
    try {
        const result = await instructorInstance.get(
            `/courses/category?id=${id}&page=${page}&size=${size}`
        );
        return result.content;
    } catch (error) {
        console.log(error.mess);
        Promise.reject(error);
    }
};

export const getAllCourse = async (page = 0, size = 5) => {
    try {
        const result = await instructorInstance.get(
            `/courses/getAll?page=${page}&size=${size}`
        );
        return result.content;
    } catch (error) {
        return Promise.reject(error);
    }
};
