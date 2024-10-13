import { Link } from "react-router-dom";

function PostItem({ post }) {
    const date = new Date(post.createdAt).toLocaleDateString();
    function formatNumber(num) {
        if (num >= 1000) {
            return (num / 1000).toFixed(2) + "k";
        }
        return num.toString();
    }
    const handleClick = () => {
        window.scrollTo(0, 0);
    };

    return (
        <div className="rounded-2xl shadow-md overflow-hidden w-full">
            <div className="-mb-6">
                <img loading="lazy" src={post && post.thumbnail} alt="" />
            </div>
            <div className="relative">
                <div className="flex gap-3 mb-3">
                    <svg
                        fill="none"
                        viewBox="0 0 144 62"
                        className="w-[88px] h-9 text-white absolute top-[3px]"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="m111.34 23.88c-10.62-10.46-18.5-23.88-38.74-23.88h-1.2c-20.24 0-28.12 13.42-38.74 23.88-7.72 9.64-19.44 11.74-32.66 12.12v26h144v-26c-13.22-.38-24.94-2.48-32.66-12.12z"
                            fill="currentColor"
                            fillRule="evenodd"
                        ></path>
                    </svg>
                    <div className="z-10 mt-1.5 px-6">
                        <img
                            src="https://api-prod-minimal-v610.pages.dev/assets/images/avatar/avatar-16.webp"
                            alt=""
                            className="w-10 h-10 rounded-full"
                        />
                        <div className="font-bold text-sm flex gap-2 items-center mt-2">
                            <div className="">{post && post.userName}</div>
                            <span className="px-1">-</span>
                            <div className="text-gray-500 font-medium text-[13px]">
                                {post && date}
                            </div>
                        </div>
                    </div>
                </div>

                <Link
                    to={`/posts/${decodeURIComponent(post.title)}`}
                    onClick={handleClick}
                    className="px-6 text-sm text-black hover:underline cursor-pointer font-semibold line-clamp-2"
                >
                    {post && post.title}
                </Link>
                <div className="p-6 flex text-xs text-gray-500 gap-3 justify-end">
                    <div className="flex gap-2 items-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                            role="img"
                            className="w-[20px] h-[20px]"
                            viewBox="0 0 24 24"
                            width={"1em"}
                        >
                            <path
                                fill="#919eab"
                                d="M9.75 12a2.25 2.25 0 1 1 4.5 0a2.25 2.25 0 0 1-4.5 0"
                            ></path>
                            <path
                                fill="#919eab"
                                fillRule="evenodd"
                                d="M2 12c0 1.64.425 2.191 1.275 3.296C4.972 17.5 7.818 20 12 20s7.028-2.5 8.725-4.704C21.575 14.192 22 13.639 22 12c0-1.64-.425-2.191-1.275-3.296C19.028 6.5 16.182 4 12 4S4.972 6.5 3.275 8.704C2.425 9.81 2 10.361 2 12m10-3.75a3.75 3.75 0 1 0 0 7.5a3.75 3.75 0 0 0 0-7.5"
                                clipRule="evenodd"
                            ></path>
                        </svg>{" "}
                        {post && formatNumber(post.views)}
                    </div>

                    <div className="flex gap-2 items-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-[17px] h-[17px]"
                            aria-hidden="true"
                            viewBox="0 0 24 24"
                        >
                            <path
                                fill="#919eab"
                                d="M19.07 4.93a10 10 0 0 0-16.28 11a1.06 1.06 0 0 1 .09.64L2 20.8a1 1 0 0 0 .27.91A1 1 0 0 0 3 22h.2l4.28-.86a1.26 1.26 0 0 1 .64.09a10 10 0 0 0 11-16.28ZM8 13a1 1 0 1 1 1-1a1 1 0 0 1-1 1m4 0a1 1 0 1 1 1-1a1 1 0 0 1-1 1m4 0a1 1 0 1 1 1-1a1 1 0 0 1-1 1"
                            ></path>
                        </svg>
                        {post && formatNumber(post.totalComment)}
                    </div>
                    <div className="flex gap-2 items-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-[20px] h-[20px]"
                            viewBox="0 0 24 24"
                        >
                            <path
                                fill="#919eab"
                                d="M2 9.137C2 14 6.02 16.591 8.962 18.911C10 19.729 11 20.5 12 20.5s2-.77 3.038-1.59C17.981 16.592 22 14 22 9.138S16.5.825 12 5.501C7.5.825 2 4.274 2 9.137"
                            ></path>
                        </svg>
                        {post && formatNumber(post.likes)}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PostItem;
