import "./components/export"
import './pages/home'
import './pages/add'
import './pages/edit'
import { appState } from "./store";

class AppContainer extends HTMLElement {
    constructor(){
        super();
        this.attachShadow({mode: "open"})
    }

    connectedCallback() {
        this.render()
        console.log(appState)
        
    }

    render() {
        if (this.shadowRoot) this.shadowRoot.innerHTML = '';
        switch (appState.screen) {
            case 'HOME':
                const mainPage = document.createElement('home-page');
                this.shadowRoot?.appendChild(mainPage);
                break;
            case 'ADD':
                const addPage = document.createElement('add-page');
                this.shadowRoot?.appendChild(addPage);
                break;
            case 'EDIT':
                const editPage = document.createElement('edit-page');
                this.shadowRoot?.appendChild(editPage);
                break;
            default:
                break;
        }
    }
}

customElements.define('app-container', AppContainer)