"use client";

import { useEffect, useState } from "react";

type User = {
    id: number;
    email: string;
    name: string;
    github: {
        id: number;
        username: string;
        avatar_url: string;
        profile_url: string;
    };
};

export default function Dashboard() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/me/`, {
            credentials: "include",
        })
            .then(async (response) => {
                const data = await response.json().catch(() => null);

                console.log("STATUS:", response.status);
                console.log("DATA:", data);

                if (!response.ok) {
                    throw new Error(`Failed to fetch user: ${response.status}`);
                }

                return data;
            })
            .then((data) => {
                console.log("USER:", data);
                setUser(data);
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return (
        <div className="relative z-10 flex w-full items-start justify-between p-10">
            <div>
                <h1 className="text-3xl font-semibold">
                    Hey, {user?.name || user?.github.username}! 👋
                </h1>

                <p className="mt-2 text-muted-foreground">
                    Welcome to ReviewBot.
                </p>
            </div>

            <div className="flex items-center gap-4">
                <img
                    src={user?.github.avatar_url}
                    alt={user?.github.username}
                    className="h-12 w-12 rounded-full"
                />

                <div>
                    <p className="font-medium">{user?.github.username}</p>

                    <p className="text-sm text-muted-foreground">
                        {user?.email}
                    </p>
                </div>
            </div>
        </div>
    );
}
