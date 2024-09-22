window.onload = function () {

    var el = document.createElement("div");
    el.innerHTML = "RABBIT TEST ";
    var div = document.getElementById("headline");
    insertAfter(div, el);

    /* FUNCTIONS */

    // Inserts newNode after referenceNode
    function insertAfter(referenceNode, newNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }
};