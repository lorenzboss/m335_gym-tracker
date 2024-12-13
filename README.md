# Gym Tracker

Gym Tracker is a simple application to help you keep track of your workouts, monitor your progress, and achieve your fitness goals.

## Features

- Log your workouts!
- Take pictures after each workout to track your progress!
- Add notes to your workouts to keep track of your thoughts and feelings!
- Manage your notifications to remind you to work out!
- Track progress over time with charts and statistics!

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/lorenzboss/m335_gym-tracker.git
    ```
2. Navigate to the project directory:
    ```bash
    cd m335_gym-tracker
    ```
3. Install dependencies:
    ```bash
    npm install
    ```
4. Create the /src/environments/environment.ts file with the following content:
    ```typescript
    export const environment = {
    production: false,
    supabaseUrl: "<your_supabase_url>",
    supabaseKey: "<your_supabase_key>",
    };
    ```
5. Create the /src/environments/environment.prod.ts file with the following content:
    ```typescript
    export const environment = {
    production: true,
    supabaseUrl: "<your_supabase_url>",
    supabaseKey: "<your_supabase_key>",
    };
    ```
   

## Usage

## Run the application in the browser
1. Start the application in the browser:
    ```bash
    ionic serve
    ```
2. Open your browser and go to `http://localhost:8100/`

## Run the application on an emulator 

1. Build the application:
    ```bash
    ionic build
    ```

2. Sync the application with the emulator:
    ```bash
    ionic capacitor sync android
    ```

3. Open the application on the emulator:
    ```bash
    ionic capacitor run android -l --external
    ```

## Run the application APK on an Android device
1. Drag and drop the APK file from the your Android device.
