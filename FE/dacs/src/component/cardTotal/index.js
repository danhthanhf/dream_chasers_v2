import styles from "./CardSatiscal.module.scss";
import clsx from "clsx";

function CardStatiscal({
    title = "Total Active Users",
    prevAmount = 12000,
    amount = 13100,
    up = true,
    currency,
}) {
    return (
        <div className={clsx(styles.wrap, " b-shadow-sm ")}>
            <div className="row p-3">
                <div className="text-sm">
                    <div className="font-medium mb-2 flex items-center">
                        {title}{" "}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                            role="img"
                            fill="#22c55e"
                            className={clsx(
                                "w-6 h-6 ml-1 component-iconify MuiBox-root css-v0h3dx iconify iconify--solar",
                                { [styles.up]: up }
                            )}
                            viewBox="0 0 24 24"
                        >
                            <path
                                fill="currentColor"
                                d="M5 17.75a.75.75 0 0 1-.488-1.32l7-6a.75.75 0 0 1 .976 0l7 6A.75.75 0 0 1 19 17.75z"
                                opacity=".5"
                            ></path>
                            <path
                                fill="currentColor"
                                fillRule="evenodd"
                                d="M4.43 13.488a.75.75 0 0 0 1.058.081L12 7.988l6.512 5.581a.75.75 0 1 0 .976-1.138l-7-6a.75.75 0 0 0-.976 0l-7 6a.75.75 0 0 0-.081 1.057"
                                clipRule="evenodd"
                            ></path>
                        </svg>
                    </div>
                    <div
                        className={clsx("text-end font-bold self-center", styles.amount)}
                    >
                        {amount.toLocaleString()} {currency}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CardStatiscal;
