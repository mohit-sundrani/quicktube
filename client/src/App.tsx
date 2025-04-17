import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./providers/AuthProvider";
import Home from "./pages/Home";
import History from "./pages/History";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import Signout from "./pages/Signout";
import Summary from "./pages/Summary";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import ClickSpark from "./components/ReactBits/Animations/ClickSpark/ClickSpark";
import { Toaster } from "react-hot-toast";

const App = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <ClickSpark sparkColor="#00535c">
                    <Navbar />
                    <Toaster position="top-center" containerClassName="mt-20 z-30 absolute" />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/history" element={<History />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/signin" element={<Signin />} />
                        <Route path="/signout" element={<Signout />} />
                        <Route path="/summary/:id" element={<Summary />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </ClickSpark>
            </AuthProvider>
        </BrowserRouter>
    );
};

export default App;
