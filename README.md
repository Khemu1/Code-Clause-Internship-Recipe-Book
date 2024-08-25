# Recipe Book Project

This project is a Recipe Book web application built using Node.js, Express.js, SQLite, and Vite. It allows users to add, edit, and delete recipes, along with uploading images for the recipes.

## Prerequisites

Before you begin, ensure you have met the following requirements:
- Node.js installed
- npm (Node Package Manager) installed

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/Khemu1/Code-Clause-Internship-Recipe-Book.git
    ```

2. Navigate to the project directory:
    ```bash
    cd recipe-book
    ```

3. Install the dependencies:
    ```bash
    npm install
    ```

4. Install the Vite dependencies:
    ```bash
    npm install vite
    ```

5. Start the Vite dev server:
    ```bash
    npm run dev
    ```

6. In a new terminal window, start the Express server:
    ```bash
    npm run serve
    ```

## Usage

1. Open your browser and navigate to `http://localhost:5173` to view the application.
2. Use the form on the left to add a new recipe.
3. Use the form on the right to edit an existing recipe.
4. The list of recipes will be displayed below the forms.

## API Endpoints

### Add Recipe

- **URL:** `/add`
- **Method:** `POST`
- **Request Body:** `multipart/form-data`
  - `title` (string): The title of the recipe
  - `recipe` (string): The recipe description
  - `thumbnail` (file): The image file for the recipe thumbnail

### Update Recipe

- **URL:** `/update`
- **Method:** `PUT`
- **Request Body:** `multipart/form-data`
  - `id` (string): The ID of the recipe to update
  - `title` (string): The title of the recipe
  - `recipe` (string): The recipe description
  - `thumbnail` (file, optional): The new image file for the recipe thumbnail

### Delete Recipe

- **URL:** `/delete`
- **Method:** `POST`
- **Request Body:** `application/json`
  - `id` (string): The ID of the recipe to delete
