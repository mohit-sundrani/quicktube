import { db } from "./db";

export const resetCredits = async (id: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingUser = await db.users.findUnique({
        where: {
            id: id,
        },
    });

    if (existingUser?.lastReset && existingUser?.lastReset < today) {
        await db.users.update({
            where: { id: id },
            data: {
                credits: 5,
                lastReset: today,
            },
        });
    }
};

export const checkCredits = async (id: string) => {
    await resetCredits(id);

    const existingUser = await db.users.findUnique({
        where: {
            id: id,
        },
    });

    return existingUser?.credits ? existingUser?.credits > 0 : false;
};

export const useCredits = async (id: string) => {
    if (await checkCredits(id)) {
        await db.users.update({
            where: {
                id: id,
            },
            data: {
                credits: {
                    decrement: 1,
                },
            },
        });
    }
};
