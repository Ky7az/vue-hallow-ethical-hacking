// --- Shared ---

export interface TagInputItem {
    text: string;
}

// --- Soup ---

export interface SoupTag {
    id: number;
    name: string;
    slug: string;
    count?: number;
}

export interface Article {
    id: number;
    name: string;
    slug: string;
    content: string;
    tags: SoupTag[];
    bookmarked: boolean;
    create_date?: string;
    write_date?: string;
}

// --- Watch ---

export interface WatchTag {
    id: number;
    name: string;
    slug: string;
    count?: number;
}

export interface Source {
    id: number;
    name: string;
    url: string;
    source_type: string;
    source_type_display?: string;
}

export interface Feed {
    id: number;
    name: string;
    source: Source;
    tag_names?: string;
    write_date?: string;
    count?: number;
}

export interface Content {
    id: number;
    slug: string;
    title: string;
    url: string;
    viewed: boolean;
    bookmarked: boolean;
    create_date?: string;
    tags: WatchTag[];
    tag?: WatchTag;
    source?: Source;
}

// --- Pentest ---

export interface Port {
    id: number;
    number: number;
    protocol: string;
}

export interface Service {
    id: number;
    name: string;
    default_ports?: Port[];
}

export interface Phase {
    id: number;
    name: string;
    sequence?: number;
}

export interface Vulnerability {
    id: number;
    name: string;
    description?: string;
}

export interface PentestTool {
    id: number;
    name: string;
    description?: string;
}

export interface Attacker {
    id: number;
    name: string;
    slug: string;
    host?: string;
    ssh_port?: number;
    ssh_username?: string;
    ssh_pkey?: string;
    ip?: string;
    description?: string;
}

export interface Target {
    id: number;
    name: string;
    slug: string;
    host?: string;
    path?: string;
    ip?: string;
    os?: string;
    description?: string;
    services?: TargetService[];
}

export interface TargetService {
    id: number;
    target: Target;
    service: Service;
    port: Port;
    version?: string;
    description?: string;
}

export interface Credential {
    id: number;
    cred_type?: string;
    username?: string;
    password?: string;
    hash?: string;
    description?: string;
    target?: Target;
    service?: Service;
}

export interface Parameter {
    id: number;
    name: string;
    key?: string;
    value?: string;
    description?: string;
    target?: Target;
    tool?: PentestTool;
}

export interface Action {
    id: number;
    name: string;
    command?: string;
    description?: string;
    priority?: number;
    auth_needed?: boolean;
    phase: Phase | null;
    service: Service | null;
    vulnerability: Vulnerability | null;
    tool: PentestTool | null;
}

export interface Task {
    id: number;
    name: string;
    command?: string;
    output?: string;
    target: Target;
    target_service?: TargetService;
    action: Action;
    attacker: Attacker;
    credential?: Credential;
    create_date?: string;
    write_date?: string;
}

export interface TaskResult {
    id: number;
    task_id: number;
    state?: string;
    output: string;
}

// --- Writeup ---

export interface WriteupTag {
    id: number;
    name: string;
    slug: string;
    count?: number;
}

export interface Website {
    id: number;
    name: string;
    url: string;
    slug?: string;
}

export interface Report {
    id: number;
    name: string;
    slug: string;
    content: string;
    tags: WriteupTag[];
    website: Website;
    task_type?: string;
    task_type_display?: string;
    task_platform?: string;
    task_platform_display?: string;
    task_url?: string;
    create_date?: string;
    write_date?: string;
}
