import { addSong } from "../firebaseConfig";
import { appState, dispatch } from "../store/index";
import { addObserver } from "../store/index";
import { getSongsAction } from "../store/actions";

// Objeto base para una canción
const song = {
    id: '', // Nuevo campo para el ID
    title: '',
    author: '',
    album: '',
    dateAdded: new Date(),
    duration: 0,
    img: ''
};

class AddPage extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        addObserver(this);

        // Enlazar funciones
        this.changeTitle = this.changeTitle.bind(this);
        this.changeAuthor = this.changeAuthor.bind(this);
        this.changeAlbum = this.changeAlbum.bind(this);
        this.changeDuration = this.changeDuration.bind(this);
        this.changeImg = this.changeImg.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.render = this.render.bind(this);
    }

    async connectedCallback() {
        try {
            if (appState.songs.length === 0) {
                const action = await getSongsAction();
                if (action.payload && action.payload.length > 0) {
                    dispatch(action);
                    this.updateSongList();
                }
            }
            this.render();
        } catch (error) {
            console.error("Error fetching songs:", error);
        }
    }

    // Funciones de cambio para actualizar el objeto song
    changeTitle(e: any) {
        song.title = e.target.value;
    }
    changeAuthor(e: any) {
        song.author = e.target.value;
    }
    changeAlbum(e: any) {
        song.album = e.target.value;
    }
    changeDuration(e: any) {
        song.duration = e.target.value;
    }
    changeImg(e: any) {
        song.img = e.target.value;
    }
    // Función para enviar el formulario
    async submitForm(e: any) {
        e.preventDefault();

        console.log("Canción a añadir:", song);

        await addSong(song);

        // Limpiar los inputs
        this.shadowRoot?.querySelectorAll('input').forEach(input => (input.value = ''));

        // Recargar la lista de canciones
        this.updateSongList();
    }

    // Función para actualizar la lista de canciones
    async updateSongList() {
        const productListContainer = this.shadowRoot?.querySelector('#product-list');
        if (productListContainer) {
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

                const dateAdded = new Date(song.dateAdded.seconds * 1000);
                const formattedDate = dateAdded.toLocaleDateString();

                const date = this.ownerDocument.createElement('p');
                date.textContent = `Añadida en: ${formattedDate}`;

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

    async render() {
        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = '';

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

            const title = this.ownerDocument.createElement('h1');
            title.textContent = 'MY PLAYLIST';
            this.shadowRoot.appendChild(title);

            const form = this.ownerDocument.createElement('form');
            this.shadowRoot.appendChild(form);

            const nameInput = this.ownerDocument.createElement('input');
            nameInput.placeholder = 'Título';
            nameInput.addEventListener('change', this.changeTitle);

            const authorInput = this.ownerDocument.createElement('input');
            authorInput.placeholder = 'Autor';
            authorInput.addEventListener('change', this.changeAuthor);

            const albumInput = this.ownerDocument.createElement('input');
            albumInput.placeholder = 'Album';
            albumInput.addEventListener('change', this.changeAlbum);

            const durationInput = this.ownerDocument.createElement('input');
            durationInput.placeholder = 'Duración';
            durationInput.addEventListener('change', this.changeDuration);

            const imgInput = this.ownerDocument.createElement('input');
            imgInput.placeholder = 'Image link address';
            imgInput.addEventListener('change', this.changeImg);

            const saveButton = this.ownerDocument.createElement('button');
            saveButton.textContent = 'Guardar';
            saveButton.addEventListener('click', this.submitForm);

            form.appendChild(nameInput);
            form.appendChild(authorInput);
            form.appendChild(albumInput);
            form.appendChild(durationInput);
            form.appendChild(imgInput);
            form.appendChild(saveButton);

            const productListContainer = this.ownerDocument.createElement('div');
            productListContainer.id = 'product-list';
            this.shadowRoot.appendChild(productListContainer);

            await this.updateSongList();
        }
    }
}

customElements.define('add-page', AddPage);

export default AddPage;
