import React, { useEffect } from "react";

const CozeChat = () => {
    useEffect(() => {
        // Load the Coze SDK script
        const script = document.createElement("script");
        script.src =
            "https://sf-cdn.coze.com/obj/unpkg-va/flow-platform/chat-app-sdk/1.0.0-beta.4/libs/oversea/index.js";
        script.async = true;
        script.onload = () => {
            // Initialize the Coze WebChatClient after the script is loaded
            // new CozeWebSDK.WebChatClient({
            //     config: {
            //         bot_id: "7415654864975708161",
            //     },
            //     componentProps: {
            //         title: "Coze",
            //     },
            // });
        };
        document.body.appendChild(script);

        // Cleanup function to remove the script when the component is unmounted
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return <div id="coze-chat-container"></div>;
};

export default CozeChat;
