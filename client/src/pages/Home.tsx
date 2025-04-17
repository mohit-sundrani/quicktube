import { Sparkles } from "lucide-react";
import Squares from "../components/ReactBits/Backgrounds/Squares/Squares";
import Input from "../components/Input";
import Select from "../components/Select";
import { useState } from "react";
import Summarizing from "../components/Summarizing";
import { Link, useNavigate } from "react-router-dom";
import summaryService from "../services/summaryService";
import ErrorToast from "../components/Toasts/ErrorToast";
import SuccessToast from "../components/Toasts/SuccessToast";
import { useAuth } from "../hooks/useAuth";
import isCustomError from "../lib/customError";

interface Details {
    link: string;
    tone: string;
    style: string;
    depth: string;
    length: number;
}

const Home: React.FC = () => {
    const navigate = useNavigate();

    const { user } = useAuth();

    const [details, setDetails] = useState<Details>({
        link: "",
        tone: "PROFESSIONAL",
        style: "PARAGRAPHS",
        depth: "COMPREHENSIVE",
        length: 250,
    });
    const [isSummarizing, setIsSummarizing] = useState<boolean>(false);

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        setDetails((prevDetails) => ({
            ...prevDetails,
            [event.target.name]: event.target.value,
        }));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSummarizing(true);

        try {
            const res = await summaryService.createSummary(
                details.link,
                details.tone,
                details.style,
                details.depth,
                details.length
            );
            if (user) {
                user.credits = user.credits - 1;
            }
            SuccessToast(res.message);
            navigate(`/summary/${res.id}`);
        } catch (error) {
            setIsSummarizing(false);
            if (isCustomError(error)) {
                ErrorToast(error.message);
            } else {
                ErrorToast("Something went wrong");
            }
        }
    };

    if (isSummarizing) {
        return <Summarizing />;
    }

    return (
        <>
            <div className="absolute top-0 left-0 -z-10 h-svh w-svw opacity-30">
                <Squares direction="diagonal" speed={0.5} squareSize={50} />
            </div>
            <div className="top-0 left-0 flex h-svh w-svw p-3 md:p-0">
                <div className="block h-full w-full content-center justify-center text-center">
                    <h1 className="text-accent !important my-1 text-3xl">QuickTube</h1>
                    <p className="my-1">A powerful web tool that transforms long YouTube videos into summaries.</p>
                    <form
                        onSubmit={handleSubmit}
                        className="my-2 flex w-full content-center items-center justify-center">
                        <Input
                            inputPlaceholder="Enter youtube link..."
                            buttonText="Summarize"
                            ButtonIcon={Sparkles}
                            name="link"
                            onChange={handleChange}
                        />
                    </form>
                    <div className="my-2 flex w-full flex-col content-center items-center justify-center gap-2 md:flex-row md:gap-4">
                        <Select
                            name="tone"
                            options={["Professional", "Casual", "Friendly"]}
                            onChange={handleChange}
                            value={details.tone}
                        />
                        <Select
                            name="style"
                            options={["Paragraphs", "Points"]}
                            onChange={handleChange}
                            value={details.style}
                        />
                        <Select
                            name="depth"
                            options={["Comprehensive", "Concise"]}
                            onChange={handleChange}
                            value={details.depth}
                        />
                        <Select
                            name="length"
                            options={[250, 500, 750, 1000]}
                            onChange={handleChange}
                            value={details.length}
                        />
                    </div>
                </div>
            </div>
            <div className="absolute bottom-4 flex w-full max-w-full justify-center">
                <p className="bg-foreground border-body shadow-primary -translate-1 rounded-xl border p-3 text-sm md:text-base">
                    Designed and Developed with ♥️ by{" "}
                    <Link to="https://mohit-sundrani.is-a.dev/" target="_blank" className="text-accent underline">
                        Mohit Sundrani
                    </Link>
                </p>
            </div>
        </>
    );
};

export default Home;
