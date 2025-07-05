import styles from "./CardSatiscal.module.scss";
import clsx from "clsx";

function CardStatiscal({
    title = "Total Active Users",
    amount = 13123400,
    icon,
    currency,
}) {
    return (
        <div className={clsx(styles.wrap, "b-shadow-sm ")}>
            <div className="row p-3">
                <div className="text-sm">
                    <div className="flex gap-2 items-center">
                        {icon}
                        <div className="font-semibold flex text-xl items-center text-medium">
                            {title}
                        </div>
                    </div>
                    <div
                        className={clsx(
                            "text-end font-bold self-center text-3xl mb-1 mt-3"
                        )}
                    >
                        {amount.toLocaleString()} {currency}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CardStatiscal;
