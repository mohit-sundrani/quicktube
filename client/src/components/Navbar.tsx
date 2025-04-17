import { Menu, X } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Navbar: React.FC = () => {
    const { isAuthLoading, user } = useAuth();

    const [navClass, setNavClass] = useState<string>("translate-x-full");
    const toggleNavbar = () => {
        if (navClass === "translate-x-full") {
            setNavClass("translate-x-0");
        } else {
            setNavClass("translate-x-full");
        }
    };

    if (isAuthLoading) {
        return (
            <header className="border-body bg-navbar inset-shadow-navbar fixed top-0 left-0 z-30 flex h-16 w-full items-center justify-between border-b p-3 saturate-150 backdrop-blur-xl select-none md:h-20 md:px-20">
                <div className="bg-foreground h-6 w-28 animate-pulse rounded-full"></div>
                <nav className="hidden md:block">
                    <ul className="bg-foreground h-4 w-60 animate-pulse rounded-full"></ul>
                </nav>
                <div className="bg-foreground h-6 w-28 animate-pulse rounded-full md:w-16"></div>
            </header>
        );
    }

    return (
        <header className="border-body bg-navbar inset-shadow-navbar fixed top-0 left-0 z-30 flex h-16 w-full items-center justify-between border-b p-3 saturate-150 backdrop-blur-xl select-none md:h-20 md:px-20">
            <Link to="/">
                <h2 className="text-accent">QuickTube</h2>
            </Link>
            <nav className="flex">
                <ul
                    className={`bg-foreground absolute top-0 left-0 flex h-svh w-svw md:static ${navClass} flex-col justify-center gap-8 text-center transition-transform ease-in-out md:top-auto md:left-auto md:h-auto md:w-auto md:translate-0 md:flex-row md:bg-transparent md:text-inherit`}
                    onClick={toggleNavbar}>
                    <li className="nav-link">
                        <Link to="/">Home</Link>
                    </li>
                    {user ? (
                        <>
                            <li className="nav-link">
                                <Link to="/history">History</Link>
                            </li>
                            <li className="nav-link">
                                <Link to="/signout">Signout</Link>
                            </li>
                        </>
                    ) : (
                        <>
                            <li className="nav-link">
                                <Link to="/signin">Signin</Link>
                            </li>
                        </>
                    )}
                </ul>
            </nav>
            <div className="flex flex-row gap-4">
                {user ? (
                    <p className="bg-foreground rounded-lg px-3 py-1 md:px-4 md:py-2">
                        <abbr
                            title="1 credit = 1 summary. Your credits refresh every 24 hours."
                            className="no-underline">
                            {user?.credits} credits
                        </abbr>
                    </p>
                ) : (
                    <Link
                        to="/signup"
                        className="bg-accent text-primary rounded-lg px-2 py-1 md:rounded-xl md:px-3 md:py-2">
                        Signup
                    </Link>
                )}
                <button type="button" className="z-40 block md:hidden" onClick={toggleNavbar}>
                    {navClass === "translate-x-full" ? <Menu /> : <X />}
                </button>
            </div>
        </header>
    );
};

export default Navbar;
