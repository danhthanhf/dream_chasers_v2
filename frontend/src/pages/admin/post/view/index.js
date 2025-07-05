import ViewPost from "../../../Post/ViewPost";

const AdminViewPost = () => {
    return (
        <div>
            <ViewPost adminView={true}></ViewPost>
        </div>
    );
};

export default AdminViewPost;
