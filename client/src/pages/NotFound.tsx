import { Link } from "react-router-dom";

const NotFound: React.FC = () => {
    return (
        <div className="fixed top-0 left-0 flex h-svh w-svw flex-col items-center justify-center text-center">
            <h2 className="text-heading">Error 404: Page not found</h2>
            <p>
                Lost? No issues we&apos;ve got you covered! Let&apos;s head{" "}
                <Link to="/" className="text-accent underline">
                    Home
                </Link>
            </p>
        </div>
    );
};

export default NotFound;
