import { Response } from "express";
import { TranscriptResponse, YoutubeTranscript, YoutubeTranscriptError } from "youtube-transcript";
import { GenerativeModel, GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "../lib/db";
import { Depth, Style, Tone } from "@prisma/client";
import ytdl from "@distube/ytdl-core";
import { AuthenticatedRequest } from "../lib/types";
import { checkCredits, useCredits } from "../lib/credits";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI API KEY not configured");
}

const GEMINI_API_KEY = process.env.GEMINI_API_KEY as string;

export const createSummary = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const {
        link,
        tone,
        style,
        depth,
        length,
    }: { link: string; tone: Tone; style: Style; depth: Depth; length: number } = req.body;

    if (!req.user) {
        res.status(403).json({ message: "Forbidden" });
        return;
    }

    if (!link) {
        res.status(400).json({ message: "Link is required" });
        return;
    }

    if (!tone) {
        res.status(400).json({ message: "Tone is required" });
        return;
    }

    if (!style) {
        res.status(400).json({ message: "Style is required" });
        return;
    }

    if (!depth) {
        res.status(400).json({ message: "Depth is required" });
        return;
    }

    if (!length) {
        res.status(400).json({ message: "Length is required" });
        return;
    }

    if (length < 250 || length > 1000) {
        res.status(400).json({ message: "Length should be between 250 and 1000" });
        return;
    }

    const ai: GoogleGenerativeAI = new GoogleGenerativeAI(GEMINI_API_KEY);

    const model: GenerativeModel = ai.getGenerativeModel({
        model: "gemini-2.0-flash-lite",
        systemInstruction: `Summarize the core content in a ${depth} manner in a ${tone} tone with a ${style} style in english, focusing on a ${depth} level of detail and aiming for a ${length} summary in English language only, within ${style} structure totaling around ${length} words. Include only essential and useful information, capturing key concepts, main points, arguments, and conclusions accurately while reflecting the video's intended tone, purpose, and audience. Exclude any references to video platforms, acknowledgments of the transcript source, personal introductions, opinions, promotional messages, or call-to-actions, ensuring that only contextually relevant content is included. Identify and exclude tangential or filler material, and cross-reference essential data such as statistics or studies with the video's broader context to avoid misinterpretation. When encountering technical or industry-specific language, maintain the appropriate level of detail so that key terminology is preserved without overwhelming the reader. Ensure clarity of information by articulating key messages and essential details without ambiguity, using precise language and logical structure for easy comprehension. Maintain consistency in tone and style throughout the summary using the specified ${tone} tone and ${style} style to resonate with the intended audience. Focus on content relevance by filtering out extraneous material, ensuring that only information enhancing understanding is included. Reflect the context of the original content accurately, preserving nuances in technical jargon, data points, and industry-specific language. Verify essential claims by cross-referencing numerical data, studies, or specific examples to ensure accurate representation of the source material, and keep the total length strictly around ${length} words. Do not use any formatting or markdown for the content itself, but format the final output in markdown. Use appropriate markdown headers, lists, and other formatting elements to structure the summary clearly. use level 2 headings for point headings and never use level 1 headings. There should be a blank like between ${style}. Remember to answer only in ENGLISH language (even if the transcript provided is in any other language, ie, translate to ENGLISH).`,
    });

    try {
        if (!(await checkCredits(req.user))) {
            res.status(403).json({ message: "Insufficient credits" });
        }

        let info: ytdl.videoInfo;
        try {
            info = await ytdl.getBasicInfo(link);
        } catch (error) {
            console.error(error);
            res.status(400).json({ message: "Invalid YouTube URL" });
            return;
        }

        let data: TranscriptResponse[];

        try {
            data = await YoutubeTranscript.fetchTranscript(link);
        } catch (error) {
            console.error(error);
            res.status(404).json({ message: "Unable to fetch transcript" });
            return;
        }

        let transcript: string = "";

        data.forEach((item) => {
            transcript = transcript + item.text + " ";
        });

        if (!data || !transcript || transcript == "") {
            res.status(500).json({ message: "Unable to fetch transcript" });
            return;
        }

        const summary = await model.generateContent(transcript);

        if (!summary.response.text()) {
            res.status(500).json({ message: "Unable to generate summary" });
            return;
        }

        const newSummary = await db.summary.create({
            data: {
                title: info.videoDetails.title,
                channel: info.videoDetails.author.name,
                thumbnail: info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 1].url,
                link: link,
                tone: tone,
                style: style,
                depth: depth,
                length: Number(length),
                content: summary.response.text(),
                tokensUsed: {
                    transcriptTokens: Number(summary.response.usageMetadata?.promptTokenCount),
                    summaryTokens: Number(summary.response.usageMetadata?.candidatesTokenCount),
                    totalToken: Number(summary.response.usageMetadata?.totalTokenCount),
                },
                createdBy: {
                    connect: { id: req.user },
                },
            },
        });

        await useCredits(req.user);

        res.status(200).json({
            message: "Summary generation successful",
            id: newSummary.id,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getSummary = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { id } = req.params;

    if (!req.user) {
        res.status(403).json({ message: "Forbidden" });
        return;
    }

    if (!id) {
        res.status(400).json({ message: "Id is required" });
        return;
    }

    try {
        const existingSummary = await db.summary.findUnique({
            where: {
                id: id,
            },
            omit: {
                tokensUsed: true,
                createdById: true,
            },
        });
        if (!existingSummary) {
            res.status(404).json({ message: "Summary not found" });
            return;
        }
        res.status(200).json({ message: "Summary found", summary: existingSummary });
    } catch (error) {
        console.error(error);
        if (error instanceof PrismaClientKnownRequestError && error.code == "P2023") {
            res.status(404).json({ message: "Summary not found" });
            return;
        }
        res.status(500).json({ message: "Internal server error" });
    }
};
