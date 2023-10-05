export interface Color {
    id?: string;
    name?: string;
}

export interface Form {
    id?: string;
    name?: string;
    image?: string;
}

export interface Material {
    id?: string;
    name?: string;
}

export interface Texture {
    id?: string;
    name?: string;
}

export interface Job {
    id?: string;
    prompt?: string;
    init_text?: string;
    status?: string | "pending" | "started" | "finished";
    image?: string;
    form?: Form;
    rank?: number;
}


export interface Settings {
    id?: string;
    width?: number;
    height?: number;
    init_prompt?: string;
    ending_prompt?: string;
}