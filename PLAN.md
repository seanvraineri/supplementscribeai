# SupplementScribe Development Plan

This document outlines the development plan for SupplementScribe. We will use this checklist to track our progress.

---

### **Phase 1: Foundation & Setup**
*   [x] Initialize Next.js 14 App Router project.
*   [x] Set up Supabase project and link it locally using the CLI.
*   [x] Create `.env.local` with Supabase credentials.
*   [x] Create initial database schema for users and profiles via a migration file.
*   [x] Enable and configure Row-Level Security (RLS) for the `user_profiles` table.
*   [x] Implement basic user authentication (Sign Up, Sign In, Sign Out) with Supabase Auth.
*   [x] Resolve all build and environment variable issues.


### **Phase 2: Core User Data & Product DB**
*   [ ] Build the multi-step user intake questionnaire UI.
*   [ ] Create backend logic (`server actions` in Next.js) to securely store user demographics, goals, allergies, conditions, and medications.
*   [ ] Define and populate the `products` table from the provided CSV.

### **Phase 3: File Handling & AI Parsing**
*   [ ] Develop the secure file upload system to Supabase Storage.
*   [ ] Create the `parse-lab-data` Edge Function.
*   [ ] Trigger the `parse-lab-data` function when a new file is uploaded to a specific storage bucket.
*   [ ] Store the parsed, structured data (biomarkers, SNPs) in their respective database tables.

### **Phase 4: AI Plan Generation & Education**
*   [ ] Build the `generate-plan` Edge Function using GPT-4o to synthesize all user data into a structured supplement plan.
*   [ ] Create the UI for users to view their generated plan.
*   [ ] Build the `explain-marker` Edge Function to provide educational content.
*   [ ] Create the SNP & Biomarker Education page where users can view their results and explanations.

### **Phase 5: Advanced AI Tooling**
*   [ ] Implement the AI Chat Assistant UI.
*   [ ] Build the `chat` Edge Function using Gemini 1.5 Pro, ensuring it has access to user context.
*   [ ] Implement the Product Checker tool UI.
*   [ ] Build the `check-product` Edge Function to analyze third-party products.

### **Phase 6: Finalization & Review**
*   [ ] Conduct a full security and data privacy review, with a focus on HIPAA considerations.
*   [ ] Perform end-to-end testing of all features.
*   [ ] Polish UI/UX based on testing feedback.
*   [ ] Prepare for deployment. 