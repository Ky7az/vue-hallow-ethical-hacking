import { createStore, useStore as baseUseStore, type Store } from 'vuex';
import type { InjectionKey } from 'vue';
import soup, { type SoupState } from './modules/soup';
import watch, { type WatchState } from './modules/watch';
import pentest, { type PentestState } from './modules/pentest';
import writeup, { type WriteupState } from './modules/writeup';

export interface RootState {
    soup: SoupState;
    watch: WatchState;
    pentest: PentestState;
    writeup: WriteupState;
}

export const key: InjectionKey<Store<RootState>> = Symbol();

export function useStore(): Store<RootState> {
    return baseUseStore(key);
}

const store = createStore<RootState>({
    modules: {
        soup,
        watch,
        pentest,
        writeup,
    },
    strict: true,
});

export default store;
