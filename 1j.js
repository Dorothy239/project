const API_BASE_URL = "http://localhost/Book_Reviews_Web_Application/php";

// Function to fetch reviews
async function fetchReviews() {
    try {
        const response = await fetch(`${API_BASE_URL}/get_reviews.php`);
        const data = await response.json(); 

        if (data.success) {
            populateReviewsTable(data.reviews); // Populate the reviews table
        } else {
            console.error("Failed to fetch reviews:", data.error);
        }
    } catch (error) {
        console.error("Error fetching reviews:", error);
    }
}

// Function to populate the reviews table
function populateReviewsTable(reviews) {
    const tableBody = document.getElementById("reviews-table-body");
    tableBody.innerHTML = ""; 

    console.log("Reviews fetched:", reviews);
    reviews.forEach((review) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${review.book_title}</td>
            <td>${review.author}</td>
            <td>${review.rating}</td>
            <td>${review.review_text}</td>
            <td>${review.date_added}</td>
            <td>
                <button class="btn btn-warning btn-sm edit-button" data-id="${review.id}">Edit</button>
                <button class="btn btn-danger btn-sm delete-button" data-id="${review.id}">Delete</button>
            </td>
        `;

        tableBody.appendChild(row);
    });

    attachActionListeners(); 
}


function attachActionListeners() {
    document.querySelectorAll(".edit-button").forEach((button) => {
        button.addEventListener("click", () => {
            const reviewId = button.getAttribute("data-id");
            editReview(reviewId); // Edit the review
        });
    });

    document.querySelectorAll(".delete-button").forEach((button) => {
        button.addEventListener("click", () => {
            const reviewId = button.getAttribute("data-id");
            deleteReview(reviewId); // Delete the review
        });
    });
}

// Function to handle editing a review
function editReview(reviewId) {
    
    fetch(`${API_BASE_URL}/get_reviews.php?id=${reviewId}`)
        .then(response => response.json())
        .then(data => {
            if (data.success && data.review) {
                const review = data.review;
                document.getElementById('formTitle').textContent = "Edit Review"; 
                document.getElementById('reviewId').value = review.id;
                document.getElementById('bookTitle').value = review.book_title;
                document.getElementById('author').value = review.author;
                document.getElementById('rating').value = review.rating;
                document.getElementById('reviewText').value = review.review_text;

                document.getElementById('addReviewForm').scrollIntoView({ behavior: 'smooth', block: 'center' }); //scroll

            } else {
                alert("Review not found!");
            }
        })
        .catch(error => {
            console.error("Error fetching review for editing:", error);
        });
}

// Function to handle deleting a review
async function deleteReview(reviewId) {
    if (!confirm("Are you sure you want to delete this review?")) {
        return; 
    }

    try {
        // Send DELETE request to the backend
        const response = await fetch(`${API_BASE_URL}/delete_review.php`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: reviewId }) 
        });

        const data = await response.json(); 

        if (data.success) {
            alert("Review deleted successfully!");
            fetchReviews(); 
        } else {
            alert("Failed to delete review: " + data.error);
        }
    } catch (error) {
        console.error("Error deleting review:", error);
    }
}

// Function to handle form submission for adding or updating a review
document.getElementById('addReviewForm').addEventListener('submit', async function(event) {
    event.preventDefault(); 
    const reviewId = document.getElementById('reviewId').value;
    const bookTitle = document.getElementById('bookTitle').value;
    const author = document.getElementById('author').value;
    const rating = document.getElementById('rating').value;
    const reviewText = document.getElementById('reviewText').value;

    const reviewData = {
        book_title: bookTitle,
        author: author,
        rating: rating,
        review_text: reviewText
    };

    try {
        let response;
        if (reviewId) {
            // update the existing review
            reviewData.id = reviewId;
            response = await fetch(`${API_BASE_URL}/update_review.php`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(reviewData)
            });
        } else {
           
            response = await fetch(`${API_BASE_URL}/add_review.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(reviewData)
            });
        }

        const data = await response.json();
        console.log("Add/Edit review response:", data);

        if (data.success) {
            alert("Review saved successfully!");
            fetchReviews(); 
            document.getElementById('addReviewForm').reset(); 
            document.getElementById('formTitle').textContent = "Add a New Review"; 
        } else {
            alert("Failed to save review: " + data.error);
        }
    } catch (error) {
        console.error("Error saving review:", error);
    }
});

document.addEventListener("DOMContentLoaded", fetchReviews);