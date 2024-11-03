import publicInstance from "../instance";

export const getAllCategoriesAndPrice = async (
    deleted = false,
    page = 0,
    size = 99999
) => {
    try {
        const res = await publicInstance.get(
            `/category/price/getAll?deleted=${deleted}&page=${page}&size=${size}`
        );

        return res.content;
    } catch (error) {
        console.log(error);
        return Promise.reject(error);
    }
};

export const getCourseByTitle = async (title) => {
    try {
        const result = await publicInstance.get(
            `/course?title=${encodeURIComponent(title)}`
        );
        return result.content;
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
        const res = await publicInstance.get(
            `/category/getAll?&page=${page}&size=${size}`
        );
        return res.content;
    } catch (error) {
        return Promise.reject(error);
    }
};

export const getCourseByNameAndCategory = async (
    title,
    categoryId = 0,
    page = 0,
    selected = 5
) => {
    try {
        const result = await publicInstance.get(
            `/course?title=${encodeURIComponent(
                title
            )}&categoryId=${categoryId}&page=${page}&selected=${selected}`
        );
        return result.content;
    } catch (error) {
        Promise.reject(error.mess);
    }
};

export const getCommentByPostId = async (postId, pagination) => {
    try {
        const result = await publicInstance.get(
            `/post/${postId}/comments?page=${pagination.page}&size=${pagination.size}`
        );
        return result.content;
    } catch (error) {
        return Promise.reject(error);
    }
};

export const recordViewForPost = (postId) => {
    try {
        publicInstance.put(`/post/${postId}/add-view`);
    } catch (error) {
        console.log(error);
    }
};

export const getAllTag = async () => {
    try {
        const result = await publicInstance.get("/tag/getAll");
        return result.content;
    } catch (error) {
        return Promise.reject(error);
    }
};

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

export const getCourseById = async (id, isDeleted = "false") => {
    try {
        return await publicInstance.get(`/course/${id}?isDeleted=${isDeleted}`);
    } catch (error) {
        return Promise.reject(error);
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

export const getCategoryById = (id) => {
    try {
        return publicInstance.get(`/category/${id}`);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const getComments = async (path = "") => {
    try {
        return await publicInstance.get(`${path}`);
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
        const result = await publicInstance.get(
            `/post/list?page=${page}&size=${size}`
        );
        return result.content;
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

export const getPostByTitle = async (title, watchPatam = "") => {
    try {
        let api = `/post?title=${encodeURIComponent(title)}`;
        if (watchPatam != null) {
            api += `&watch=${watchPatam}`;
        }
        return await publicInstance.get(api);
    } catch (error) {
        return Promise.reject(error);
    }
};
