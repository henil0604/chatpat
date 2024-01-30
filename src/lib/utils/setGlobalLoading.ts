import { loading } from "$lib/store/global";
import { get, type StoresValues } from 'svelte/store'

type LoadingState = StoresValues<typeof loading>

export function setGlobalLoading(show: LoadingState['show'], label?: LoadingState['label'], device: LoadingState['device'] = 'both') {
    return loading.set({
        ...get(loading),
        show,
        label,
        device: device || 'both'
    })
}