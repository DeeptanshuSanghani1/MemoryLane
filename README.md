# Picture Book Project

## Overview
The project allows users to upload images and view them in a realistic and dynamic picture book.

### Key Features
1. **Dynamic Page Updates**: The number of pages automatically updates as the user uploads new images.
2. **Real-Time Updates**: New images are instantly displayed without the need to refresh the page.
3. **Realistic Animations**: Includes a flipping animation to mimic the look and feel of a real book.

Users can upload new images directly to the book, which are securely stored and instantly displayed.

---

## Technologies Used

### Frontend
- Built with **ReactTS**, **TailwindCSS**, and **GraphQL**.
- Hosted on **Vercel**.

### Backend
- Built with **FastAPI** and **GraphQL**.
- Hosted on **Google Cloud Platform (GCP)** using **Google Cloud Run**.
- Images are stored in **Google Cloud Buckets**.
- Utilizes **Docker** for deployment on GCP.

---

## Overall Flow
1. When a user accesses the webpage, any previously uploaded images are fetched and displayed in the picture book.
2. When a user uploads a new image:
   - The image is sent to the backend via a GraphQL mutation.
   - Upon successful upload, the mutation triggers `refetchQueries`, invoking a fetch mutation to retrieve the latest images.
   - The backend uploads the image to a **Google Cloud Bucket** and retrieves the image URL.
   - The URL is appended to a global array on the backend.
   - A fetch images mutation is invoked to get all image URLs from the backend.
3. The frontend receives the updated URLs and dynamically updates the picture book, including adjusting the number of pages.

---

## Architecture
### Architecture Diagram
![Architecture Diagram](docs/architecture.png)
