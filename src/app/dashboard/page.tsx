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

type Repo = {
    id: number;
    name: string;
    full_name: string;
    html_url: string;
    private: boolean;
    description: string;
};

type PullRequest = {
    id: number;
    number: number;
    title: string;
    state: "open" | "closed";
    draft: boolean;
    html_url: string;
    created_at: string;
    updated_at: string;
    user: {
        login: string;
        avatar_url: string;
    };
};

type ReposResponse = {
    repos: Repo[];
    has_more: boolean;
};

type PullRequestsResponse = {
    pull_requests: PullRequest[];
};

export default function Dashboard() {
    const [user, setUser] = useState<User | null>(null);
    const [repos, setRepos] = useState<Repo[]>([]);

    const [loading, setLoading] = useState(true);
    const [loadingRepos, setLoadingRepos] = useState(true);

    // Which repository is currently expanded
    const [expandedRepo, setExpandedRepo] = useState<string | null>(null);

    // Store PRs by repository
    const [pullRequests, setPullRequests] = useState<
        Record<string, PullRequest[]>
    >({});

    // Which repository is currently loading PRs
    const [loadingPRs, setLoadingPRs] = useState<string | null>(null);

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/me/`, {
            credentials: "include",
        })
            .then(async (response) => {
                const data = await response.json().catch(() => null);

                if (!response.ok) {
                    throw new Error(
                        `Failed to fetch user: ${response.status}`
                    );
                }

                return data;
            })
            .then((data) => {
                setUser(data);
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => {
                setLoading(false);
            });

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/repos/`, {
            credentials: "include",
        })
            .then(async (response) => {
                const data = await response.json().catch(() => null);

                if (!response.ok) {
                    throw new Error(
                        `Failed to fetch repos: ${response.status}`
                    );
                }

                return data as ReposResponse;
            })
            .then((data) => {
                setRepos(data.repos);
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => {
                setLoadingRepos(false);
            });
    }, []);

    const toggleRepository = async (repo: Repo) => {
        const repoKey = repo.full_name;

        // Clicking the same repository closes it.
        if (expandedRepo === repoKey) {
            setExpandedRepo(null);
            return;
        }

        // Open repository immediately.
        setExpandedRepo(repoKey);

        // Don't fetch the same PRs again.
        if (pullRequests[repoKey]) {
            return;
        }

        const [owner] = repo.full_name.split("/");

        setLoadingPRs(repoKey);

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/user/repos/${owner}/${repo.name}/pulls/`,
                {
                    credentials: "include",
                }
            );

            const data = await response.json().catch(() => null);

            if (!response.ok) {
                throw new Error(
                    `Failed to fetch PRs: ${response.status}`
                );
            }

            const result = data as PullRequestsResponse;

            setPullRequests((previous) => ({
                ...previous,
                [repoKey]: result.pull_requests,
            }));
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingPRs(null);
        }
    };

    const openReview = (repo: Repo, pr: PullRequest) => {
        const [owner] = repo.full_name.split("/");

        window.location.href =
            `/dashboard/review/${owner}/${repo.name}/${pr.number}`;
    };

    return (
        <main className="relative min-h-screen overflow-hidden bg-background">
            {/* Background glow */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -left-40 top-1/4 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
                <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />
            </div>

            <div className="relative z-10 mx-auto w-full max-w-6xl px-8 py-10">

                {/* Header */}

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-semibold tracking-tight">
                            Hey,{" "}
                            {user?.name ||
                                user?.github.username ||
                                "there"}{" "}
                            👋
                        </h1>

                        <p className="mt-2 text-muted-foreground">
                            Pick a repository to see its recent pull
                            requests.
                        </p>
                    </div>

                    {user && (
                        <div className="flex items-center gap-4">
                            <img
                                src={user.github.avatar_url}
                                alt={user.github.username}
                                className="h-12 w-12 rounded-full ring-2 ring-white/10"
                            />

                            <div>
                                <p className="font-medium">
                                    {user.github.username}
                                </p>

                                <p className="text-sm text-muted-foreground">
                                    {user.email}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Repository section */}

                <section className="mt-10">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-lg font-semibold">
                            Your repositories
                        </h2>

                        <span className="text-sm text-muted-foreground">
                            {repos.length} repositories
                        </span>
                    </div>

                    {loadingRepos ? (
                        <div className="rounded-2xl border border-border bg-card/60 p-8 text-center text-sm text-muted-foreground backdrop-blur-xl">
                            Loading your repositories...
                        </div>
                    ) : repos.length === 0 ? (
                        <div className="rounded-2xl border border-border bg-card/60 p-8 text-center text-sm text-muted-foreground backdrop-blur-xl">
                            No repositories found.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {repos.map((repo) => {
                                const repoKey = repo.full_name;
                                const isExpanded =
                                    expandedRepo === repoKey;

                                const prs =
                                    pullRequests[repoKey] || [];

                                return (
                                    <div
                                        key={repo.id}
                                        className="overflow-hidden rounded-2xl border border-border bg-card/60 shadow-lg shadow-black/10 backdrop-blur-xl"
                                    >
                                        {/* Repository row */}

                                        <button
                                            type="button"
                                            onClick={() =>
                                                toggleRepository(repo)
                                            }
                                            className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left transition hover:bg-white/[0.03]"
                                        >
                                            <div className="flex min-w-0 items-center gap-4">
                                                {/* Repo icon */}

                                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-xl">
                                                    📦
                                                </div>

                                                {/* Repo information */}

                                                <div className="min-w-0">
                                                    <div className="flex items-center gap-3">
                                                        <h3 className="truncate font-medium">
                                                            {
                                                                repo.full_name
                                                            }
                                                        </h3>

                                                        <span className="shrink-0 rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground">
                                                            {repo.private
                                                                ? "Private"
                                                                : "Public"}
                                                        </span>
                                                    </div>

                                                    {repo.description && (
                                                        <p className="mt-1 truncate text-sm text-muted-foreground">
                                                            {
                                                                repo.description
                                                            }
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Arrow */}

                                            <span
                                                className={`shrink-0 text-lg text-muted-foreground transition-transform duration-200 ${isExpanded
                                                    ? "rotate-180"
                                                    : ""
                                                    }`}
                                            >
                                                ↓
                                            </span>
                                        </button>

                                        {/* PR dropdown */}

                                        {isExpanded && (
                                            <div className="border-t border-border bg-black/10 px-6 py-4">
                                                <div className="mb-3 flex items-center justify-between">
                                                    <p className="text-sm font-medium">
                                                        Recent pull requests
                                                    </p>

                                                    <span className="text-xs text-muted-foreground">
                                                        {prs.length} found
                                                    </span>
                                                </div>

                                                {loadingPRs ===
                                                    repoKey ? (
                                                    <div className="py-8 text-center text-sm text-muted-foreground">
                                                        Loading pull
                                                        requests...
                                                    </div>
                                                ) : prs.length === 0 ? (
                                                    <div className="rounded-xl border border-dashed border-border py-8 text-center text-sm text-muted-foreground">
                                                        No pull requests
                                                        found.
                                                    </div>
                                                ) : (
                                                    <div className="space-y-1">
                                                        {prs.map(
                                                            (pr) => (
                                                                <button
                                                                    key={
                                                                        pr.id
                                                                    }
                                                                    type="button"
                                                                    onClick={() =>
                                                                        openReview(
                                                                            repo,
                                                                            pr
                                                                        )
                                                                    }
                                                                    className="group flex w-full items-center justify-between gap-4 rounded-xl px-4 py-4 text-left transition hover:bg-white/[0.04]"
                                                                >
                                                                    <div className="flex min-w-0 items-center gap-3">
                                                                        <img
                                                                            src={
                                                                                pr
                                                                                    .user
                                                                                    .avatar_url
                                                                            }
                                                                            alt={
                                                                                pr
                                                                                    .user
                                                                                    .login
                                                                            }
                                                                            className="h-8 w-8 shrink-0 rounded-full"
                                                                        />

                                                                        <div className="min-w-0">
                                                                            <p className="truncate text-sm font-medium group-hover:text-blue-400">
                                                                                <span className="mr-2 text-muted-foreground">
                                                                                    #
                                                                                    {
                                                                                        pr.number
                                                                                    }
                                                                                </span>

                                                                                {
                                                                                    pr.title
                                                                                }
                                                                            </p>

                                                                            <p className="mt-1 text-xs text-muted-foreground">
                                                                                {
                                                                                    pr
                                                                                        .user
                                                                                        .login
                                                                                }
                                                                            </p>
                                                                        </div>
                                                                    </div>

                                                                    <div className="flex shrink-0 items-center gap-3">
                                                                        {pr.draft && (
                                                                            <span className="rounded-full bg-yellow-500/10 px-2.5 py-1 text-xs text-yellow-400">
                                                                                Draft
                                                                            </span>
                                                                        )}

                                                                        <span
                                                                            className={`rounded-full px-2.5 py-1 text-xs ${pr.state ===
                                                                                "open"
                                                                                ? "bg-emerald-500/10 text-emerald-400"
                                                                                : "bg-zinc-500/10 text-zinc-400"
                                                                                }`}
                                                                        >
                                                                            {
                                                                                pr.state
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                </button>
                                                            )
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}
