# SupplementScribe AI

**SupplementScribe** is an AI-driven personalized supplement recommendation platform designed to combat the risks of uncontrolled, "one-size-fits-all" supplement consumption. It provides safe, effective, and highly personalized supplement plans based on scientific evidence and individual biomarker data.

This project is built on the principle that supplement recommendations should be as precise as medical prescriptions, leveraging data from user intake questionnaires and optional genetic/blood test results to generate its insights.

---

## 🧰 Tech Stack

*   **Frontend**: [Next.js](https://nextjs.org/) 14 (App Router)
*   **Backend**: [Supabase](https://supabase.com/) (Postgres, Auth, Storage, Edge Functions)
*   **UI**: [Tailwind CSS](https://tailwindcss.com/) & [ShadCN/UI](https://ui.shadcn.com/)
*   **AI Layer**: GPT-4o & Gemini 1.5 Pro
*   **Schema & Validation**: Zod
*   **Form Management**: React Hook Form

---

## 🚀 Getting Started

To get the project running locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd supplementscribeai
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file in the root of the project. You will need to add your Supabase Project URL and Anon Key. You can find these in your Supabase project dashboard under `Settings > API`.
    ```env
    NEXT_PUBLIC_SUPABASE_URL="YOUR_SUPABASE_URL"
    NEXT_PUBLIC_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"
    ```

4.  **Set up Supabase locally:**
    Ensure you have the [Supabase CLI](https://supabase.com/docs/guides/cli) installed. Link your local project to your remote Supabase instance.
    ```bash
    supabase link --project-ref <your-project-ref>
    # You will be prompted for your database password
    ```

5.  **Run the development server:**
    ```bash
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 📋 Project Plan

The detailed development plan and checklist is maintained in `PLAN.md`. 