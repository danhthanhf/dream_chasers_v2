import publicInstance, { userInstance } from "../instance";
import instance, { privateInstance } from "../instance";

export const enrollCourse = async (enrollDTO) => {
    try {
        return await userInstance.post("/enroll/course", enrollDTO);
    } catch (error) {
        return Promise.reject(error);
    }
};
export const register = async ({
    firstName,
    lastName,
    email,
    password,
    otp,
}) => {
    try {
        const res = await instance.post(
            "/user/register",
            {
                firstName,
                lastName,
                email,
                password,
            },
            {
                "content-type": "application/json",
            }
        );
        return res;
    } catch (error) {
        return Promise.reject(error);
    }
};

export const login = async ({ email, password }) => {
    try {
        const res = await instance.post(
            "/user/login",
            {
                email,
                password,
            },
            { "content-type": "application/json" }
        );

        return res;
    } catch (error) {
        return Promise.reject(error);
    }
};

export const sendMail = async (email) => {
    try {
        const res = await instance.post(
            "/user/send-verify-email",
            {
                email,
            },
            {
                "content-type": "application/json",
            }
        );
        return res;
    } catch (error) {
        return Promise.reject(error);
    }
};

export const sendResetPasswordEmail = async (email) => {
    try {
        return await instance.post(
            "/user/send-reset-password-email",
            { email },
            { "content-type": "application/json" }
        );
    } catch (error) {
        return Promise.reject(error);
    }
};

export const validateCode = async ({ email, code }) => {
    try {
        return await instance.post(
            "/user/verify-reset-password-code",
            {
                email,
                code,
            },
            { "content-type": "application/json" }
        );
    } catch (error) {}
};

export const resetPassword = async ({ email, password }) => {
    try {
        return await publicInstance.post(`/user/reset-password`, {
            password,
            email,
        });
    } catch (error) {
        return Promise.reject(error);
    }
};
export const resetPasswordByEmail = async (password, email) => {
    try {
        return await privateInstance.put(
            `/user/resetPassword/${email}`,
            {
                newPassword: password,
                email: email,
            },
            {
                "content-type": "application/json",
            }
        );
    } catch (error) {
        return Promise.reject(error);
    }
};
export const getAllUser = async () => {
    try {
        return await privateInstance.get("/user/getAll?page=0&size=5");
    } catch (error) {
        return Promise.reject(error);
    }
};

export const getAllDeletedUser = async () => {
    try {
        return await privateInstance.get("/user/getAllDeleted?page=0&size=5");
    } catch (error) {
        return Promise.reject(error);
    }
};

export const getAllRole = async () => {
    try {
        return await privateInstance.get("/user/getAllRole");
    } catch (error) {
        return Promise.reject(error);
    }
};

export const getUserByName = async (userName, page, size, isDelete = false) => {
    try {
        return privateInstance.get(
            `/user/search?name=${userName}&isDeleted=${isDelete}&page=${page}&size=${size}`
        );
    } catch (error) {
        Promise.reject(error);
    }
};

export const getUserByRole = (role, page, size) => {
    try {
        return privateInstance.get(
            `/user/filter?role=${role}&page=${page}&size=${size}`
        );
    } catch (error) {
        Promise.reject(error);
    }
};

export const getUserByPage = async (page, size) => {
    try {
        return privateInstance.get(`/user/getAll?page=${page}&size=${size}`);
    } catch (error) {
        Promise.reject(error);
    }
};

export const softDeleteUser = async (id) => {
    try {
        const result = await privateInstance.put(`/user/delete/soft/${id}`);
        return result;
    } catch (error) {
        return Promise.reject(error);
    }
};
export const hardDeleteUser = async (id) => {
    try {
        const result = await privateInstance.delete(`/user/delete/hard/${id}`);
        return result;
    } catch (error) {
        return Promise.reject(error);
    }
};

export const restoreUserById = async (id) => {
    try {
        return privateInstance.put(`/user/restore/${id}`);
    } catch (error) {
        Promise.reject(error);
    }
};

export const getAdminDashBoard = async () => {
    try {
        return privateInstance.get("/user");
    } catch (error) {
        return Promise.reject(error);
    }
};

export const getUserInfo = async () => {
    try {
        return userInstance.get("/username");
    } catch (error) {
        return Promise.reject(error);
    }
};

export const logout = async () => {
    try {
        return userInstance.post("/logout");
    } catch (error) {
        return Promise.reject(error);
    }
};

export const getUserByEmail = async (email) => {
    try {
        return userInstance.get(`${email}`);
    } catch (error) {
        Promise.reject(error);
    }
};

export const updateProfile = async (user, avatar) => {
    const formData = new FormData();
    const json = JSON.stringify(user);
    const userBlob = new Blob([json], {
        type: "application/json",
    });
    formData.append("user", userBlob);
    formData.append("avatar", avatar);
    try {
        return await userInstance.putForm("/update", formData);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const updatePassword = async (passwords) => {
    try {
        return await userInstance.put("/update/password", passwords);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const getProgress = async (alias, courseId) => {
    try {
        return await userInstance.get(`/${alias}/progress/${courseId}`);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const updateLessonIds = async (alias, courseId, lessonIds) => {
    try {
        return await userInstance.put(
            `/${alias}/progress/${courseId}/updateLessonIds`,
            lessonIds
        );
    } catch (error) {
        return Promise.reject(error.response.data);
    }
};

export const getAllNotification = async (email, page = "0", size = "5") => {
    try {
        return await userInstance.get(
            `/${encodeURIComponent(
                email
            )}/notification/getAll?page=${page}&size=${size}`
        );
    } catch (error) {
        return Promise.reject(error);
    }
};

export const readNotification = async (email, id) => {
    if (email.includes("@")) {
        email = email.substring(0, email.lastIndexOf("@"));
    }
    try {
        return await userInstance.put(`${email}/notification/read/${id}`);
    } catch (error) {
        return Promise.reject(error);
    }
};
export const readAllNotifications = async (email) => {
    if (email.includes("@")) {
        email = email.substring(0, email.lastIndexOf("@"));
    }
    try {
        return await userInstance.put(`${email}/notification/readAll`);
    } catch (error) {
        return Promise.reject(error);
    }
};
export const removeAllNotifications = async (email) => {
    if (email.includes("@")) {
        email = email.substring(0, email.lastIndexOf("@"));
    }
    try {
        return await userInstance.delete(`/${email}/notification/removeAll`);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const getPaymentVNPAY = async ({ method, email, courseId }) => {
    try {
        return await userInstance.get(
            `create_payment/${method}/${email}/${courseId}`
        );
    } catch (error) {
        return Promise.reject(error);
    }
};

export const getListCourse = async (email) => {
    try {
        return await userInstance.get(`/course/getAll/${email}`);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const removeCommentById = async (email, cmtId) => {
    try {
        return await userInstance.delete(
            `/${encodeURIComponent(email)}/comment/delete/${cmtId}`
        );
    } catch (error) {
        return Promise.reject(error);
    }
};

export const getAllUserAndRole = async (isDelete = "false") => {
    try {
        return await privateInstance.get(
            `/user/getAllUserAndRole?isDeleted=${isDelete}`
        );
    } catch (error) {
        return Promise.reject(error);
    }
};

export const createPost = async (post, email) => {
    try {
        return await userInstance.post(`/${email}/post/create`, post);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const updatePost = async (post, email) => {
    try {
        return await userInstance.put(`/${email}/post/update`, post);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const getPostById = async (postId) => {
    try {
        return await userInstance.get(`/post/favorite/${postId}`);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const toggleSavePost = async (postId, email) => {
    try {
        return await userInstance.put(`/${email}/post/favorite/${postId}`);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const getPosts = async (email, isDeleted = false, page, size) => {
    try {
        return await userInstance.get(
            `/${email}/posts?deleted=${isDeleted}&page=${page}&size=${size}`
        );
    } catch (error) {
        return Promise.reject(error);
    }
};

export const getMyPostById = async (email, id) => {
    try {
        return await userInstance.get(`/${email}/posts/${id}`);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const deletePost = async (email, postId) => {
    try {
        return await userInstance.put(`/${email}/post/delete/${postId}`);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const restorePost = async (email, postId) => {
    try {
        return await userInstance.put(`/${email}/post/restore/${postId}`);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const getCoursesOfUser = async (email) => {
    try {
        return await userInstance.get(`/${email}/courses`);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const getBookMarkPosts = async (email) => {
    try {
        return await userInstance.get(`/${email}/posts/bookmark`);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const removeBookmark = async (email, postId) => {
    try {
        return await userInstance.put(
            `/${email}/post/removeBookmark/${postId}`
        );
    } catch (error) {
        return Promise.reject(error);
    }
};
