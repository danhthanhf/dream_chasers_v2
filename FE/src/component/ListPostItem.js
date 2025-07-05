import PostItem from "./PostItem";

function ListPost({ authorView = false, data, cols = 4, gap = 4 }) {
    return (
        <div className={`grid grid-cols-${cols} gap-${gap}`}>
            {data &&
                data.length > 0 &&
                data.map((post, index) => (
                    <PostItem
                        authorView={authorView}
                        key={post?.id + index}
                        post={post}
                    />
                ))}
        </div>
    );
}

export default ListPost;
