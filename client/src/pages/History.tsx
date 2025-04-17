import { useEffect, useState } from "react";
import historyService from "../services/historyService";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Summary } from "../lib/types";
import ErrorToast from "../components/Toasts/ErrorToast";
import isCustomError from "../lib/customError";

const History = () => {
    const [history, setHistory] = useState<Summary[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await historyService.getHistory();
                setHistory(res.history.reverse());
            } catch (error) {
                if (isCustomError(error)) {
                    ErrorToast(error.message);
                } else {
                    ErrorToast("Something went wrong");
                }
            }
            setIsLoading(false);
        };
        fetchHistory();
    }, []);

    if (!history || isLoading) {
        return (
            <div className="mt-16 p-3 md:mt-20 md:px-12 lg:px-24">
                <div className="mb-6 flex w-full justify-center md:mt-4">
                    <div className="bg-foreground mt-2 h-6 w-28 animate-pulse rounded-full"></div>
                </div>
                <div className="mb-8 grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <article className="border-foreground flex items-center justify-between gap-4 rounded-xl border px-3 py-4">
                        <div className="block w-full">
                            <div className="bg-foreground h-4 w-11/12 animate-pulse rounded-full"></div>
                            <div className="bg-foreground mt-2 h-4 w-1/2 animate-pulse rounded-full"></div>
                        </div>
                        <div className="bg-foreground animate-pulse rounded-lg p-4 md:p-5"></div>
                    </article>
                    <article className="border-foreground flex items-center justify-between gap-4 rounded-xl border px-3 py-4">
                        <div className="block w-full">
                            <div className="bg-foreground h-4 w-11/12 animate-pulse rounded-full"></div>
                            <div className="bg-foreground mt-2 h-4 w-1/2 animate-pulse rounded-full"></div>
                        </div>
                        <div className="bg-foreground animate-pulse rounded-lg p-4 md:p-5"></div>
                    </article>
                    <article className="border-foreground flex items-center justify-between gap-4 rounded-xl border px-3 py-4">
                        <div className="block w-full">
                            <div className="bg-foreground h-4 w-11/12 animate-pulse rounded-full"></div>
                            <div className="bg-foreground mt-2 h-4 w-1/2 animate-pulse rounded-full"></div>
                        </div>
                        <div className="bg-foreground animate-pulse rounded-lg p-4 md:p-5"></div>
                    </article>
                    <article className="border-foreground flex items-center justify-between gap-4 rounded-xl border px-3 py-4">
                        <div className="block w-full">
                            <div className="bg-foreground h-4 w-11/12 animate-pulse rounded-full"></div>
                            <div className="bg-foreground mt-2 h-4 w-1/2 animate-pulse rounded-full"></div>
                        </div>
                        <div className="bg-foreground animate-pulse rounded-lg p-4 md:p-5"></div>
                    </article>
                    <article className="border-foreground flex items-center justify-between gap-4 rounded-xl border px-3 py-4">
                        <div className="block w-full">
                            <div className="bg-foreground h-4 w-11/12 animate-pulse rounded-full"></div>
                            <div className="bg-foreground mt-2 h-4 w-1/2 animate-pulse rounded-full"></div>
                        </div>
                        <div className="bg-foreground animate-pulse rounded-lg p-4 md:p-5"></div>
                    </article>
                    <article className="border-foreground flex items-center justify-between gap-4 rounded-xl border px-3 py-4">
                        <div className="block w-full">
                            <div className="bg-foreground h-4 w-11/12 animate-pulse rounded-full"></div>
                            <div className="bg-foreground mt-2 h-4 w-1/2 animate-pulse rounded-full"></div>
                        </div>
                        <div className="bg-foreground animate-pulse rounded-lg p-4 md:p-5"></div>
                    </article>
                </div>
            </div>
        );
    }

    return (
        <div className="mt-16 p-3 md:mt-20 md:px-12 lg:px-24">
            {history && history.length > 0 ? (
                <>
                    <div className="mb-6 md:mt-4">
                        <h2 className="text-heading text-center">History</h2>
                    </div>
                    <div className="mb-8 grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {history.map((summary: Summary, index: number) => (
                            <article
                                className="border-body flex items-center justify-between gap-4 rounded-xl border p-3"
                                key={index}>
                                <div className="block">
                                    <h3 className="line-clamp-1">{summary?.title}</h3>
                                    <p>{summary?.channel}</p>
                                </div>
                                <Link
                                    to={`/summary/${summary?.id}`}
                                    className="bg-foreground shadow-primary-small border-body rounded-lg border p-1 md:p-2">
                                    <ArrowUpRight />
                                </Link>
                            </article>
                        ))}
                    </div>
                </>
            ) : (
                <div className="flex w-full flex-col justify-center text-center">
                    <h2>No summaries generated yet?</h2>
                    <p>
                        <Link to="/" className="text-accent underline">
                            Click here
                        </Link>{" "}
                        to get started!
                    </p>
                </div>
            )}
        </div>
    );
};

export default History;
