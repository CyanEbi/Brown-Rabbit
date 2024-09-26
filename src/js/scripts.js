var posts;
var totalPages;

window.onload = function () {

    fetch('posts.json')
        .then(response => response.json())
        .then(json => {
            posts = json;
            totalPages = Math.ceil(posts.length/4);
            document.getElementById('total_pages').innerText = `${totalPages}`;
            loadPosts(0)
        });

    const articles = document.getElementById('article_list').children;
    for (var i=0; i<articles.length; i++) {
        if (i>=4) {
            articles[i].style.display = 'none';
        }
    }
    
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

function loadPosts(page) {
    if ((page < 0) || (page >= totalPages)) {
        return;
    }

    document.getElementById('current_page').innerText = `${page+1}`;

    const postList = document.getElementById('article_list');
    
    while(postList.firstChild) {
        postList.removeChild(postList.lastChild);
    }

    const first = page*4;
    const last = Math.min(page*4+4, posts.length);
    for(var i=first; i<last; i++) {
        const content = posts[i];
        const article = document.createElement('article');
        article.id = `post${i}`;
        article.innerHTML = `
            <img src="${content.img}">
            <div class="post_content">
                <h2>${content.title}</h2>
                <h6>Published ${content.published}</h6>
                <p class="five_lines">${content.text}</p>
                <a class="link_button" onclick="readMore('${i}')">Read more</a>
            </div>
        `;
        postList.appendChild(article);
    }

    const buttonNext = document.getElementById('button_next');
    const buttonPrev = document.getElementById('button_prev');
    const articles = document.getElementById('articles');
    
    if (page == 0) {
        buttonPrev.disabled = true;
    } else {
        buttonPrev.disabled = false;
        buttonPrev.onclick = () => {
            loadPosts(page-1);
            articles.scrollIntoView(true);
        }
    }

    if (page+1 == totalPages) {
        buttonNext.disabled = true;
    } else {
        buttonNext.disabled = false;
        buttonNext.onclick = () => {
            loadPosts(page+1);
            articles.scrollIntoView(true);
        }
    }
}

function readMore(post) {
    const content = posts[post];
    const dialog = document.getElementById('post_dialog');
    dialog.innerHTML = `
        <div class="dialog_content">
            <div class="dialog_banner">
                <img src="${content.img}" class="banner_img">
                <img src="assets/icons/close.svg" class="dialog_close" onclick="closeDialog()">
            </div>
            <div class="dialog_post">
                <h2>${content.title}</h2>
                <h6>Published ${content.published}</h6>
                <p>${content.text}</p>
            </div>
            </div>
            
        </div>
    `;
    dialog.showModal();
    dialog.scrollTo({top: 0});
}

function closeDialog() {
    document.getElementById('post_dialog').close();
}