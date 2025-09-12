export type HeaderUser = { name: string; role: string }

export type Stat = {
    label: string;
    value: number | string;
    iconName: string;
}

export type Activity = {
    title: string;
    subtitle: string;
    iconName: string;
}

export type HistoryStatus = "approved" | "rejected" | "pending";

export type History = {
    date: string;
    status: HistoryStatus;
};

export type HomeDTO = {
    user: HeaderUser;
    stats: Stat[];
    activities: Activity[];
    history: History[];
};


