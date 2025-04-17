import toast from "react-hot-toast";

const SuccessToast = (text: string) => {
    toast.success(text, {
        style: {
            border: "1px solid #14532d",
            padding: "8px",
            color: "#14532d",
            backgroundColor: "#f9feff",
        },
        iconTheme: {
            primary: "#14532d",
            secondary: "#86efac",
        },
    });
};

export default SuccessToast;
