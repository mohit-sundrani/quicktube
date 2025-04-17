export interface User {
    name: string;
    credits: number;
}

export interface Summary {
    id: string;
    title: string;
    channel: string;
    thumbnail: string;
    link: string;
    tone: "PROFESSIONAL" | "CASUAL" | "FRIENDLY";
    style: "PARAGRAPHS" | "POINTS";
    depth: "COMPREHENSIVE" | "CONCISE";
    length: number;
    content: string;
    createdAt: string;
}

export interface CustomError {
    message: string;
}
