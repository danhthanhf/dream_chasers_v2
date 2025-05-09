import publicInstance, {
    authInstance,
    privateInstance,
    userInstance,
} from "../instance";

export const changeStatusPost = async (postId, status) => {
    try {
        const res = await userInstance.put(
            `/post/change-status/${postId}`,
            status,
            {
                headers: { "Content-Type": "application/json" },
            }
        );
        return res;
    } catch (error) {
        return Promise.reject(error);
    }
};

export const toggleLikePost = async (postId, email) => {
    try {
        return await userInstance.put(`/${email}/post/like/${postId}`);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const restoreListUser = async (ids) => {
    try {
        const result = await privateInstance.delete(`/user/restore/list`, {
            params: { ids: ids.join(",") },
        });
        return result.data;
    } catch (error) {
        return Promise.reject(error);
    }
};

export const softDeleteUsers = async (ids) => {
    try {
        const result = await privateInstance.delete(`/user/delete/soft/list`, {
            params: { ids: ids.join(",") },
        });
        return result.data;
    } catch (error) {
        return Promise.reject(error);
    }
};

export const enrollCourse = async (enrollDTO) => {
    try {
        return await userInstance.post("/enroll/course", enrollDTO);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const uploadAvatar = async (avatar) => {
    try {
        const formData = new FormData();
        formData.append("avatar", avatar);
        const result = await userInstance.postForm("/upload-avatar", formData);
        return result.data;
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
        const res = await privateInstance.post(
            "/user/create",
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
        return res.content;
    } catch (error) {
        return Promise.reject(error);
    }
};

export const login = async ({ email, password }) => {
    try {
        const res = await authInstance.post(
            "/login",
            {
                email,
                password,
            },
            { "content-type": "application/json" }
        );

        return res.data;
    } catch (error) {
        return Promise.reject(error);
    }
};

export const sendMail = async (email) => {
    try {
        const res = await authInstance.post(
            "/send-verify-email",
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
        return await userInstance.post(
            "/send-reset-password-email",
            { email },
            { "content-type": "application/json" }
        );
    } catch (error) {
        return Promise.reject(error);
    }
};

export const validateCode = async ({ email, code }) => {
    try {
        return await userInstance.post(
            "/verify-reset-password-code",
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
                password: password,
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
        const result = await privateInstance.get(
            "/user/getAllDeleted?page=0&size=5"
        );
        return result.content;
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

export const getUserByName = async (
    userName,
    role,
    page,
    size,
    isDelete = false
) => {
    try {
        const result = await privateInstance.get(
            `/user/search?name=${userName}&role=${role}&isDeleted=${isDelete}&page=${page}&size=${size}`
        );
        return result.content;
    } catch (error) {
        Promise.reject(error);
    }
};

export const getUserByRole = async (role, deleted = false, page, size) => {
    try {
        const result = await privateInstance.get(
            `/user/filter?role=${role}&isDeleted=${deleted}&page=${page}&size=${size}`
        );
        return result.content;
    } catch (error) {
        Promise.reject(error);
    }
};

export const getUserByPage = async (page, size) => {
    try {
        const result = await privateInstance.get(
            `/user/getAll?page=${page}&size=${size}`
        );
        return result.content;
    } catch (error) {
        Promise.reject(error);
    }
};

export const softDeleteUser = async (id, page = 0, size = 5) => {
    try {
        const result = await privateInstance.delete(
            `/user/delete/soft/${id}?page=${page}&size=${size}`
        );
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
        return privateInstance.delete(`/user/restore/${id}`);
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

export const getUserByEmail = async () => {
    try {
        const res = await userInstance.get("/profile");
        return res.content;
    } catch (error) {
        Promise.reject(error);
    }
};

export const getUserByEmailForAdmin = async (email) => {
    try {
        return await privateInstance.get(`/user/view?email=${email}`);
    } catch (error) {
        Promise.reject(error);
    }
};

export const updateProfile = async (user) => {
    try {
        const result = await userInstance.put("/update", user);
        return result.data;
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

export const getListCourse = async (email) => {
    try {
        return await userInstance.get(`/course/getAll/${email}`);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const removeCommentById = async (email, cmtId) => {
    try {
        return await userInstance.delete(`/comments/${cmtId}`);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const getAllUserAndRole = async (
    isDelete = false,
    page = 0,
    selected = 5
) => {
    try {
        const result = await privateInstance.get(
            `/user/getAllUserAndRole?isDeleted=${isDelete}&page=${page}&size=${selected}`
        );
        return result.content;
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

export const updatePost = async (post) => {
    try {
        return await userInstance.put(`/posts/update/${post.id}`, post);
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
