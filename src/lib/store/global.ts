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