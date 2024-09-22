window.onload = function () {

    

    /* FUNCTIONS */

    // Inserts newNode after referenceNode
    function insertAfter(referenceNode, newNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }
};

function readMore(postID) {
    const post = document.getElementById(postID);

    const dialog = document.getElementById('post_dialog');
    dialog.innerHTML = `
        <div class="post_content">
            ${post.children[0].outerHTML}
            ${post.children[1].children[0].outerHTML}
            ${post.children[1].children[1].outerHTML}
            <p>${post.children[1].children[2].innerHTML}</p>
        </div>
    `;
    dialog.showModal();
}