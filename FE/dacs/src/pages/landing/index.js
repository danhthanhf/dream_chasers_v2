import * as React from "react";
import CourseSection from "../../component/ladingComponent/CourseSection.js";
import CourseCard from "../../component/ladingComponent/CourseCard.js";
import SlideShow from "../../component/ladingComponent/SlideShow.js";
import Footer from "../../layout/footer/index.js";
import loginSlice from "../../redux/reducers/loginSlice.js";
import { useDispatch } from "react-redux";

function LandingPageComponent() {
    const dispatch = useDispatch();
    React.useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");
        const lastName = params.get("lastName");
        const email = params.get("email");
        const avatar = params.get("avatar");
        if (token) {
            dispatch(
                loginSlice.actions.setLogin({
                    token,
                    user: {
                        lastName,
                        email,
                        avatar,
                        firstName: "",
                    },
                })
            );
        }
    }, []);
    return (
        <div className="flex flex-col items-center pt-5 bg-neutral-100">
            <main className="w-full">
                <div className="relative mx-auto max-w-screen-xl overflow-hidden my-4 rounded-xl max-sm:px-3 md:px-6">
                    <SlideShow />
                </div>
                <CourseSection />
                <hr />
                <div className="flex items-center justify-center">
                    <CourseCard />
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default LandingPageComponent;
