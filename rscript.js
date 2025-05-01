// Mobile Menu Toggle
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navbarLinks = document.getElementById('navbarLinks');

mobileMenuToggle.addEventListener('click', () => {
    navbarLinks.classList.toggle('active');
});

const readingListsContainer = document.getElementById('reading-lists-container');
const newListForm = document.getElementById('new-list-form');
const listDetailContainer = document.getElementById('list-detail-container');
const manageListButton = document.getElementById('manage-list');
const shareListButton = document.getElementById('share-list');
const bookListEl = document.getElementById('book-list');
const listTitleEl = document.getElementById('list-detail-container').querySelector('h3');
const listDescriptionEl = document.getElementById('list-detail-container').querySelector('p');
const privacySettingEl = document.getElementById('privacy-setting');
const deleteListButton = document.getElementById('delete-list');
const createListButton = document.querySelector('#new-list-form button[type="submit"]');


let readingLists = JSON.parse(localStorage.getItem('readingLists')) || [
  {
    id: '1',
    title: 'My Favorite Sci-Fi Books',
    description: 'A collection of my favorite science fiction novels.',
    isPublic: true,
    books: [
      { title: 'Dune', author: 'Frank Herbert', cover: 'https://placehold.co/50x70/EEE/31343C' },
      { title: 'The Left Hand of Darkness', author: 'Ursula K. Le Guin', cover: 'https://placehold.co/50x70/EEE/31343C' },
    ],
  },
  {
    id: '2',
    title: 'Books on Ancient History',
    description: 'A list of books about ancient civilizations.',
    isPublic: false,
    books: [
      { title: 'Sapiens', author: 'Yuval Noah Harari', cover: 'https://placehold.co/50x70/EEE/31343C' },
      { title: 'The Histories', author: 'Herodotus', cover: 'https://placehold.co/50x70/EEE/31343C' },
    ],
  },
];

let currentListId = null;
let isEditing = false;

function saveReadingLists() {
  localStorage.setItem('readingLists', JSON.stringify(readingLists));
}

function displayReadingLists() {
    readingListsContainer.innerHTML = '';
    readingLists.forEach((list) => {
        const listCard = document.createElement('div');
        listCard.className = 'reading-list-card';
        listCard.dataset.listId = list.id;

        listCard.innerHTML = `
            <h3>${list.title}</h3>
            <p>${list.description}</p>
            <p>Privacy: ${list.isPublic ? 'Public' : 'Private'}</p>
            <div class="actions">
                <button class="view-list">View List</button>
                <button class="${list.isPublic ? '' : ''} edit-list">Edit</button>
                <button class="delete-list delete">Delete</button>
            </div>
        `;
        readingListsContainer.appendChild(listCard);
    });
}



function showListDetail(listId) {
    currentListId = listId;
    const list = readingLists.find((list) => list.id === listId);

    if (!list) {
        listDetailContainer.innerHTML = '<h3>List not found</h3>';
        listDetailContainer.classList.remove('hidden');
        return;
    }

    listTitleEl.textContent = list.title;
    listDescriptionEl.textContent = list.description;
    privacySettingEl.textContent = list.isPublic ? 'Public' : 'Private';
    bookListEl.innerHTML = list.books
        .map(
            (book) => `
      <li>
        <div class="book-item">
            <div class="book-cover">${book.cover}</div>
            <span>${book.title} by ${book.author}</span>
         </div>
         <button style="background-color:#D37095; color:white; border:none; border-radius: 5px; width: 5%; height: 35px;" class="delete-book delete">Delete</button>
      </li>
    `
        )
        .join('');

    manageListButton.classList.toggle('hidden', !list.isPublic);
    shareListButton.classList.toggle('hidden', !list.isPublic);
    listDetailContainer.classList.remove('hidden');
     if (list.isPublic) {
        manageListButton.classList.add('hidden');
     }else{
        manageListButton.classList.remove('hidden');
     }
}

function handleCreateList(event) {
    event.preventDefault();

    const title = document.getElementById('list-title').value.trim();
    const description = document.getElementById('list-description').value.trim();
    const privacy = document.querySelector('input[name="privacy"]:checked').value;
    const isPublic = privacy === 'public';
     const errorMessage = document.getElementById('error-message');

     if (!title) {
        errorMessage.textContent="Please enter a title for your list";
        return;
     }
     if(!description){
        errorMessage.textContent="Please enter a description for your list";
         return;
     }
     errorMessage.textContent = "";

    if (isEditing) {
        // Update existing list
        const index = readingLists.findIndex(list => list.id === currentListId);
        if (index !== -1) {
            readingLists[index].title = title;
            readingLists[index].description = description;
            readingLists[index].isPublic = isPublic;
        }
        isEditing = false;
        createListButton.textContent = "Create List";
    } else {
        // Create new list
        const newList = {
            id: Date.now().toString(),
            title,
            description,
            isPublic,
            books: [],
        };
        readingLists.push(newList);
    }


    saveReadingLists();
    displayReadingLists();
    newListForm.classList.add('hidden');
    newListForm.reset();
    createListButton.textContent = "Create List";
}



function handleShareList() {
    if (!currentListId) return;
    const listUrl = `${window.location.origin}${window.location.pathname}?listId=${currentListId}`;
    navigator.clipboard
        .writeText(listUrl)
        .then(() => {
            alert(`List link copied to clipboard: ${listUrl}`);
        })
        .catch((err) => {
            console.error('Failed to copy:', err);
            alert(`Could not copy link.  Here is the link: ${listUrl}`);
        });
}

// Event Listeners
newListForm.addEventListener('submit', handleCreateList);
readingListsContainer.addEventListener('click', (event) => {
    const target = event.target;
    const listCard = target.closest('.reading-list-card');
    if (!listCard) return;

    const listId = listCard.dataset.listId;

    if (target.classList.contains('view-list')) {
        showListDetail(listId);
    } else if (target.classList.contains('edit-list')) {
        isEditing = true;
        const listToEdit = readingLists.find(list => list.id === listId);
        if (listToEdit) {
            currentListId = listId;
            document.getElementById('list-title').value = listToEdit.title;
            document.getElementById('list-description').value = listToEdit.description;
            document.querySelector(`input[name="privacy"][value="${listToEdit.isPublic ? 'public' : 'private'}"]`).checked = true;
            newListForm.classList.remove('hidden');
            createListButton.textContent = "Update List"
        }

    } else if (target.classList.contains('delete-list')) {
        readingLists = readingLists.filter(list => list.id !== listId);
        saveReadingLists();
        displayReadingLists();
        listDetailContainer.classList.add('hidden');
    }
});

listDetailContainer.addEventListener('click', (event) => {
    const target = event.target;
    if (target.id === 'share-list') {
        handleShareList();
    } else if (target.id === 'manage-list') {
        // For simplicity, let's just add a dummy book.
        const listIndex = readingLists.findIndex((list) => list.id === currentListId);
        if (listIndex !== -1) {
            readingLists[listIndex].books.push({
                title: `Book ${readingLists[listIndex].books.length + 1}`,
                author: 'Unknown Author',
                cover: 'https://placehold.co/50x70/EEE/31343C',
            });
            saveReadingLists();
            showListDetail(currentListId); // Re-render the list detail
        }
    }
     else if (target.classList.contains('delete-book')) {
        const bookItem = target.closest('li');
        if (!bookItem) return;
        const list = readingLists.find(list => list.id === currentListId);
         if(list){
             const bookIndex = Array.from(bookListEl.children).indexOf(bookItem);
             list.books.splice(bookIndex, 1);
             saveReadingLists();
             showListDetail(currentListId);
         }
    }
});

// Initial render
displayReadingLists();

// Show new list form
document.getElementById('create-new-list-button').addEventListener('click', () => {
    newListForm.classList.toggle('hidden');
    if (newListForm.classList.contains('hidden')){
         createListButton.textContent = "Create List";
         isEditing = false;
         newListForm.reset();
    }

});