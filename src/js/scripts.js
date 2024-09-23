window.onload = function () {
    
    const dialog = document.getElementById('post_dialog');
    dialog.addEventListener('click', (event) => {
        if (event.target === dialog) {
            dialog.close();
        }
    });
    

    /* FUNCTIONS */

    // Inserts newNode after referenceNode
    function insertAfter(referenceNode, newNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }
};

function readMore(postID) {
    const post = document.getElementById(postID);
    const imageSrc = post.children[0].getAttribute('src');

    const dialog = document.getElementById('post_dialog');
    dialog.innerHTML = `
        <div class="dialog_content">
            <div class="dialog_banner">
                <img src="${imageSrc}" class="banner_img">
                <img src="assets/icons/close.svg" class="dialog_close" onclick="closeDialog()">
            </div>
            <div class="dialog_post">
                ${post.children[1].children[0].outerHTML}
                ${post.children[1].children[1].outerHTML}
                <p>${post.children[1].children[2].innerHTML}</p>
            </div>
            </div>
            
        </div>
    `;
    dialog.showModal();
}

function closeDialog() {
    document.getElementById('post_dialog').close();
}