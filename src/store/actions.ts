import { getSongs } from "../firebaseConfig";

export const navigate = (screen: string) => {
    return {
        action: 'NAVIGATE',
        payload: screen
    }
}


export const getSongsAction =  async() => {
    const songs = await getSongs();
    return {
        action: 'GET_SONGS',
        payload: songs
    };
}