import { formatDateTime, formatLikeCount, getTimeElapsed } from "../../util";
import { getProfileByEmail } from "../../api/apiService/publicService";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CourseCard } from "../../component/ladingPage/CourseCard";

const CartItem = ({ post }) => {
    console.log(post);
    return (
        <div className="py-2.5 card-shadow rounded-lg w-full h-full">
            <div className="flex px-4 gap-3 w-full">
                <img
                    className="rounded-full object-cover w-12 h-12"
                    src={
                        post?.userAvatar ||
                        "https://assets.minimals.cc/public/assets/images/mock/avatar/avatar-25.webp"
                    }
                    alt="avatar"
                />
                <div className="flex flex-col justify-center gap-1">
                    <h3 className="text-[15px] font-semibold">
                        {post?.userName}
                    </h3>
                    <span className="text-sm text-gray-500">
                        {formatDateTime(post?.createdAt) +
                            " - " +
                            getTimeElapsed(post?.createdAt)}
                    </span>
                </div>
            </div>
            <Link
                to={`/posts/${encodeURIComponent(post?.title)}`}
                className="hover:underline block py-3 px-4 text-[15px] text-black font-normal"
            >
                {post?.title}
            </Link>
            <div className="p-2">
                <img
                    className="rounded-lg w-full object-cover max-h-96"
                    src={post?.thumbnail}
                    alt=""
                />
            </div>
            <div className={clsx("px-2 my-2 flex gap-4 text-sm")}>
                <div className="flex gap-1.5 items-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                        role="img"
                        className="w-[22px] h-[22px]"
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
                    {formatLikeCount(post?.views)}
                </div>

                <div className="flex gap-1.5 items-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-[20px] h-[20px]"
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                    >
                        <path
                            fill="#919eab"
                            d="M19.07 4.93a10 10 0 0 0-16.28 11a1.06 1.06 0 0 1 .09.64L2 20.8a1 1 0 0 0 .27.91A1 1 0 0 0 3 22h.2l4.28-.86a1.26 1.26 0 0 1 .64.09a10 10 0 0 0 11-16.28ZM8 13a1 1 0 1 1 1-1a1 1 0 0 1-1 1m4 0a1 1 0 1 1 1-1a1 1 0 0 1-1 1m4 0a1 1 0 1 1 1-1a1 1 0 0 1-1 1"
                        ></path>
                    </svg>
                    {formatLikeCount(post?.totalComment || 0)}
                </div>

                <div className="flex gap-1.5 items-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-[22px] h-[22px]"
                        viewBox="0 0 24 24"
                    >
                        <path
                            fill="#919eab"
                            d="M2 9.137C2 14 6.02 16.591 8.962 18.911C10 19.729 11 20.5 12 20.5s2-.77 3.038-1.59C17.981 16.592 22 14 22 9.138S16.5.825 12 5.501C7.5.825 2 4.274 2 9.137"
                        ></path>
                    </svg>
                    {formatLikeCount(post?.likes)}
                </div>
            </div>
        </div>
    );
};

function Profile() {
    const { email } = useParams();
    const [profile, setProfile] = useState({});
    const [tab, setTab] = useState("post");

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await getProfileByEmail(email, tab);
                setProfile(res);
                console.log(res);
            } catch (error) {
                console.log(error);
            }
        };
        fetch();
    }, [email, tab]);

    return (
        <div className="container h-full">
            <div className="h-full p-6">
                <div className="card-shadow pb-16 rounded-lg">
                    <div className="relative">
                        <img
                            className="w-full h-56 object-cover rounded-t-lg"
                            src="https://assets.minimals.cc/public/assets/images/mock/cover/cover-4.webp"
                            alt="Profile Background"
                        ></img>
                        <div className="flex gap-3 absolute top-1/3 translate-y-1/2 left-6 w-full pt-2">
                            <img
                                className="w-32 h-32 rounded-full border-4 border-white"
                                src={
                                    profile?.avatarUrl ||
                                    "https://assets.minimals.cc/public/assets/images/mock/avatar/avatar-25.webp"
                                }
                                alt="avatar"
                            />
                            <div className="flex flex-col justify-end w-full">
                                <div className="flex justify-between w-full pr-9">
                                    <h1 className="text-2xl font-bold text-black mb-0">
                                        {profile?.firstName +
                                            " " +
                                            profile?.lastName}
                                    </h1>
                                    <div className="flex gap-10 mr-10 text-sm">
                                        {/* {user?.email !== email && (
                                            <button
                                                onClick={handleAddFriend}
                                                className="flex gap-1.5 text-white text-sm font-semibold bg-black px-2 py-1 items-center hover:opacity-80 transition-all relative rounded-lg"
                                            >
                                                <Ink></Ink>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth="1.5"
                                                    stroke="currentColor"
                                                    className="size-5"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                                    />
                                                </svg>
                                                Add friend
                                            </button>
                                        )} */}
                                        <div
                                            onClick={() => setTab("post")}
                                            className={clsx(
                                                "hover:opacity-80 transition-all cursor-pointer relative flex gap-2 items-center font-semibold border-b-2 py-1.5",
                                                {
                                                    "border-black text-black":
                                                        tab === "post",
                                                    "border-transparent text-gray-600":
                                                        tab !== "post",
                                                }
                                            )}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth="1.5"
                                                stroke="currentColor"
                                                className="size-6"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z"
                                                />
                                            </svg>
                                            Profile
                                        </div>
                                        <div
                                            onClick={() => setTab("course")}
                                            className={clsx(
                                                "hover:opacity-80 transition-all cursor-pointer relative flex gap-2 items-center font-semibold border-b-2 py-1.5",
                                                {
                                                    "border-black text-black":
                                                        tab === "course",
                                                    "border-transparent text-gray-600":
                                                        tab !== "course",
                                                }
                                            )}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={1.5}
                                                stroke="currentColor"
                                                className="size-6"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25"
                                                />
                                            </svg>
                                            Course
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-4 h-full p-1">
                    <div className="grid grid-cols-12 gap-4 h-32">
                        <div
                            className={clsx("flex flex-col gap-4", {
                                "col-span-0 hidden": tab === "course",
                                "lg:col-span-4 sm:col-span-12 md:col-span-12 max-sm:col-span-12 ":
                                    tab === "post",
                            })}
                        >
                            <div className="card-shadow rounded-lg px-6 py-3.5">
                                <h3 className="text-lg font-semibold">About</h3>
                                <div className="flex flex-col gap-2 text-[15px] text-gray-600 pt-3">
                                    {profile?.bio || "Not bio yet..."}
                                </div>
                            </div>
                            {/* <div className="card-shadow rounded-lg px-6 py-3.5">
                                <h3 className="text-lg font-semibold">
                                    Social
                                </h3>
                                <div className="flex flex-col gap-2 text-[15px] text-gray-600">
                                    Not bio yet...
                                </div>
                            </div> */}
                        </div>
                        <div
                            className={clsx("pb-10", {
                                "col-span-12": tab === "course",
                                "lg:col-span-8 sm:col-span-12 md:col-span-12 max-sm:col-span-12 ":
                                    tab === "post",
                            })}
                        >
                            <div className="gap-3 grid grid-cols-12">
                                {profile?.data?.map((item) => {
                                    return tab === "post" ? (
                                        <div className="col-span-12">
                                            <CartItem
                                                post={item}
                                                key={item.createdAt}
                                            ></CartItem>
                                        </div>
                                    ) : (
                                        <div className="lg:col-span-3 md:col-span-6 sm:col-span-6 max-sm:col-span-12">
                                            <CourseCard
                                                course={item}
                                                key={item.createdAt}
                                            ></CourseCard>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
