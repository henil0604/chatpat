import {
    atom
} from 'recoil';
import { setRecoil } from 'recoil-nexus'

const $loading = atom({
    key: 'loading',
    default: true
});

export function setLoading(bool: boolean) {
    return setRecoil($loading, bool);
}

export default $loading;