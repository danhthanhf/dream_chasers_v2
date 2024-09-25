import * as React from "react";

export default function Imagelandingpage() {
    return (
        <main className="flex justify-center items-center px-16 py-20 mt-40 w-full max-w-screen-xl rounded-xl border-solid border-[16px] border-neutral-100 max-md:px-5 max-md:mt-10 max-md:max-w-full">
            <div className="flex justify-center items-center px-2.5 mt-56 mb-40 border-4 border-solid bg-white bg-opacity-20 border-white border-opacity-30 h-[54px] rounded-[68px] w-[54px] max-md:my-10">
                <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/261804cbee74c42a8269a4b836f398757e9f80c68f22d0b3e89abb48f0cadc48?apiKey=9349475655ee4a448868f824f5feb11d&"
                    alt="Decorative image"
                    className="w-full aspect-square"
                />
            </div>
        </main>
    );
}
