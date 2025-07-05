import { useEffect, useState } from "react";
import CreatePost from "../create";
import * as userService from "../../../api/apiService/userService";
import * as publicService from "../../../api/apiService/publicService";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { userSelector } from "../../../redux/selector";

function EditPost() {
    const { title } = useParams();
    const user = useSelector(userSelector);
    const [post, setPost] = useState({});

    useEffect(() => {
        const fetchApi = async () => {
            try {
                const result = await publicService.getPostByTitle(title);
                setPost(result.content);
            } catch (error) {
                console.log(error);
            }
        };
        fetchApi();
    }, [title, user?.email]);

    return (
        <div>
            <CreatePost initPost={post} isEdit></CreatePost>
        </div>
    );
}

export default EditPost;
