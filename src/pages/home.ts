import { addSong } from "../firebaseConfig";
import { appState, dispatch } from "../store/index";
import { addObserver } from "../store/index";
import { getSongsAction } from "../store/actions";

const song = {
    title: '',
    author: '',
    album: '',
    dateAdded: new Date(),
    duration: 0,
    img : ''
}


class HomePage extends HTMLElement {
    constructor () {
        super();
        this.attachShadow({ mode: 'open' });
        addObserver(this);
    }

    async connectedCallback () {
        try {
            if (appState.songs.length === 0) {
                // Llamamos a getSongsAction y verificamos si hay canciones
                const action = await getSongsAction();
                
                // Solo ejecutamos dispatch si hay canciones
                if (action.payload && action.payload.length > 0) {
                    dispatch(action);
                    this.updateSongList();
                }
            }
            this.render();  // Renderizamos independientemente de si hay canciones o no
        } catch (error) {
            console.error("Error fetching songs:", error);
        }
    }
    async updateSongList() {
        const productListContainer = this.shadowRoot?.querySelector('#product-list');
        if (productListContainer) {
            // Limpia el contenedor de la lista de productos antes de agregar nuevos
            productListContainer.innerHTML = '';
            console.log(appState.songs);

            appState.songs?.forEach((song: any) => {
                const productElement = this.ownerDocument.createElement('div');

                const title = this.ownerDocument.createElement('h2');
                title.textContent = song.title;

                const author = this.ownerDocument.createElement('span');
                author.textContent = `Autor: ${song.author}`;
                author.style.color = '#a0a0a0';

                const titleAndAuthor = this.ownerDocument.createElement('div');
                titleAndAuthor.appendChild(title);
                titleAndAuthor.appendChild(author);
                titleAndAuthor.id = 'title-author';

                const album = this.ownerDocument.createElement('p');
                album.textContent = `Álbum: ${song.album}`;

                const duration = this.ownerDocument.createElement('p');
                duration.textContent = `Duración: ${song.duration}`;

                // Convertir la fecha de Firestore en un objeto Date
                const dateAdded = new Date(song.dateAdded.seconds * 1000);
                const formattedDate = dateAdded.toLocaleDateString(); // Puedes personalizar el formato

                const date = this.ownerDocument.createElement('p');
                date.textContent = `Añadida en: ${formattedDate}`; // Mostrar la fecha formateada


                const imgElement = this.ownerDocument.createElement('img');
                imgElement.src = song.img;

                const imgAndInfo = this.ownerDocument.createElement('div');
                imgAndInfo.appendChild(imgElement);
                imgAndInfo.appendChild(titleAndAuthor);
                imgAndInfo.id = 'img-info';
            

                productElement.appendChild(imgAndInfo);
                productElement.appendChild(album);
                productElement.appendChild(date);
                productElement.appendChild(duration);

                productListContainer.appendChild(productElement);
            });
        }
    }
    
    async render (){
        if (this.shadowRoot) {
            // Limpia el contenido antes de renderizar
            this.shadowRoot.innerHTML = '';
    
            // Add styles
            const style = this.ownerDocument.createElement('style');
            style.textContent = `
                :host {
                    display: block;
                    font-family: Arial, sans-serif:
                    color: #ffffff;
                    padding: 20px;
                }
                #img-info{
                    display: flex;
                    gap: 10px;
                    align-items: center;
                }
                #title-author{
                    min-width: 200px;
                }
                h1 {
                    font-size: 2.5em;
                    margin-bottom: 20px;
                }
                form {
                    display: flex;
                    gap: 10px;
                    margin-bottom: 30px;
                }
                input {
                    flex: 1;
                    padding: 10px;
                    background-color: #2a2a3c;
                    border: none;
                    border-radius: 5px;
                    color: #ffffff;
                }
                button {
                    padding: 10px 20px;
                    background-color: #6c5ce7;
                    border: none;
                    border-radius: 5px;
                    color: #ffffff;
                    cursor: pointer;
                }
                #product-list {
                    display: grid;
                    gap: 20px;
                }
                #product-list > div {
                    display: flex;
                    justify-content: space-between;
                    gap: 10px;
                    align-items: center;
                    padding: 10px;
                    background-color: #2a2a3c;
                    border-radius: 5px;
                }
                #product-list img {
                    width: 60px;
                    height: 60px;
                    object-fit: cover;
                    border-radius: 5px;
                }
                #product-list h2 {
                    font-size: 1.2em;
                    margin: 0;
                }
                #product-list p {
                    margin: 0;
                    min-width: 200px;
                    color: #a0a0a0;
                }
            `;
            this.shadowRoot.appendChild(style);
    
            // Formulario para crear productos
            const title = this.ownerDocument.createElement('h1');
            title.textContent = 'MY PLAYLIST';
            this.shadowRoot.appendChild(title);
    
            // Contenedor para la lista de productos
            const productListContainer = this.ownerDocument.createElement('div');
            productListContainer.id = 'product-list';
            this.shadowRoot.appendChild(productListContainer);
    
            // Renderiza la lista de productos inicial
            await this.updateSongList();
        }
}
}

customElements.define('home-page', HomePage);

export default HomePage;