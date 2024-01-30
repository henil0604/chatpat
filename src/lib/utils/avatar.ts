import { createAvatar } from "@dicebear/core";
import * as themes from '@dicebear/collection';

let theme = themes['loreleiNeutral']

export function generateAvatar(seed: string) {
    return createAvatar(theme, {
        seed,
    })
}

export function resolveURL(src: string): string | undefined {
    // if src is empty, return default avatar
    if (!src.trim()) {
        return generateAvatar('CHATPAT').toDataUriSync();
    }

    // if the source is starting with `dice:`
    // eg. dice:0.13484776341257
    // return avatar from dicebear
    if (src.startsWith('dice:')) {
        return generateAvatar(src.replace('dice:', '')).toDataUriSync();
    }

    return src;
}