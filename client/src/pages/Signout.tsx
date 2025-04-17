import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import authService from "../services/authService";
import SuccessToast from "../components/Toasts/SuccessToast";
import { useNavigate } from "react-router-dom";

const Signout = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            authService.signout();
            navigate("/signin");
            SuccessToast("Logged out");
        } else {
            navigate("/signin");
        }
    }, [isAuthenticated, navigate]);
    return <div>Signout</div>;
};

export default Signout;
