import { updateSong } from "../firebaseConfig"; // Importar función para actualizar canciones
import { addSong } from "../firebaseConfig";
import { appState, dispatch } from "../store/index";
import { addObserver } from "../store/index";
import { getSongsAction } from "../store/actions";

const song = {
    id: '', // Nuevo campo para guardar el ID del documento en Firebase
    title: '',
    author: '',
    album: '',
    dateAdded: new Date(),
    duration: 0,
    img: ''
};

class EditPage extends HTMLElement {
    isEditing = false; // Bandera para saber si estamos en modo edición

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        addObserver(this);

        // Enlazar métodos
        this.changeTitle = this.changeTitle.bind(this);
        this.changeAuthor = this.changeAuthor.bind(this);
        this.changeAlbum = this.changeAlbum.bind(this);
        this.changeDuration = this.changeDuration.bind(this);
        this.changeImg = this.changeImg.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.editSong = this.editSong.bind(this);
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

    async submitForm(e: any) {
        e.preventDefault();
        if (this.isEditing) {
            // Si estamos editando, actualizamos la canción
            console.log(song);
            await updateSong(song);
            this.isEditing = false;
        }

        // Limpiar inputs
        this.shadowRoot?.querySelectorAll('input').forEach(input => input.value = '');

        // Recargar productos sin renderizar todo el componente
        this.updateSongList();
    }

    editSong(selectedSong: any) {
        this.isEditing = true;
        const id = appState.songs.find((song: any) => song.title === selectedSong.title)?.id;
        if (id) {
            song.id = id;
        }
        song.title = selectedSong.title;
        song.author = selectedSong.author;
        song.album = selectedSong.album;
        song.duration = selectedSong.duration;
        song.img = selectedSong.img;

        // Llenar los inputs con la información de la canción seleccionada
        const inputs = this.shadowRoot?.querySelectorAll('input');
        if (inputs) {
            inputs[0].value = song.title;
            inputs[1].value = song.author;
            inputs[2].value = song.album;
            inputs[3].value = song.duration.toString();
            inputs[4].value = song.img;
        }
    }

    async updateSongList() {
        const productListContainer = this.shadowRoot?.querySelector('#product-list');
        if (productListContainer) {
            productListContainer.innerHTML = '';

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

                const editButton = this.ownerDocument.createElement('button');
                editButton.textContent = '✏️';
                editButton.style.cursor = 'pointer';
                editButton.addEventListener('click', () => this.editSong(song));

                const imgAndInfo = this.ownerDocument.createElement('div');
                imgAndInfo.appendChild(imgElement);
                imgAndInfo.appendChild(titleAndAuthor);
                imgAndInfo.appendChild(editButton);
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
            albumInput.placeholder = 'Álbum';
            albumInput.addEventListener('change', this.changeAlbum);

            const durationInput = this.ownerDocument.createElement('input');
            durationInput.placeholder = 'Duración';
            durationInput.addEventListener('change', this.changeDuration);

            const imgInput = this.ownerDocument.createElement('input');
            imgInput.placeholder = 'Imagen';
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

customElements.define('edit-page', EditPage);

export default EditPage;
