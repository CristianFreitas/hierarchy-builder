
# **Word Hierarchy Interface Project**

This project is a web interface developed using React and TypeScript, allowing users to create word hierarchies visually, save the hierarchy as a JSON file, and download it.

## **Requirements**

- **Node.js** version 14 or higher
- **Docker** (to run the project in a container)
- **Web Browser**

## **Installation and Local Execution**

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/your-repository.git
   cd your-repository
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the project:**
   ```bash
   npm start
   ```

4. **Access the application:**
   Open your browser and go to `http://localhost:3000`.

## **Running with Docker**

1. **Run the script to build and run the container:**
   ```bash
   ./build_and_run.sh
   ```

2. **Access the application in your browser:**
   Open `http://localhost:3000` to view the application.

## **Features**

- Add hierarchical levels.
- Visually display the hierarchy.
- Save the hierarchy as a JSON file.
- Download the generated JSON file.

## **Project Structure**

- **src/**: Contains the main project code.
  - **components/**: React components used in the interface.
  - **HierarchyView.tsx**: Main component for creating and displaying the hierarchy.
  - **App.tsx**: Main application component.

## **Available Scripts**

- `npm start`: Runs the application locally.
- `npm run build`: Builds the project for production.
- `./build_and_run.sh`: Builds the Docker image and runs the container.
