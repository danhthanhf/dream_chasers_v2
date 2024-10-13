import PostItem from "./PostItem";

function ListPost({ data }) {
    return (
        <div className="grid grid-cols-4 gap-4">
            {data &&
                data.length > 0 &&
                data.map((post) => <PostItem key={post.id} post={post} />)}
        </div>
    );
}

export default ListPost;
