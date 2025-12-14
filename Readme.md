Great question — this README is **very close**, it just needs to be **made real, executable, and production-aligned**.

Below is a **fully corrected, industry-grade README** that supports:

✅ **Docker (recommended)**
✅ **Shell script (`.sh`) startup**
✅ **Manual setup (frontend + backend)**
✅ **Accurate tech stack & buzzwords**
✅ **Clear prerequisites & env config**

You can **copy–paste this directly** as your `README.md`.

---

# 🚀 Agentic RAG with NL2SQL

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)
![Docker](https://img.shields.io/badge/docker-ready-blue.svg)
![Azure](https://img.shields.io/badge/azure-openai-blue.svg)

> **Agentic RAG with NL2SQL** is an end-to-end **AI-powered analytics and question-answering system** that converts **natural language queries into SQL**, executes them on analytical databases, and generates **context-aware, explainable responses** using **multi-agent LLM orchestration**.

The system combines **Agentic AI**, **Retrieval-Augmented Generation (RAG)**, and **NL2SQL** to deliver intelligent, scalable, and production-ready AI workflows.

---

## ✨ Key Features

* 🔁 **Agentic AI Orchestration** (Planner, Executor, Validator agents)
* 🧠 **NL2SQL Generation** with schema-aware reasoning
* 📚 **Hybrid RAG** (Vector DB + SQL Results)
* 🗂 **Conversation Memory** using MongoDB
* 📊 **Analytical Queries** on PostgreSQL
* 🔍 **Semantic Search** with Azure AI Search / Milvus
* ⚡ **FastAPI-based REST APIs**
* 🐳 **Dockerized (Dev & Prod Ready)**
* ☁️ **Azure-first architecture**

---

## 🧠 System Architecture (High Level)
![arch](Assets/image.png)
```
User Query
   ↓
Planner Agent
   ↓
NL2SQL Agent → PostgreSQL
   ↓
Retriever Agent → Vector DB
   ↓
Response Synthesizer Agent
   ↓
Final Answer (LLM)
```

---
## 🧠 High-Level Architecture (Logical Flow)
![Architecture Diagram](Assets\high_level_arch.png)


## 🛠️ Tech Stack

### **Frontend**

* React + Vite
* TypeScript
* Tailwind CSS
* REST API integration

### **Backend**

* **Agentic Frameworks:**

  * Microsoft Semantic Kernel
  * AutoGen (Multi-Agent Orchestration)
* **LLMs:**

  * Azure OpenAI (GPT-4.1-mini)
  * Local SLMs (Qwen 1.5B via Ollama)
* **RAG Stack:**

  * Azure AI Search
  * Milvus Vector Database
* **NL2SQL:**

  * Schema-aware SQL generation
  * Query validation & execution
* **API Layer:**

  * FastAPI (async, production-grade)
  * Pydantic (LLM response validation and parsing)

### **Databases**

* **MongoDB** → Chat history & memory
* **PostgreSQL** → Analytical & transactional data
* **Azure CosmosDB** → Used as Blob storage to store the PDF, Excels and other things.

### **DevOps & MLOps**

* Docker & Docker Compose
* Azure Cloud
* Git & GitHub
* Jenkins (CI/CD)
* WSL2 (Windows)

---

## ⚙️ Prerequisites

### **Required**

* Docker Desktop (with WSL2 enabled)
* Git
* Node.js ≥ 18 (only for manual setup)
* Python ≥ 3.10 (only for manual setup)

### **Optional**

* Azure OpenAI subscription
* Ollama (for local SLM inference)

---

## 📁 Project Structure

```
Agentic-Rag-with-NL2SQL/
│
├── Frontend/
│   ├── Dockerfile
│   └── ...
│
├── backend/
│   ├── Dockerfile
│   ├── main.py
│   └── requirements.txt
│
├── scripts/
│   └── start.sh
│
├── docker-compose.yml
├── .env.example
└── README.md
```

---

# 🚀 Getting Started (3 Ways)

---

## 🐳 Method 1: Docker (Recommended)

### 1️⃣ Clone the repository

```bash
git clone https://github.com/your-username/Agentic-Rag-with-NL2SQL.git
cd Agentic-Rag-with-NL2SQL
```

### 2️⃣ Configure environment variables

```bash
cp .env.example .env
```

Update `.env` with:

* Azure OpenAI keys
* Database credentials
* Vector DB endpoints

---

### 3️⃣ Start using Docker Compose

```bash
docker compose up --build
```

### 🔗 Access

* Frontend → [http://localhost:8080](http://localhost:8080)
* Backend API → [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 🐚 Method 2: Using Shell Script

📍 `scripts/start.sh`

```bash
#!/bin/bash
set -e

echo "Starting Frontend..."
cd Frontend
npm install
npm run build
npm run dev &

echo "Starting Backend..."
cd ../backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python main.py
```

### Run:

```bash
chmod +x scripts/start.sh
./scripts/start.sh
```

---

## 🛠 Method 3: Manual Setup (Without Docker)

### Frontend

```bash
cd Frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python main.py
```

---

## 🧪 Running Tests

```bash
# Frontend
npm test

# Backend
pytest
```

---

## 📦 Production Deployment

* Frontend: Vite → Nginx
* Backend: FastAPI + Uvicorn/Gunicorn
* Containers deployed via:

  * Azure Container Apps
  * Azure Kubernetes Service (AKS)

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch
3. Commit with clear messages
4. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 🔥 Next Improvements (Planned)

* RBAC & Auth (Azure AD)
* Query cost optimization
* Caching layer (Redis)
* Observability (OpenTelemetry)
* Feedback-driven learning loop

---


