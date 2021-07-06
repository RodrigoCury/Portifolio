import './style/main.css'
import './style/media-queries.css'
import Application from './javascript/Application.js'

window.application = new Application({
    $canvas: document.querySelector('.webgl-canvas'),
    useComposer: true
})
