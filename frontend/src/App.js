import { NextUIProvider } from "@nextui-org/react";
import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
    Outlet,
} from "react-router-dom";
import {
    publicRoutes,
    adminRoutes,
    userRoutes,
    authRoutes,
    instructorRoutes,
} from "./router";
import styles from "./App.module.scss";
import Header from "./layout/header";
import LeftNavDash from "./component/dashboard/leftNavDash";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Interceptors from "./Interceptor";
import loginSlice from "./redux/reducers/loginSlice";
import Footer from "./layout/footer";
import { InstructorNav } from "./pages/user/instructor";
import InstructorHeader from "./layout/header/instructor";
import { instructorMenuSelector, adminMenuSelector } from "./redux/selector";
import websocketService from "./service/WebsocketService";

const PrivateWrapper = ({ isAuthenticated }) => {
    const dispatch = useDispatch();
    if (isAuthenticated) {
        return <Outlet></Outlet>;
    } else {
        dispatch(loginSlice.actions.setLogout());
        sessionStorage.setItem("prevPath", window.location.pathname);
        return <Navigate to="/login" />;
    }
};

const LoggedWrapper = ({ isAuthenticated }) => {
    if (isAuthenticated) {
        return <Navigate to="/"></Navigate>;
    } else {
        return <Outlet></Outlet>;
    }
};

function App() {
    const isLoggedIn = useSelector((state) => state.login.isLogin);
    const [isLogged, setIsLogged] = useState(isLoggedIn);
    const adminShow = useSelector(adminMenuSelector);
    const instructorShow = useSelector(instructorMenuSelector);
    useEffect(() => {
        if (sessionStorage.getItem("token") !== null) {
            setIsLogged(true);
            websocketService.connect(sessionStorage.getItem("token"));
        } else {
            setIsLogged(false);
        }
    }, [isLoggedIn]);

    return (
        <div className={clsx("App ", {})}>
            <MantineProvider>
                <NextUIProvider>
                    <Interceptors></Interceptors>
                    <div className="flex flex-col h-[100vh]">
                        <Routes>
                            {publicRoutes.map((route, index) => (
                                <Route
                                    exact
                                    key={index}
                                    path={route.path}
                                    element={
                                        <>
                                            <Header />
                                            <div className={clsx("pt-header")}>
                                                <route.component />
                                            </div>
                                            {route.noFooter ? null : <Footer />}
                                        </>
                                    }
                                />
                            ))}

                            {authRoutes.map((route, index) => (
                                <Route
                                    key={index}
                                    element={
                                        <LoggedWrapper
                                            isAuthenticated={isLogged}
                                        ></LoggedWrapper>
                                    }
                                >
                                    <Route
                                        path={route.path}
                                        exact
                                        key={index}
                                        element={
                                            <>
                                                {!route.path.includes(
                                                    "/courses/detail"
                                                ) && <Header />}
                                                <div
                                                    className={clsx(
                                                        "pt-header"
                                                    )}
                                                >
                                                    <route.component />
                                                </div>
                                                <Footer />
                                            </>
                                        }
                                    />
                                </Route>
                            ))}

                            {instructorRoutes.map((route, index) => (
                                <Route
                                    exact
                                    path={route.path}
                                    key={index}
                                    element={
                                        <>
                                            <InstructorHeader></InstructorHeader>
                                            <InstructorNav></InstructorNav>
                                            <div
                                                className={clsx(
                                                    "transition-all overflow-h-auo",
                                                    {
                                                        "ml-[220px]":
                                                            instructorShow,
                                                        "ml-[74px]":
                                                            !instructorShow,
                                                    }
                                                )}
                                            >
                                                <route.component />
                                            </div>
                                        </>
                                    }
                                ></Route>
                            ))}

                            {userRoutes.map((route, index) => (
                                <Route
                                    key={index}
                                    element={
                                        <PrivateWrapper
                                            isAuthenticated={isLogged}
                                        ></PrivateWrapper>
                                    }
                                >
                                    <Route
                                        path={route.path}
                                        exact
                                        key={index}
                                        element={
                                            <>
                                                <>
                                                    {!/^\/course\/[^/]+$/.test(
                                                        route.path
                                                    ) && <Header />}
                                                </>
                                                <div
                                                    className={clsx({
                                                        "pt-header":
                                                            !/^\/course\/[^/]+$/.test(
                                                                route.path
                                                            ),
                                                    })}
                                                >
                                                    <route.component />
                                                </div>
                                            </>
                                        }
                                    />
                                </Route>
                            ))}

                            {adminRoutes.map((route, index) => (
                                <Route
                                    key={index}
                                    element={
                                        <PrivateWrapper
                                            isAuthenticated={isLogged}
                                        ></PrivateWrapper>
                                    }
                                >
                                    <Route
                                        path={route.path}
                                        exact
                                        key={index}
                                        element={
                                            <>
                                                <Header></Header>
                                                <div className="flex bg-white">
                                                    <LeftNavDash></LeftNavDash>
                                                    <div
                                                        className={clsx(
                                                            styles.adminContent,
                                                            "transition-all overflow-h-auo flex-1",
                                                            {
                                                                "ml-[220px]":
                                                                    adminShow,
                                                                "ml-[74px]":
                                                                    !adminShow,
                                                            }
                                                        )}
                                                    >
                                                        <route.component />
                                                    </div>
                                                </div>
                                            </>
                                        }
                                    />
                                </Route>
                            ))}
                        </Routes>
                    </div>
                </NextUIProvider>
            </MantineProvider>
        </div>
    );
}

export default App;
