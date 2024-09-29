import publicInstance, { privateInstance } from "../instance";

export const restoreListCourse = async (ids) => {
    try {
        return await privateInstance.delete(`/course/restore/list`, {
            params: { ids: ids.join(", ") },
        });
    } catch (error) {
        return Promise.reject(error);
    }
};

export const softDeleteCourses = async (ids) => {
    try {
        return await privateInstance.delete(`/course/delete/soft/list`, {
            params: {
                ids: ids.join(", "),
            },
        });
    } catch (error) {
        return Promise.reject(error);
    }
};

export const getAllCategories = async (
    deleted = false,
    page = 0,
    size = 99999
) => {
    try {
        const res = await privateInstance.get(
            `/category/getAll?deleted=${deleted}&page=${page}&size=${size}`
        );
        return res.content;
    } catch (error) {
        return Promise.reject(error);
    }
};

export const createCourse = async (course) => {
    const formData = new FormData();
    const json = JSON.stringify(course);
    const courseBlob = new Blob([json], {
        type: "application/json",
    });
    formData.append("course", courseBlob);
    try {
        const response = await privateInstance.postForm(
            "/course/create",
            formData
        );
        return response;
    } catch (error) {
        return Promise.reject(error);
    }
};

export const updateCourse = async (id, course) => {
    console.log(course);
    const formData = new FormData();
    const json = JSON.stringify(course);
    const courseBlob = new Blob([json], {
        type: "application/json",
    });

    formData.append("course", courseBlob);
    try {
        const result = await privateInstance.putForm(
            `/course/edit/${id}`,
            formData
        );
        return result;
    } catch (error) {
        return Promise.reject(error);
    }
};
// coursvideo dang text

export const getAllCourse = async (page = 0, size = 5) => {
    try {
        const result = await publicInstance.get(
            `/course/getAll?page=${page}&size=${size}`
        );
        return result.content;
    } catch (error) {
        return Promise.reject(error);
    }
};

export const getAllCourseAdmin = async (page = 0, size = 5) => {
    try {
        const result = await privateInstance.get(
            `/course/getAll?page=${page}&size=${size}`
        );
        return result.content;
    } catch (error) {
        return Promise.reject(error);
    }
};
export const getAllCourseDeleted = async (page, size) => {
    try {
        const result = await privateInstance.get(
            `/course/getAllDeleted?page=${page}&size=${size}`
        );
        return result.content;
    } catch (error) {
        console.log(error);
        return Promise.reject(error);
    }
};

export const getCourseById = async (id, isDeleted = "false") => {
    try {
        return await publicInstance.get(`/course/${id}?isDeleted=${isDeleted}`);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const softDeleteCourse = async (id, page = 0, selected = 5) => {
    try {
        const result = await privateInstance.delete(
            `/course/delete/soft/${id}?page=${page}&size=${selected}`
        );
        return result.content;
    } catch (error) {
        return Promise.reject(error);
    }
};

export const hardDeleteCourse = async (id) => {
    try {
        const result = await privateInstance.delete(
            `/course/delete/hard/${id}`
        );
        return result;
    } catch (error) {
        return Promise.reject(error);
    }
};

export const getCoursesDeletedByCategory = (id, page, size) => {
    try {
        return privateInstance.get(
            `/course/deleted/category?id=${id}&page=${page}&size=${size}`
        );
    } catch (error) {
        Promise.reject(error);
    }
};
export const getCoursesByCategory = async (
    deleted = "false",
    id,
    page,
    size
) => {
    try {
        const result = await privateInstance.get(
            `/course/category?id=${id}&deleted=${deleted}&page=${page}&size=${size}`
        );
        return result.content;
    } catch (error) {
        console.log(error.mess);
        Promise.reject(error);
    }
};

export const searchCourseByNameAndPostByTitle = async (
    title,
    page = 0,
    size = 5
) => {
    try {
        return await publicInstance.get(
            `/course-post?title=${title}&page=${page}&size=${size}`
        );
    } catch (error) {
        return Promise.reject(error);
    }
};

export const getCourseByNameAndCategory = async (
    title,
    categoryId = 0,
    page = 0,
    selected = 5,
    isDeleted = "false"
) => {
    try {
        const result = await privateInstance.get(
            `/course?title=${encodeURIComponent(
                title
            )}&categoryId=${categoryId}&isDeleted=${isDeleted}&page=${page}&selected=${selected}`
        );
        return result.content;
    } catch (error) {
        Promise.reject(error.mess);
    }
};

export const softDeleteCategoryById = (id) => {
    try {
        return privateInstance.put(`/category/delete/soft/${id}`);
    } catch (error) {
        Promise.reject(error);
    }
};

export const hardDeleteCategoryById = (id) => {
    try {
        return privateInstance.delete(`/category/delete/hard/${id}`);
    } catch (error) {
        Promise.reject(error);
    }
};
export const restoreCategoryById = (id) => {
    try {
        return privateInstance.put(`/category/restore/${id}`);
    } catch (error) {
        Promise.reject(error);
    }
};

export const getCategoryByTitle = (name, page = 0, selected = 5) => {
    console.log(name);
    try {
        return publicInstance.get(
            `/category?name=${name}&page=${page}&selected`
        );
    } catch (error) {
        Promise.reject(error);
    }
};

export const editCategory = (id, category) => {
    try {
        return privateInstance.put(`/category/${id}`, category);
    } catch (error) {
        Promise.reject(error);
    }
};

export const getCategoryById = (id) => {
    try {
        return publicInstance.get(`/category/${id}`);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const createCategory = (category) => {
    try {
        return privateInstance.post(`/category/create`, {
            name: category,
        });
    } catch (error) {
        return Promise.reject(error);
    }
};

export const restoreCourseById = async (id, page = 0, selected = 5) => {
    try {
        const result = await privateInstance.delete(
            `/course/restore/${id}?page=${page}&size=${selected}`
        );
        return result.content;
    } catch (error) {
        Promise.reject(error);
    }
};

export const getComments = async (path = "") => {
    try {
        return await publicInstance.get(`${path}`);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const getAllInvoice = async (page = 0, size = 5) => {
    try {
        return await privateInstance.get(
            `/invoice/getAll?page=${page}&size=${size}`
        );
    } catch (error) {
        return Promise.reject(error);
    }
};

export const getInvoicesByDate = async (startDate, endDate, page, size) => {
    try {
        return await privateInstance.get(
            `/invoice/getByDate?start=${encodeURIComponent(
                startDate
            )}&end=${encodeURIComponent(endDate)}&page=${page}&size=${size}`
        );
    } catch (error) {
        return Promise.reject(error);
    }
};

export const softDeleteInvoice = async (id) => {
    try {
        return await privateInstance.put(`/invoice/delete/soft/${id}`);
    } catch (error) {
        return Promise.reject(error);
    }
};
export const getAllInvoiceByPage = async (page, size) => {
    try {
        return await privateInstance.get(
            `/invoice/getAll?page=${page}&size=${size}`
        );
    } catch (error) {
        return Promise.reject(error);
    }
};

export const searchInvoice = async (search, page, size) => {
    try {
        return await privateInstance.get(
            `/invoice/search?name=${search}&page=${page}&size=${size}`
        );
    } catch (error) {
        return Promise.reject(error);
    }
};

export const getAllInvoiceDelete = async (page = 0, size = 5) => {
    try {
        return await privateInstance.get(`/invoice/getAllDeleted`);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const restoreInvoieById = async (id) => {
    try {
        return await privateInstance.put(`/invoice/restore/${id}`);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const getMonthlyStatistic = async (month, year, page = 0, size = 5) => {
    try {
        return await privateInstance.get(
            `/statistic?month=${month}&year=${year}&page=${page}&size=${size}`
        );
    } catch (error) {
        return Promise.reject(error);
    }
};

export const uploadFile = async (img) => {
    try {
        const formData = new FormData();
        formData.append("file", img);
        return await publicInstance.postForm("/upload/file", formData);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const getPosts = async (page = "0", size = "5") => {
    try {
        return await publicInstance.get(`/post/list?page=${page}&size=${size}`);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const serchTag = async (name) => {
    try {
        return await publicInstance.get(`/tag?name=${name}`);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const getPostByTitle = async (title) => {
    try {
        return await publicInstance.get(
            `/post?title=${encodeURIComponent(title)}`
        );
    } catch (error) {
        return Promise.reject(error);
    }
};

export const getAllPost = async (
    status = "ALL",
    page = 0,
    selectedSize = 5
) => {
    try {
        return await privateInstance.get(
            `/post/getAll?status=${status}&page=${page}&size=${selectedSize}`
        );
    } catch (error) {
        return Promise.reject(error);
    }
};

export const processStatusPost = async (id, status, page, size) => {
    try {
        return await privateInstance.put(
            `/post/${id}/status/${status}?page=${page}&size=${size}`
        );
    } catch (error) {
        return Promise.reject(error);
    }
};

export const searchPostByTitle = async (title, status, page = 0, size = 5) => {
    try {
        return await privateInstance.get(
            `/post?title=${title}&status=${status}&page=${page}&size=${size}`
        );
    } catch (error) {
        return Promise.reject(error);
    }
};
