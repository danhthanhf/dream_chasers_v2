import { useEffect, useState } from "react";
import CreatePost from "../create";
import { useParams } from "react-router-dom";
import * as UserApi from "../../../api/apiService/authService";
import { useSelector } from "react-redux";

function EditPost() {
    const { id } = useParams();
    const user = useSelector((state) => state.login.user);
    const [post, setPost] = useState({});

    useEffect(() => {
        const fetchApi = async () => {
            try {
                const result = await UserApi.getMyPostById(user.email, id);
                setPost(result.content);
            } catch (error) {
                console.log(error);
            }
        };
        fetchApi();
    }, [id, user.email]);

    return (
        <div>
            <CreatePost postInit={post} isEdit></CreatePost>
        </div>
    );
}

export default EditPost;
