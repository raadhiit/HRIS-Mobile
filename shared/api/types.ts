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

export type HomeDTO = {
    user: HeaderUser;
    stats: Stat[];
    activities: Activity[];
};
