import clsx from "clsx";
import styles from "./MainDash.module.scss";
import CoursesComponent from "../../ladingPage/CourseCard";
import { adminRoutes } from "../../../router/index";
import { Routes, Route, Router } from "react-router-dom";
function MainDash() {
    return (
        <Router>
            <div className={clsx(styles.wrapper)}>
                <Routes>
                    {adminRoutes.map((route, index) => {
                        const Page = route.component;
                        return (
                            <Route
                                key={index}
                                path={route.path}
                                element={<Page></Page>}
                            ></Route>
                        );
                    })}
                </Routes>
                <div className={clsx(styles.container)}>
                    <div className={clsx(styles.listProduct)}>
                        <CoursesComponent></CoursesComponent>
                    </div>
                </div>
            </div>
        </Router>
    );
}

export default MainDash;
