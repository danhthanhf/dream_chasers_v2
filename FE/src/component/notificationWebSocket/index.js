import { Stomp } from "@stomp/stompjs";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import notificationSlice from "../../redux/reducers/notificationSlice";
import SockJS from "sockjs-client";
import { toast } from "sonner";

export default function useNotificationWebSocket() {
    const userInfo = useSelector((state) => state.login.user);
    const dispatch = useDispatch();

    const onDisconnected = () => {
        console.log("Disconnect Websocket");
    };

    useEffect(() => {
        let stompClient = null;
        if (userInfo) {
            const sockjs = new SockJS("http://localhost:8080/ws");
            stompClient = Stomp.over(sockjs);
            stompClient.connect({}, () => {
                stompClient.subscribe(
                    `/user/${userInfo.email}/notification`,
                    (message) => {
                        const data = JSON.parse(message.body);
                        toast.info("You have a new notification");
                        console.log(data);
                        dispatch(notificationSlice.actions.add(data));
                    }
                );
            });
        }
        return () => {
            if (stompClient) {
                stompClient.disconnect(onDisconnected, {});
            }
        };
    }, [userInfo, dispatch]);
}
