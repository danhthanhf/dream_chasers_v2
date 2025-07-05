import NavigationTopBar from "../../component/dashboard/NavigationTopBar";
import styles from "./HeaderAdmin.module.scss";
import logo from "../../assets/images/logo.png";
import clsx from "clsx";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import adminMenuSlice from "../../redux/reducers/adminMenuSlice";

function AdminHeader() {
    const dispatch = useDispatch();

    const showLeftMenu = () => {
        dispatch(adminMenuSlice.actions.toggleMenu());
    };

    return (
        <div
            className={clsx(
                "z-header flex fixed sm:w-full max-sm:w-full py-[13px] pl-[30px] pr-[100px] sm:px-4 max-sm:py-1 sm:py-1 max-sm:px-4 md:px-8 md:py-2",
                styles.dashContainer,
                {
                    [styles.dashboard3]: true,
                }
            )}
        >
            <main className={styles.homePage}>
                <section className={clsx(styles.contentArea, "xl:w-[1200px]")}>
                    <NavigationTopBar />
                </section>
            </main>
            <div
                className={clsx(styles.content, {
                    [styles.navigationSidebarMenuLi]: false,
                })}
            >
                <div className={styles.logoContainer}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="black"
                        onClick={showLeftMenu}
                        className="size-8 fill-black cursor-pointer "
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12"
                        />
                    </svg>
                    <Link to="/" className="sm:hidden max-sm:hidden ">
                        <div className={clsx(styles.logo)}>
                            <img
                                className={clsx(
                                    "size-12 mr-1.5 max-sm:size-8 sm:size-6 md:size-10"
                                )}
                                src={logo}
                                alt="Logo Dream Chasers"
                            />
                            <h3
                                className={clsx(
                                    styles.brightWeb,
                                    "sm:hidden  lg:block xl:block  max-sm:hidden"
                                )}
                            >
                                <span className="max-sm:hidden xl:block  lg:block sm:hidden">
                                    Dream
                                </span>
                                <span
                                    className={clsx(
                                        styles.stack,
                                        "max-sm:hidden xl:block   lg:block  sm:hidden"
                                    )}
                                >
                                    {" "}
                                    Chasers
                                </span>
                            </h3>
                        </div>
                    </Link>
                </div>

                <img
                    className={styles.dividerIcon}
                    loading="lazy"
                    alt=""
                    src="/divider.svg"
                />
            </div>
        </div>
    );
}

export default AdminHeader;
