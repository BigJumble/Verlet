type JSX = { root: Element; elementsWithId: Record<string, Element> }

function html(strings: TemplateStringsArray, ...exp: any[]): JSX {
    const template = document.createElement('template');

    template.innerHTML = exp.reduce((acc, ex, id) => acc + ex + strings[id + 1], strings[0]).trim();
    const content = document.importNode(template.content, true);

    if (content.childElementCount > 1) {
        throw `Fix your lit-html so that only one root exists! ${template.innerHTML}`;
    }

    if (strings.length === 1) {
        throw `Empty lit-html, plz fix!`;
    }

    const root = content.firstChild as Element;

    const elementsWithId: Record<string, Element> = {};

    function collectElementsWithId(element: Element) {
        if (element.id) {
            elementsWithId[element.id] = element;
        }

        Array.from(element.children).forEach(child => collectElementsWithId(child));
    }

    collectElementsWithId(root);

    return {
        root,
        elementsWithId
    };
}

function main(){
    Camera.init();
    Actions.init();
    // PlayerController.SpawnPlayer(0, 0);

    GameManager.load();

    
    Animator.update();
}
main();