import CourseCard from "../../component/ladingPage/CourseCard.js";
import SlideShow from "../../component/ladingPage/SlideShow.js";
import loginSlice from "../../redux/reducers/loginSlice.js";
import { useDispatch } from "react-redux";
import * as publicService from "../../api/apiService/publicService.js";
import { useEffect, useState } from "react";
import PostItem from "../../component/PostItem.js";
import { Swiper, SwiperSlide } from "swiper/react";
import {
    A11y,
    Autoplay,
    Navigation,
    Pagination,
    Scrollbar,
} from "swiper/modules";
import Ink from "react-ink";

function LandingPageComponent() {
    const dispatch = useDispatch();
    const [posts, setPosts] = useState([]);
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");
        const lastName = params.get("lastName");
        const email = params.get("email");
        const avatarUrl = params.get("avatarUrl");
        if (token) {
            dispatch(
                loginSlice.actions.setLogin({
                    token,
                    user: {
                        lastName,
                        email,
                        avatarUrl,
                        firstName: "",
                    },
                })
            );
        }
        const fetchApi = async () => {
            try {
                const result = await publicService.getPosts(0, 8);

                setPosts(result.posts);
            } catch (error) {
                console.log(error);
            }
        };
        fetchApi();
    }, [dispatch]);

    return (
        <div className="flex flex-col items-center pt-5 bg-white">
            <main className="w-full">
                {/* <section className="p-4 sm:px-5 sm:py-10 mx-auto lg:max-w-[1200px] max-lg:w-[1200px]">
                    <SlideShow />
                </section> */}
                <div className="flex items-center justify-center">
                    <CourseCard />
                </div>
                <div>
                    <div className="p-4 sm:px-5 sm:py-10 mx-auto lg:max-w-[1200px] max-lg:w-[1200px]">
                        <div className="flex justify-between">
                            <h2 className="text-xl font-semibold hover:underline hover:opacity-85 cursor-pointer transition-all">
                                #Featured Post
                            </h2>
                            <div className="flex gap-3">
                                <button
                                    id="featur=e-post-prev"
                                    type="button"
                                    className="rounded-full px-2 flex relative items-center "
                                >
                                    <Ink />
                                    <svg
                                        focusable="false"
                                        aria-hidden="true"
                                        viewBox="0 0 24 24"
                                        className="w-[22px] h-[22px]"
                                    >
                                        <path
                                            fill="black"
                                            fillRule="evenodd"
                                            d="M15.488 4.43a.75.75 0 0 1 .081 1.058L9.988 12l5.581 6.512a.75.75 0 1 1-1.138.976l-6-7a.75.75 0 0 1 0-.976l6-7a.75.75 0 0 1 1.057-.081"
                                            clipRule="evenodd"
                                        ></path>
                                    </svg>
                                </button>

                                <button
                                    type="button"
                                    id="feature-post-next"
                                    className="rounded-full px-2 flex relative items-center"
                                >
                                    <Ink />
                                    <svg
                                        focusable="false"
                                        className="w-[22px] h-[22px]"
                                        aria-hidden="true"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            fill="black"
                                            fillRule="evenodd"
                                            d="M8.512 4.43a.75.75 0 0 1 1.057.082l6 7a.75.75 0 0 1 0 .976l-6 7a.75.75 0 0 1-1.138-.976L14.012 12L8.431 5.488a.75.75 0 0 1 .08-1.057"
                                            clipRule="evenodd"
                                        ></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <Swiper
                            spaceBetween={30}
                            modules={[
                                Navigation,
                                Pagination,
                                Scrollbar,
                                A11y,
                                Autoplay,
                            ]}
                            slidesPerView={4}
                            className="py-4 px-1"
                            autoplay={{
                                delay: 1500,
                                disableOnInteraction: false,
                            }}
                            navigation={{
                                nextEl: "#feature-post-next",
                                prevEl: "#feature-post-prev",
                            }}
                        >
                            {posts &&
                                posts.map((post) => (
                                    <SwiperSlide key={post.id}>
                                        <PostItem post={post}></PostItem>
                                    </SwiperSlide>
                                ))}
                        </Swiper>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default LandingPageComponent;
