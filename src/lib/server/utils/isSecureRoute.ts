/*
    this utility iterates through all Pages mentioned in $lib/const and checks if the give path has a `secure` as `true`
*/

import { Pages } from "$lib/const";

export function isSecureRoute(path: string) {
    for (const key in Pages) {
        const page = Pages[key as keyof typeof Pages];
        if (page.path === path && page.secure === true) {
            return true
        }
    }
    return false;
}