document.addEventListener('DOMContentLoaded', function() {
    // User data
    const userName = "Alex"; // hardcoded user name
    document.getElementById('welcomeMsg').textContent = `Welcome back, ${userName}!`;
  
    // Sample data
    const feedData = [
      { user: "Jane", action: "reviewed", book: "The Great Adventure", text: "Absolutely loved this book! A must-read." },
      { user: "Mark", action: "rated", book: "Mystery of Shadows", text: "Gave it 5 stars. Kept me on the edge!" },
      { user: "Emma", action: "commented on", book: "Space Odyssey", text: "Really interesting story." }
    ];
    const myReviews = [
      { title: "My Summer Vacation", content: "It was a heartfelt story. I enjoyed writing it." },
      { title: "Technology Today", content: "An informative piece on modern tech trends." }
    ];
    const readingLists = ["Favorites", "Sci-Fi Picks"];
    const notifications = [
      "Bob liked your review on 'The Great Adventure'.",
      "Lisa started following you.",
      "Tom commented on your story 'Space Odyssey'."
    ];
  
    // Populate feed
    const feedContainer = document.querySelector('#feed .items-container');
    feedData.forEach(item => {
      const div = document.createElement('div');
      div.className = 'item';
      div.innerHTML = `<span class="title"><strong>${item.user}</strong> ${item.action} <em>${item.book}</em></span>
                       <p class="content">${item.text}</p>`;
      feedContainer.appendChild(div);
    });
  
    // Populate My Reviews
    const reviewsContainer = document.querySelector('#myReviews .items-container');
    function renderReviews() {
      reviewsContainer.innerHTML = '';
      myReviews.forEach((review, index) => {
        const div = document.createElement('div');
        div.className = 'item';
        div.innerHTML = `<span class="title">${review.title}</span>
                         <p class="content">${review.content}</p>
                         <div class="review-actions">
                           <button class="edit-btn" data-index="${index}">Edit</button>
                           <button class="delete-btn" data-index="${index}">Delete</button>
                         </div>`;
        reviewsContainer.appendChild(div);
      });
      attachReviewListeners();
    }
    function attachReviewListeners() {
      document.querySelectorAll('.edit-btn').forEach(button => {
        button.onclick = () => {
          const idx = button.getAttribute('data-index');
          alert(`Edit review: ${myReviews[idx].title}`);
        };
      });
      document.querySelectorAll('.delete-btn').forEach(button => {
        button.onclick = () => {
          const idx = button.getAttribute('data-index');
          myReviews.splice(idx, 1);
          renderReviews();
        };
      });
    }
    renderReviews();
  
    // Populate Reading Lists
    const listsContainer = document.querySelector('#readingLists .items-container');
    function renderLists() {
      listsContainer.innerHTML = '';
      readingLists.forEach((list, index) => {
        const li = document.createElement('li');
        li.textContent = list;
        const delBtn = document.createElement('button');
        delBtn.textContent = '✕';
        delBtn.onclick = () => {
          readingLists.splice(index, 1);
          renderLists();
        };
        li.appendChild(delBtn);
        listsContainer.appendChild(li);
      });
    }
    renderLists();
  
    // Populate Notifications
    const notificationsContainer = document.querySelector('#notifications .items-container');
    notifications.forEach(note => {
      const li = document.createElement('li');
      li.textContent = note;
      notificationsContainer.appendChild(li);
    });
  
    // Modal for new list
    const modal = document.getElementById('modal');
    const addListBtn = document.getElementById('addListBtn');
    const closeModal = document.getElementById('closeModal');
    const createListBtn = document.getElementById('createListBtn');
    addListBtn.addEventListener('click', () => {
      modal.classList.add('show');
    });
    closeModal.addEventListener('click', () => {
      modal.classList.remove('show');
    });
    createListBtn.addEventListener('click', () => {
      const listName = document.getElementById('newListName').value.trim();
      if (listName) {
        readingLists.push(listName);
        renderLists();
      }
      document.getElementById('newListName').value = '';
      modal.classList.remove('show');
    });
  
    // Section animations
    const sections = document.querySelectorAll('.section');
    sections.forEach((sec, i) => {
      setTimeout(() => {
        sec.classList.add('visible');
      }, i * 200);
    });
  });
  