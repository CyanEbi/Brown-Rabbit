const searchBar = document.getElementById('search-bar');
const searchResults = document.getElementById('search-results');

const slides = document.getElementById('slides');
var slideWidth = slides.children[0].offsetWidth;
var slideIdx = 0;
var totalSlides;
var currentSlideOffset;
var isMouseDown = false;
var dragInitX;

var articleList;
var pageIdx = 0;
var totalPages;

const dialog = document.getElementById('post_dialog');

window.onload = function () {

    fetch('posts.json')
        .then(response => response.json())
            .then(json => {
                articleList = json;
                totalPages = Math.ceil(articleList.length/4);
                document.getElementById('total_pages').innerText = `${totalPages}`;
                loadPosts(0)
            });
    
    
    totalSlides = slides.children.length;
    slides.append(slides.children[0].cloneNode(true));
    slides.prepend(slides.children[totalSlides-1].cloneNode(true));
    slides.addEventListener('mousedown', onDragStart);
    document.addEventListener('mousemove', onDrag);
    document.addEventListener('mouseup', onDragEnd);
    slides.addEventListener('transitionend', onTransitionEnd);
    jumpToSlide(0);
    
    window.addEventListener('resize', onResize);

    document.addEventListener('click', (event) => {
        if (!searchResults.contains(event.target) & !dialog.contains(event.target)) {
            searchResults.style.display = 'none';
        }
    })

    const articles = document.getElementById('article_list').children;
    for (var i=0; i<articles.length; i++) {
        if (i>=4) {
            articles[i].style.display = 'none';
        }
    }
    
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

function search() {
    const value = searchBar.value.toLowerCase();

    if (value.trim() == '') {
        searchResults.style.display = 'none'
    } else {
        while(searchResults.firstChild) {
            searchResults.removeChild(searchResults.lastChild);
        }
        searchResults.style.display = ''

        for (var i=0; i<articleList.length; i++) {
            if (articleList[i].title.toLowerCase().includes(value) |
                articleList[i].text.toLowerCase().includes(value)) {
                const searchResult = document.createElement('div');
                searchResult.classList.add('search-result');
                const idx = i;
                searchResult.onclick = () => readMore(idx);
                searchResult.innerHTML = `
                    <h4>${articleList[i].title}</h2>
                    <p>Published ${articleList[i].published}</p>
                    <p class="two-lines">${articleList[i].text}</p>
                `
                searchResults.appendChild(searchResult);

                const divider = document.createElement('div');
                divider.classList.add('divider');
                searchResults.appendChild(divider);
            }
        }

        if (searchResults.children.length > 0) {
            searchResults.removeChild(searchResults.lastChild);
        } else {
            searchResults.innerHTML = 'No results found';
        }
    }

    
}

function onDragStart(e) {
    slides.classList.remove('transitioning');
    e.preventDefault();

    if (e.type == 'touchstart') {
        
    } else {
        isMouseDown = true;
        dragInitX = e.clientX;
        slides.style.left = `${slides.offsetLeft}px`;
    }
}

function onDrag(e) {
    if (isMouseDown) {

        // If user drags past the neighbouring slide
        if (slides.offsetLeft > currentSlideOffset + slideWidth) {
            isMouseDown = false;
            switchSlide(-1);
        } else if (slides.offsetLeft < currentSlideOffset - slideWidth) {
            isMouseDown = false;
            switchSlide(1);
        } else {
            slides.style.left = `${slides.offsetLeft + e.clientX - dragInitX}px`;
            dragInitX = e.clientX;
        }

    }
}

function onDragEnd() {
    if (isMouseDown) {
        isMouseDown = false;
    
        if ((slides.offsetLeft - currentSlideOffset) > slideWidth/2) {
            switchSlide(-1);
        } else if ((slides.offsetLeft - currentSlideOffset) < -slideWidth/2) {
            switchSlide(1);
        } else {
            switchSlide(0);
        }
    }
}

// -1 = previous slide (index), 0 = stay, 1 = next slide (index)
function switchSlide(direction) {
    
    // Avoid odd offsets by only switching slide if no transition is underway
    if(!slides.classList.contains('transitioning'))
    {
        slides.classList.add('transitioning');
        slideIdx += direction;
        currentSlideOffset = -(slideIdx+1)*slideWidth;
        slides.style.left = `${currentSlideOffset}px`;
    }
}

function onTransitionEnd() {
    slides.classList.remove('transitioning');
    const moduloIdx = modulo(slideIdx, totalSlides);
    if (slideIdx != moduloIdx) {
        jumpToSlide(moduloIdx);
    }
    
}

function jumpToSlide(idx) {    
    slides.style.left = `${-(idx+1)*slideWidth}px`;
    slideIdx = idx;
    currentSlideOffset = slides.offsetLeft;
}

function modulo(dividend, divisor) {
    return ((dividend % divisor) + divisor) % divisor
}

function onResize() {
    slideWidth = slides.children[0].offsetWidth;
    currentSlideOffset = -(slideIdx+1)*slideWidth;
    slides.style.left = `${currentSlideOffset}px`;
}

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
    const last = Math.min(page*4+4, articleList.length);
    for(var i=first; i<last; i++) {
        const content = articleList[i];
        const article = document.createElement('article');
        article.id = `post${i}`;
        article.innerHTML = `
            <img src="${content.img}">
            <div class="post_content">
                <h2>${content.title}</h2>
                <h6>Published ${content.published}</h6>
                <p class="five-lines">${content.text}</p>
                <button onclick="readMore('${i}')">Read more</button>
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
    const content = articleList[post];
    
    dialog.innerHTML = `
        <div class="dialog-close-wrapper">
            <img src="assets/icons/close.svg" class="close-button" onclick="closeDialog()">
        </div>
        <div class="dialog-banner">
            <img src="${content.img}">
        </div>
        <div class="dialog-post">
            <h2>${content.title}</h2>
            <h6>Published ${content.published}</h6>
            <p>${content.text}</p>
        </div>
        </div>
    `;
    dialog.showModal();
    dialog.scrollTo({top: 0});
}

function closeDialog() {
    document.getElementById('post_dialog').close();
}