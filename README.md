# 📊 YT-lytics

<!-- Badges -->
![License](https://img.shields.io/badge/License-MIT-blue.svg)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=flat&logo=vite&logoColor=FFD62E)
![Flask](https://img.shields.io/badge/Flask-000000?style=flat&logo=flask&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)

> An advanced YouTube channel analytics dashboard providing deep insights, competitor comparison, and AI-driven recommendations using Gemini AI.

---

## ✨ Features

- **📈 Comprehensive Dashboard Analytics**: Visualize channel performance, views, subscribers, and engagement metrics over time.
- **🤖 AI Insights**: Leverage Google's Gemini AI to analyze your YouTube data and generate actionable recommendations for growth and content strategy.
- **⚔️ Competitor Comparison**: Compare key metrics between multiple YouTube channels side-by-side to identify industry trends and gaps.
- **⚡ Real-time Data**: Integrated directly with the YouTube Data API v3 for up-to-date and accurate statistics.
- **🎨 Modern UI/UX**: A responsive, beautifully designed interface built with TailwindCSS, featuring smooth animations via Framer Motion and interactive charts with Chart.js.

---

## 📸 Screenshots

### Overview Page
> *(Placeholder: Add a screenshot of the general overview page here)*
>
> `![Overview](/assets/overview.png)`

### Dashboard Analytics
> *(Placeholder: Add a screenshot of the main dashboard here)*
>
> `![Dashboard](/assets/dashboard.png)`

### Compare Section
> *(Placeholder: Add a screenshot of the channel comparison feature here)*
>
> `![Compare Section](/assets/compare.png)`

### AI Insights Section
> *(Placeholder: Add a screenshot of the Gemini AI generated insights here)*
>
> `![AI Insights](/assets/ai-insights.png)`

---

## 🛠️ Tech Stack

| Frontend | Backend | APIs |
| :--- | :--- | :--- |
| **React** + **Vite** | **Flask** (Python) | **YouTube Data API v3** |
| **TailwindCSS** | | **Google Gemini AI API** |
| **Chart.js** | | |
| **Framer Motion** | | |

---

## 🏗️ Architecture Overview

The application follows a modern client-server architecture:
1. **Client (React + Vite)**: Handles the user interface, routing, state management, and data visualization. It makes RESTful API calls to the backend to fetch channel data and AI insights.
2. **Server (Flask)**: Acts as a secure middleman and processor. It securely communicates with the YouTube Data API to fetch channel statistics, processes the data, and passes relevant metrics to the Gemini AI API to generate intelligent insights. It then formats and serves this data to the frontend application.

---

## 📁 Folder Structure

```text
YT-lytics/
├── backend/               # Flask backend application
│   ├── app.py             # Main entry point
│   ├── requirements.txt   # Python dependencies
│   └── ...
├── frontend/              # React + Vite frontend application
│   ├── src/               # Source code
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page layouts
│   │   ├── App.jsx        # Main React component
│   │   └── main.jsx       # Entry point
│   ├── package.json       # Node dependencies
│   ├── tailwind.config.js # Tailwind CSS configuration
│   └── ...
└── README.md              # Project documentation
```

---

## 🚀 Installation & Setup

Follow these steps to get the project running locally on your machine.

### Prerequisites
- Node.js (v16 or higher)
- Python (3.8 or higher)
- A Google Cloud Console project with YouTube Data API v3 enabled.
- A Google AI Studio API Key for Gemini integration.

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/YT-lytics.git
cd YT-lytics
```

### 2. Backend Setup (Flask)
Open a terminal and navigate to the backend directory:
```bash
cd backend
```

Create a virtual environment:
**Windows:**
```cmd
python -m venv venv
venv\Scripts\activate
```
**macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

Install the required Python packages:
```bash
pip install -r requirements.txt
```

### 3. Frontend Setup (React + Vite)
Open a new terminal window and navigate to the frontend directory:
```bash
cd frontend
```

Install the required Node packages:
```bash
npm install
```

---

## ⚙️ Environment Variables & API Setup

You need to set up environment variables for the backend to communicate with the APIs.

### Backend `.env`
Create a `.env` file in the `backend/` directory and add your API keys:
```env
# backend/.env
YOUTUBE_API_KEY=your_youtube_data_api_v3_key_here
GEMINI_API_KEY=your_google_gemini_api_key_here
```

### Frontend `.env` (Optional)
If your frontend needs specific environment variables (e.g., overriding the API base URL), create a `.env` file in the `frontend/` directory:
```env
# frontend/.env
VITE_API_BASE_URL=http://localhost:5000
```

---

## 🏃 Running the Application Locally

You will need two separate terminal windows running simultaneously to start both the frontend and backend servers.

### 1. Start the Backend Server
Ensure your virtual environment is activated, then run:
```bash
# In the backend/ directory
flask run
# OR
python app.py
```
*The Flask server should now be running, typically on `http://localhost:5000` or `http://127.0.0.1:5000`.*

### 2. Start the Frontend Development Server
In your second terminal window, run:
```bash
# In the frontend/ directory
npm run dev
```
*Vite will start the development server, usually accessible at `http://localhost:5173`. Open this URL in your browser to view the application.*

---

## 🔮 Future Improvements

- [ ] Implement user authentication to save favorite channels and personal notes.
- [ ] Add export functionality (PDF/CSV) for dashboard reports.
- [ ] Integrate YouTube OAuth for users to view their own private channel analytics.
- [ ] Expand AI capabilities for video title and thumbnail generation.
- [ ] Implement caching (e.g., Redis) to reduce API calls and improve loading times.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 👨‍💻 Author

**Your Name**
- GitHub: [@YOUR_USERNAME](https://github.com/YOUR_USERNAME)
- LinkedIn: [Your LinkedIn Profile](https://linkedin.com/in/YOUR_PROFILE)
- Portfolio: [Your Portfolio Website](https://your-portfolio.com)

---
*If you find this project interesting or helpful, please consider leaving a ⭐ on the repository!*
