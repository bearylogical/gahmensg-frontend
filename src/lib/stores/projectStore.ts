import { writable } from "svelte/store";


export type ProjectRecord = {
    project_id?: number,
    project_title?: string | undefined,
    ministry?: string | undefined
    value_type?: string,
    value_amount?: number | undefined,
    value_year?: number | undefined,
    parent_header?: string,
    document_year?: number,
    ministry_id?: number,
    document_id?: number,
    expenditure_id?: number,
    stringIdentifier?: string
}

export type Project = {
    values?: ProjectRecord[] | null,
    project_title: string,
    project_hash: string,
    project_identifier: string
    project_ids: number[]
    ministry: string,
    recentYear: number,
}

type ProjectStore = {
    selected: Project["project_hash"] | null;
};

function createProjectStore() {
    const store = writable<ProjectStore>({ selected: null });

    return {
        subscribe: store.subscribe,
        setProject: (project_id: Project["project_hash"]) => {
            store.update((store) => ({ ...store, selected: project_id }));
        },
        clear: () => {
            store.set({ selected: null });
        }
    };
}

export const projectStore = createProjectStore();