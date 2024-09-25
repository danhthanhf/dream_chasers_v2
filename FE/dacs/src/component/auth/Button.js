import { useMemo } from "react";

const Button = ({
    heroiconsOutlinedevicePho,
    inputFieldPassword,
    propAlignSelf,
    propFlex,
    link,
}) => {
    const buttonStyle = useMemo(() => {
        return {
            alignSelf: propAlignSelf,
            flex: propFlex,
        };
    }, [propAlignSelf, propFlex]);

    return (
        <a
            href={link}
            // onClick={functionClick}
            className="rounded-lg cursor-pointer py-3 px-5 bg-white-97 self-stretch rounded-3xs flex flex-row items-start justify-center gap-[14px] border-[1px] border-solid border-white-95"
            style={buttonStyle}
        >
            <div className="h-[25.5px] flex flex-col items-start justify-start pt-[1.5px] px-0 pb-0 box-border">
                <img
                    className="w-6 h-6 relative overflow-hidden shrink-0"
                    alt=""
                    src={heroiconsOutlinedevicePho}
                />
            </div>
            <div className="w-[230px] relative text-lg leading-[150%] font-medium font-be-vietnam-pro text-grey-15 text-left inline-block shrink-0">
                {inputFieldPassword}
            </div>
        </a>
    );
};
export default Button;