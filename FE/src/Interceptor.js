import { useNavigate } from "react-router-dom";
import { injectNavigate } from "./api/instance";
import { useEffect } from "react";

function Interceptors() {
    const navigate = useNavigate();
    useEffect(() => {
        injectNavigate(navigate);
    }, []);

    return <></>;
}

export default Interceptors;
