import { reducer } from './reducers';

import Storage  from '../utils/storage';

//El estado global, appState
const initialState: any = {
    songs : [],
    screen: 'EDIT'
};

export let appState = Storage.get('STORE', initialState);

let observers:any [] = [];

const persistStore = (state: any) => {
	Storage.set('STORE', state);
};

//Crear el dispatch
export const dispatch = (action: any) => {
	const clone = JSON.parse(JSON.stringify(appState));
	const newState = reducer(action, clone);
	appState = newState;

	persistStore(newState);
	observers.forEach((o: any) => o.render());
    console.log(observers);
};

//Agregar los observadores para los interesados, los suscritos
export const addObserver = (ref: any) => {
	observers = [...observers, ref];
};