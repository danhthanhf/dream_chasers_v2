import { useNavigate } from "react-router-dom";
import { injectNavigate } from "./api/instance";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

function Interceptors() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    useEffect(() => {
        injectNavigate(navigate, dispatch);
    }, []);

    return <></>;
}

export default Interceptors;
