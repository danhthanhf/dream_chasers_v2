import { Link } from "react-router-dom";
import styles from "./NotFound.module.scss";
import NotFoundImg from "../../assets/images/404.png";
const NotFoundPage = () => {
    return (
        <div className={styles.dashpropsPages404Error}>
            <img
                className={styles.errorImgIcon}
                loading="lazy"
                alt=""
                src={NotFoundImg}
            />
            <div className={styles.mainLayout}>
                <div className={styles.frameParent}>
                    <div className={styles.oopsThePageNotFoundParent}>
                        <h1 className={styles.oopsThePage}>
                            Oops! the page not found.
                        </h1>
                        <div
                            className={styles.orSimplyLeverageTheExpertiWrapper}
                        >
                            <div className={styles.orSimplyLeverage}>
                                Or simply leverage the expertise of our
                                consultation team.
                            </div>
                        </div>
                    </div>
                    <div className={styles.primaryWrapper}>
                        <button className={styles.primary}>
                            <div className={styles.primary1}>
                                <Link className={styles.buttons} to="/">
                                    Go Home
                                </Link>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotFoundPage;
