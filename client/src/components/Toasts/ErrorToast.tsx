import toast from "react-hot-toast";

const ErrorToast = (text: string) => {
    toast.error(text, {
        style: {
            border: "1px solid #7f1d1d",
            padding: "8px",
            color: "#7f1d1d",
            backgroundColor: "#f9feff",
        },
        iconTheme: {
            primary: "#7f1d1d",
            secondary: "#fca5a5",
        },
    });
};

export default ErrorToast;
