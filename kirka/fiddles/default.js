let styleTag = document.createElement('style');
styleTag.textContent = "@import url('https://kirka.io/assets/css/app.2abeb888.css');";
document.body.appendChild(styleTag);
function createElement(type, attributes, parent) {
    const element = document.createElement(type);
    Object.assign(element, attributes);
    parent.appendChild(element);
    return element;
}
const containerDiv = createElement('div', {id: 'cssContainer'}, document.body);


createElement('label', {
    for: 'cssInput',
    textContent: 'Enter CSS URL:'
}, containerDiv);

createElement('input', {
    type: 'text',
    id: 'cssInput',
    placeholder: 'https://example.com/style.css'
}, containerDiv);

createElement('button', {
    textContent: 'Apply Stylesheet',
    onclick: applyStylesheet
}, containerDiv);

function applyStylesheet() {
    const cssInput = document.getElementById('cssInput').value;
    createElement('link', {
        rel: 'stylesheet',
        href: cssInput
    }, document.head);
}
