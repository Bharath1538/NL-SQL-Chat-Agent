# NL-SQL AI Agent System with Role-Based Access Control

## Project Overview

This project is developed to simplify database interaction in enterprise environments using natural language. It enables users to query and manage structured data using plain English inputs, with the system automatically translating these into SQL queries. Integrated Role-Based Access Control (RBAC) ensures secure, personalized access and data protection for users based on their roles (Admin, Software Engineer, Architect, Tester,etc.). This intelligent solution is particularly suited for business teams looking to reduce dependency on SQL experts while maintaining data security.

## Features

* **Natural Language to SQL Conversion**: Converts user queries from plain English to SQL commands using an LLM-powered LangChain pipeline.
* **Role-Based Access Control**: Routes user queries through specific chains based on user designation to ensure data access policies are enforced.
* **Schema-Aware Querying**: Uses Retrieval-Augmented Generation (RAG) to fetch relevant database schema before generating SQL queries.
* **AI Agent Routing**: Implements LangGraph for dynamic agent routing, ensuring correct task delegation and control flow.
* **Vector-Based Schema Retrieval**: Embeddings and vector search retrieve relevant table schema to improve SQL generation accuracy.
* **User Authentication System**: Secure login and signup system built with PostgreSQL backend for storing user credentials and role-based metadata.
* **Chain of Thought + Output Cleaning**: Includes intermediate reasoning steps and regex-based SQL sanitization before execution.

## Technology Stack

* **Frontend**: React + TailwindCSS
* **Backend**: Node.js + Express
* **Database**: PostgreSQL
* **AI Stack**:

  * LangChain (LangGraph, Chains, Memory)
  * OpenAI / Ollama / Groq (LLMs)
  * FAISS / Chroma (Vector Database)
* **Authentication**: JWT-based secure auth
* **Programming Languages**: TypeScript, Python

## Installation

```bash
git clone https://github.com/yourusername/nl-sql-agent-rbac.git
cd nl-sql-agent-rbac
```


## Usage

1. **Configure Environment**:
   Set up environment variables for database URLs, JWT secrets, and API keys in `.env` files for both frontend and backend.

2. **Start Backend Server**:
   Ensure PostgreSQL is running and execute:

   ```bash
   npm run server
   ```

3. **Start Frontend App**:
   From the frontend directory, run:

   ```bash
   npm run dev
   ```

4. **User Login & Role Routing**:

   * Sign in as a user with one of the roles: Admin, Software Engineer, Architect, or Tester.
   * The system routes queries to different chains depending on the role.

5. **Natural Query Execution**:

   * Enter a question like “Show all pending tasks for testers” — the system processes, sanitizes, generates SQL, and fetches results with explanation.

6. **Follow-up Queries**:

   * Conversation memory enables contextual understanding of multi-turn interactions.


