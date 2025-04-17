import { useEffect, useRef, useState } from "react";
import { marked } from "marked";
import { useParams } from "react-router-dom";
import summaryService from "../services/summaryService";
import { Summary as SummaryType } from "../lib/types";
import isCustomError from "../lib/customError";

const Summary: React.FC = () => {
    const { id } = useParams();

    const summaryRef = useRef<HTMLDivElement | null>(null);

    const [summary, setSummary] = useState<SummaryType | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSummary = async () => {
            if (id) {
                try {
                    const res = await summaryService.getSummary(id);
                    setSummary(res.summary);
                    setIsLoading(false);
                } catch (error) {
                    setIsLoading(false);
                    if (isCustomError(error)) {
                        setError(error.message);
                    } else {
                        setError("Something went wrong");
                    }
                }
            }
        };
        fetchSummary();
    }, [id]);

    useEffect(() => {
        if (summaryRef.current && summary?.content) {
            summaryRef.current.innerHTML = marked.parse(summary.content) as string;
        }
    }, [summary]);

    if (error) {
        return (
            <div className="fixed top-0 left-0 flex h-svh w-svw flex-col items-center justify-center text-center">
                <h2 className="text-heading">{error}</h2>
            </div>
        );
    }

    if (!summary || !summary.content || isLoading) {
        return (
            <article className="mt-20 p-3 md:mt-24 md:px-12 lg:px-24">
                <div className="mb-8 flex w-full flex-col gap-6 md:flex-row">
                    <div className="block w-full md:w-4/12">
                        <figure className="bg-foreground w-[calc(100%-6px)] animate-pulse rounded-3xl pt-[56.25%] md:w-full md:-translate-1.5"></figure>
                        <div className="md:-ml-1.5">
                            <div className="bg-foreground mt-2 h-6 w-full animate-pulse rounded-full"></div>
                            <div className="bg-foreground mt-2 h-4 w-52 animate-pulse rounded-full"></div>
                        </div>
                    </div>
                    <div className="block w-full md:w-8/12">
                        <div className="bg-foreground h-6 w-3/4 animate-pulse rounded-full md:w-80"></div>
                        <div className="bg-foreground mt-2 h-4 w-full animate-pulse rounded-full"></div>
                        <div className="bg-foreground mt-2 h-4 w-full animate-pulse rounded-full"></div>
                        <div className="bg-foreground mt-2 h-4 w-full animate-pulse rounded-full"></div>
                        <div className="bg-foreground mt-2 h-4 w-1/2 animate-pulse rounded-full"></div>
                        <div className="bg-foreground mt-8 h-6 w-3/4 animate-pulse rounded-full md:w-80"></div>
                        <div className="bg-foreground mt-2 h-4 w-full animate-pulse rounded-full"></div>
                        <div className="bg-foreground mt-2 h-4 w-full animate-pulse rounded-full"></div>
                        <div className="bg-foreground mt-2 h-4 w-full animate-pulse rounded-full"></div>
                        <div className="bg-foreground mt-2 h-4 w-1/2 animate-pulse rounded-full"></div>
                        <div className="bg-foreground mt-8 h-6 w-3/4 animate-pulse rounded-full md:w-80"></div>
                        <div className="bg-foreground mt-2 h-4 w-full animate-pulse rounded-full"></div>
                        <div className="bg-foreground mt-2 h-4 w-full animate-pulse rounded-full"></div>
                        <div className="bg-foreground mt-2 h-4 w-full animate-pulse rounded-full"></div>
                        <div className="bg-foreground mt-2 h-4 w-1/2 animate-pulse rounded-full"></div>
                    </div>
                </div>
            </article>
        );
    }

    return (
        <article className="mt-20 p-3 md:mt-24 md:px-12 lg:px-24">
            <div className="mb-8 flex w-full flex-col gap-6 md:flex-row">
                <div className="block w-full md:w-4/12">
                    <img
                        src={summary.thumbnail}
                        className="border-body shadow-image w-[calc(100%-6px)] rounded-3xl border md:w-full md:-translate-1.5"
                    />
                    <div className="md:-ml-1.5">
                        <h3 className="mt-2 text-2xl">{summary.title}</h3>
                        <p>{summary.channel}</p>
                    </div>
                </div>
                <div className="block w-full md:w-8/12">
                    <div ref={summaryRef} className="summary -mt-4 text-justify"></div>
                </div>
            </div>
        </article>
    );
};

export default Summary;
