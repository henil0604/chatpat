import type { Session } from "@auth/core/types";
import { writable } from "svelte/store";

export let loading = writable<{
    show: boolean,
    label?: string,
    device: 'both' | 'mobile' | 'desktop'
}>({
    show: false,
    label: '',
    device: 'both'
});

export let userStore = writable<Session["user"] | null | undefined>(null)