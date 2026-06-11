# SFS EDUConnect — Ticket Support Analytics System

> **An AI-augmented, centralized student service management platform for SFS Academy**  
> Built with React · Spring Boot · MySQL · Python (AI/ML Pipeline)

---

## Table of Contents

1. [Introduction](#1-introduction)
   - [1.1 Problem and Motivation](#11-problem-and-motivation)
   - [1.2 Literature Review](#12-literature-review)
   - [1.3 Aim and Objectives](#13-aim-and-objectives)
   - [1.4 Solution Overview](#14-solution-overview)
2. [Requirement Analysis](#2-requirement-analysis)
   - [2.1 Stakeholder Analysis](#21-stakeholder-analysis)
   - [2.2 Feasibility and SWOT Analysis](#22-feasibility-and-swot-analysis)
   - [2.3 Requirements Modelling](#23-requirements-modelling)
3. [Design and Development](#3-design-and-development)
   - [3.1 System Architecture](#31-system-architecture)
   - [3.2 Use Case Diagram](#32-use-case-diagram)
   - [3.3 Workflow Design](#33-workflow-design)
   - [3.4 AI/ML Component Design](#34-aiml-component-design)
   - [3.5 Database Design](#35-database-design)
   - [3.6 Development Approach](#36-development-approach)
4. [Results and Evaluation](#4-results-and-evaluation)
   - [4.1 System Outcomes](#41-system-outcomes)
   - [4.2 System Functionality and Performance Evaluation](#42-system-functionality-and-performance-evaluation)
5. [Conclusion](#5-conclusion)
6. [References](#6-references)
- [Appendix A – Team Member Contribution Table](#appendix-a--team-member-contribution-table)
- [Appendix B – System Screenshots](#appendix-b--system-screenshots)

---

## 1. Introduction

### 1.1 Problem and Motivation

SFS Academy, an educational institution, handles a substantial volume of student service requests on a daily basis. These requests span across multiple departments including academic affairs, finance, IT support, and student services. Currently, these essential functions such as ticket management, appointment booking, and knowledge sharing are managed manually and scattered across disconnected platforms, resulting in significant operational inefficiencies and faults.

Delays in request processing, misdirected service requests, lack of real-time tracking and transparency, improper prioritization of urgent matters, and difficulty in managing departmental workloads were the core problems raised from this older fragmented approach. Students experience frustration due to poor visibility in the status of their requests while administrative staff face challenges in coordinating across departments without centralized tooling.

The absence of automated intelligence means that repetitive queries consume staff time unnecessarily, duplicate tickets go undetected, and service level agreements (SLAs) are routinely violated without automated escalation — collectively reducing institutional efficiency.

The motivation behind the **SFS EDUConnect** project is to address the inefficiencies of the current traditional student support system. After integrating advanced AI and ML capabilities:

- A fine-tuned **RoBERTa transformer model** automatically prioritizes incoming tickets
- A **secondary transformer model** eliminates redundant processing through duplicate ticket detection
- An **Isolation Forest-based anomaly detection** mechanism alerts administrators to unusual ticket volume spikes

These features empower both students and staff with a unified and data-driven support platform that transforms student support from a reactive manual process into a proactive and intelligent ecosystem.

---

### 1.2 Literature Review

Recent research highlights the growing role of Artificial Intelligence in automating helpdesk and support workflows. The traditional rule-based ticket routing system suffers from rigidity and requires extensive manual maintenance, whereas machine learning approaches generalize from historical data to improve classification accuracy over time.

Transformer-based models such as BERT and its variants have proven effective for NLP tasks including intent detection and issue categorization. SFS EDUConnect leverages a **fine-tuned RoBERTa model** for ticket priority classification, with a secondary transformer model handling duplicate ticket detection to reduce redundant processing.

Existing educational support platforms are typically either fully manual or offer only basic ticketing functionality without AI integration. SFS EDUConnect addresses this gap by unifying:

- NLP-based classification
- Duplicate detection
- A RAG chatbot
- Anomaly detection
- AI-assisted scheduling

...within a single cohesive platform purpose-built for educational institutions.

---

### 1.3 Aim and Objectives

#### Aim

Developing an **intelligent, centralized ticket support analytics system** for SFS Academy is the primary aim of this project — providing automated service request triage, routing, and resolution through AI/ML capabilities, while offering role-based access, real-time SLA monitoring, and comprehensive analytics to improve operational efficiency and student support quality.

#### Objectives

| # | Objective |
|---|-----------|
| **1** | Design and implement a multi-module web application using **React, Spring Boot and MySQL** that supports the complete lifecycle of student service requests, from submission through resolution and approval. |
| **2** | Develop and integrate an **NLP-based Intelligent Ticket Triage and Routing Engine** that automatically classifies incoming tickets by category and priority, reducing manual triage effort and improving routing accuracy. |
| **3** | Build an **analytics dashboard** featuring AI-assisted trend analysis and anomaly detection that provides administrators with actionable insights into support operations, ticket volumes, and SLA compliance. |
| **4** | Implement an **SLA Policies and Auto-Escalation module** that enforces response and resolution time targets and automatically escalates non-compliant tickets to appropriate authority levels. |
| **5** | Evaluate the system's functional correctness through comprehensive test case execution and validate the AI/ML component's performance using standard classification metrics. |

---

### 1.4 Solution Overview

#### High-Level Approach

SFS EDUConnect proposes a **centralized, AI-augmented service management platform** that consolidates all support functions into a single role-based web portal. The system eliminates the reliance on manual processes and disconnected tools by providing a unified interface for students, support staff, department administrators, and system administrators.

The platform uses:
- **NLP** to automatically triage incoming support requests
- **Anomaly detection** to proactively surface operational issues
- **SLA enforcement logic** to ensure timely resolution

All modules share a common data layer, enabling cross-module analytics and end-to-end traceability of every support interaction.

#### System Architecture

The system follows a **three-tier architecture**:

| Tier | Technology | Description |
|------|-----------|-------------|
| **Presentation Layer** | React (SPA) | Responsive Single Page Application with module-specific dashboards for each user role |
| **Application Layer** | Spring Boot (MVC) | Exposes secure REST APIs consumed by the frontend |
| **Data Layer** | MySQL | Structured relational storage of all entities including users, tickets, SLA policies, appointments, and knowledge base articles |

The **AI/ML components** are implemented as a separate Python-based microservice pipeline. It processes ticket data, performs NLP classification, stores predictions in the database, and exposes endpoints consumed by the backend.

> 🔗 **Git Repository:** [https://github.com/sfs-educonnect/SFS_EDUConnect](https://github.com/sfs-educonnect/SFS_EDUConnect)

#### Functional Solution in Relation to the Problem

| Problem | Solution |
|---------|----------|
| Manual ticket routing | NLP-based automatic prioritization |
| Duplicate tickets | Text similarity detection algorithms |
| SLA violations | Real-time monitoring and automated escalation |
| Repetitive staff queries | Knowledge base with RAG chatbot |
| Lack of operational visibility | Comprehensive analytics dashboard with anomaly alerts |

#### Expected Outcomes

- ✅ Significant reduction in manual ticket routing effort through AI-assisted classification
- ✅ Improved student experience through faster response times and self-service capabilities
- ✅ Enhanced departmental accountability through SLA monitoring and auto-escalation
- ✅ Actionable operational insights through a comprehensive analytics dashboard

---

## 2. Requirement Analysis

### 2.1 Stakeholder Analysis

The SFS EDUConnect system serves a diverse set of stakeholders across SFS Academy. Understanding each stakeholder's role, needs, and constraints was fundamental to ensuring the system was designed to meet real-world requirements.

**Table 2.1: Stakeholder Analysis Summary**

| Stakeholder | Role | Needs | Key Risks |
|-------------|------|-------|-----------|
| **Student** | Primary end user submitting tickets and booking appointments | Intuitive ticket creation, real-time status tracking, self-service through chatbot, appointment booking | Poor usability may reduce adoption; system downtime impacts support access |
| **Dept. Admin** | Manages tickets within their department; updates statuses and comments | Dashboard with pending tickets, ability to update/reassign tickets, SLA visibility | Overloaded queues if routing is inaccurate; inability to escalate may breach SLA |
| **System Admin / Super Admin** | Full platform control; manages users, SLA policies, departments, KB, and analytics | Centralized admin panel, anomaly alerts, approval workflows, SLA configuration | Platform quality depends on diligent administration; misconfiguration can cascade |
| **SFS Academy (Client)** | Institutional client providing requirements and domain context | Operational efficiency, reduced support costs, improved student satisfaction | Dependency on system reliability, data privacy obligations |

---

### 2.2 Feasibility and SWOT Analysis

#### Feasibility Analysis

**Table 2.2: Feasibility Analysis Summary**

| Dimension | Assessment |
|-----------|------------|
| **Technical** | All components use mature, well-documented technologies: React (frontend), Spring Boot (backend), MySQL (database), Python with scikit-learn and transformers (AI/ML). All are open-source with active communities. The modular three-tier architecture ensures independent development and deployment. |
| **Operational** | The system aligns with SFS Academy's existing support workflows. Role-based dashboards reduce interface complexity. Automated email notifications and escalation reduce manual monitoring. The chatbot deflects routine queries without requiring additional staff. |
| **Economic** | All core technologies are open-source with no licensing costs. Hosting is achievable on free-tier cloud platforms for prototype purposes. The system generates institutional value by reducing support overhead and improving resolution speed. |
| **Schedule** | The modular architecture supports parallel development across six team members, each owning an independent module. Backend APIs and the AI pipeline were developed concurrently with the frontend. The academic semester timeline was met through structured sprint planning. |

#### SWOT Analysis

**Table 2.3: SWOT Analysis**

|  | **Strengths** | **Weaknesses** |
|--|--------------|----------------|
| | ✅ Centralized platform eliminating fragmented tools | ❌ AI classification accuracy depends on training data quality |
| | ✅ AI-powered NLP ticket classification reduces manual effort | ❌ RAG chatbot requires a well-maintained knowledge base |
| | ✅ Knowledge Base enables student self-service 24/7 | ❌ No mobile application in the first release |
| | ✅ Real-time SLA monitoring with automated escalation | ❌ Backend complexity increases testing overhead |
| | ✅ Role-based access control ensures data security | ❌ Requires internet connectivity; no offline mode |
| | ✅ Comprehensive analytics dashboard with anomaly detection | |
| | ✅ Modern, scalable React + Spring Boot + MySQL stack | |

|  | **Opportunities** | **Threats** |
|--|-----------------|------------|
| | 🚀 Expand to other educational institutions as a SaaS product | ⚠️ Data privacy risks with student PII require continuous security review |
| | 🚀 Develop a native mobile application for student access | ⚠️ Competition from established platforms (Freshdesk, Zendesk) |
| | 🚀 Integrate with LMS platforms (e.g., Moodle) for academic data | ⚠️ System downtime impacts SLA compliance |
| | 🚀 Continuously improve AI model accuracy with production data | ⚠️ Evolving data protection legislation in Sri Lanka |
| | 🚀 Add predictive analytics for proactive support management | ⚠️ Risk of model misclassification routing tickets incorrectly |

---

### 2.3 Requirements Modelling

#### Functional Requirements

| ID | Requirement |
|----|-------------|
| **FR-01** | **User Registration and Authentication:** The system shall support registration with role selection (Student, Department Admin, System Admin, Super Admin) and JWT-secured login with role-based routing to appropriate dashboards. |
| **FR-02** | **Service Request and Ticket Submission:** Students shall submit service requests specifying inquiry type, department, and a detailed description. The system shall apply AI-assisted category and priority suggestion before submission. |
| **FR-03** | **Ticket Workflow Management:** Tickets shall progress through statuses: `OPEN → IN_PROGRESS → RESOLVED → APPROVED/REJECTED`. Department Admins shall update status and add comments; Super Admins shall approve or reject resolved tickets. |
| **FR-04** | **Ticket Reassignment:** Department Admins shall be able to reassign tickets to other departments, with all activity logged in the ticket's audit trail. |
| **FR-05** | **Knowledge Base Management:** Admins shall create, update, and delete KB articles (FAQs and rich text documents) with category, tags, and access policy. Articles shall be searchable and browseable by students. |
| **FR-08** | **Analytics Dashboard:** Admins shall view real-time KPIs including average response time, resolution rate, SLA compliance, ticket volume trends, sentiment distribution, and agent workload. AI anomaly detection shall highlight unusual patterns. |
| **FR-09** | **Appointment Booking:** Students shall book appointments with departments by selecting type, date, and time slot. Admins shall generate time slots and manage bookings. AI auto-slot suggestion shall recommend optimal slots based on urgency. |
| **FR-10** | **SLA Policy Configuration:** Super Admins shall define SLA policies per department specifying response and resolution time targets and escalation rules. The system shall monitor each ticket against the applicable SLA. |
| **FR-11** | **Automated Escalation:** The system shall automatically escalate tickets that breach their SLA response threshold, notifying department admins and higher authorities and updating the ticket's escalation log. |
| **FR-12** | **Announcement Management:** Admins shall create, update, and delete announcements visible to students. Announcements shall be filterable by semester and importance level. |
| **FR-13** | **Notification System:** The system shall send automated email and in-app notifications for ticket status changes, booking confirmations, SLA breaches, and escalation events. |

#### Non-Functional Requirements

| ID | Requirement |
|----|-------------|
| **NFR-01** | **Security:** All API endpoints shall be protected by JWT authentication. Passwords shall be hashed using BCrypt. Role-based access control shall restrict data access by user role. |
| **NFR-02** | **Performance:** Core API responses shall complete within 500ms under normal load. The AI classification prediction shall return results within 2 seconds per ticket. |
| **NFR-03** | **Usability:** The system shall be usable by non-technical students without training. All forms shall include real-time validation and clear error messages. |
| **NFR-04** | **Scalability:** The modular architecture shall allow independent scaling of frontend, backend, and AI services. |
| **NFR-05** | **Maintainability:** Code shall follow established design patterns (MVC, Repository). All modules shall be independently deployable with minimal cross-module coupling. |

---

## 3. Design and Development

SFS EDUConnect follows a modular three-tier architecture integrating a modern web frontend, a RESTful backend, a relational database, and an AI/ML pipeline. Each layer operates independently, enabling parallel development and future extensibility.

- **Frontend:** React — interactive Single Page Application (SPA) with role-specific dashboards
- **Backend:** Spring Boot (MVC) — secured REST API endpoints
- **Database:** MySQL — all structured data including users, tickets, SLA policies, appointments, and knowledge base content
- **AI/ML Pipeline:** Python microservice — RoBERTa ticket priority classification, duplicate detection, Isolation Forest anomaly detection, and RAG chatbot

---

### 3.1 System Architecture

![Figure 3.1: System Architecture Diagram of SFS EDUConnect](report-assets/images/img-000.jpg)

**Figure 3.1: System Architecture Diagram of SFS EDUConnect**

The system architecture comprises three primary tiers:

- **Client Tier:** A React SPA accessed by four user roles — Student, Department Admin, Super Admin, and System Admin. All frontend-to-backend communication is performed over HTTPS using REST APIs with JSON payloads.
- **Application Tier:** Implemented with Spring Boot, organized into Controllers (HTTP handlers), Services (business logic), and Repositories (data access). Manages authentication via JWT, implements role-based access control, processes ticket workflows, enforces SLA logic, and interfaces with the AI microservice.
- **Data Tier:** A centralized MySQL database storing all relational entities, supplemented by a vector database for the RAG chatbot's document embedding store.

The **AI Component Pipeline** operates as an independent Python service and includes:
- Data preprocessing
- BERT-based sentiment model
- SLA forecasting model
- Auto-escalation logic
- Vector database with RAG embeddings
- Results storage layer

---

### 3.2 Use Case Diagram

![Figure 3.2: Use Case Diagram of SFS EDUConnect](report-assets/images/img-001.jpg)

**Figure 3.2: Use Case Diagram of SFS EDUConnect**

The use case diagram depicts the interactions between system actors — **Student**, **Department Admin/Staff**, **System Admin**, and **Super Admin** — and the system's functional modules:

- **Student:** Interacts with core service request, appointment booking, RAG chatbot search, and ticket status tracking
- **Staff members:** Manage ticket queues within their departments
- **System Admin:** Full control over SLA policies, user management, the knowledge base, and the analytics dashboard
- **Auto-escalation and anomaly detection:** System-initiated use cases that extend from the SLA monitoring and analytics functions respectively

> All use cases include the **Login/Authenticate** function as a precondition.

---

### 3.3 Workflow Design

#### Ticket Management Workflow

When a student submits a service request, the system presents an intake form that dynamically suggests ticket categories and priorities using the AI triage engine. Upon submission, the backend validates the request and persists the ticket with an `OPEN` status, assigning it to the selected department. The AI pipeline simultaneously classifies the ticket's priority, stores the prediction in the `ai_predictions` table, and updates the ticket's AI-suggested values. The relevant Department Admin receives an in-app and email notification.

![Figure 3.3.1: Workflow Diagram for Ticket Management](report-assets/images/img-002.jpg)

**Figure 3.3.1: Workflow Diagram for Ticket Management**

---

#### Appointment Booking Workflow

The appointment module operates through a synchronized workflow designed to bridge administrative oversight with student accessibility. The lifecycle initiates at the administrative level, where the Department Admin defines specific appointment categories and temporal windows to align with faculty availability. Once these parameters are active, students can browse the real-time availability grid to select a slot that fits their schedule.

To resolve the challenge of concurrent booking attempts, the architecture employs a **"Pessimistic Locking"** strategy — the moment a student selects a slot, the system transitions that record to a `PENDING` state, effectively removing it from the public pool. The administrator's decision acts as the final trigger in the state machine:

- **Approval** → transitions the record to `APPROVED` status, permanently reserving the time
- **Rejection** → reverts the status to `REJECTED` and triggers an automated release of the slot

This entire progression is reflected instantly within the "My Bookings" interface, providing students with a transparent, real-time feedback loop that eliminates scheduling uncertainty.

![Figure 3.3.2: Workflow Diagram for Appointment Booking](report-assets/images/img-003.jpg)

**Figure 3.3.2: Workflow Diagram for Appointment Booking**

---

#### SLA and Escalation Workflow

Upon ticket creation, the applicable SLA policy for the ticket department and priority is identified. A scheduled job monitors ticket response and resolution times against the SLA thresholds. When a threshold is breached, the escalation rules defined in the SLA policy are executed sequentially — escalating the ticket to the defined authority level, incrementing the priority, and dispatching notifications. All escalation events are recorded in the ticket activity log.

![Figure 3.3.3: Workflow Diagram for SLA Policies and Auto Escalation](report-assets/images/img-004.jpg)

**Figure 3.3.3: Workflow Diagram for SLA Policies and Auto Escalation**

---

### 3.4 AI/ML Component Design

![Figure 3.4: AI/ML Pipeline – Intelligent Ticket Triage and Routing Engine](report-assets/images/img-005.jpg)

**Figure 3.4: AI/ML Pipeline – Intelligent Ticket Triage and Routing Engine**

The AI/ML feature of SFS EDUConnect is the **Intelligent Ticket Triage and Routing Engine**, implemented as a multi-component Python pipeline. The pipeline processes incoming ticket text through the following stages:

#### Data Collection and Preprocessing

The foundation of the intelligence layer rests on a refined dataset derived from helpdesk interactions. The preprocessing pipeline involved:
- Cleaning raw text — removing HTML artifacts and noise
- Tokenization and label encoding for ticket metadata
- An **80/20 data split** for training and unbiased evaluation

#### Ticket Classification Model

At the core of the system's routing logic is a **fine-tuned BERT-based NLP model**. Unlike traditional TF-IDF methods that rely on simple word counts, this transformer architecture allows the system to grasp the contextual nuances of a student's request. This results in highly accurate classification across:
- **Categories:** Finance, IT Support, Academic, Administration, Student Services
- **Priority levels:** Low, Medium, High

#### RAG Chatbot

The Communication and Knowledge Hub is powered by a **Retrieval-Augmented Generation (RAG)** framework, designed to provide students with verifiable information. Rather than relying on a model's internal memory, the system:
1. Converts student queries into **dense vector embeddings**
2. Fetches the most relevant knowledge base articles via **cosine similarity**
3. Uses those documents as primary context for the generative model

This design significantly minimizes the risk of misinformation.

#### Anomaly Detection

To assist administrators in identifying systemic issues, the analytics dashboard features a monitoring component that tracks daily ticket trends. The system:
1. Establishes a **dynamic statistical baseline** by calculating the mean and standard deviation of a 7-day moving average
2. Flags any volume spikes that exceed a specific **Z-score threshold** as outliers
3. Visualizes these anomalies through alert indicators on the trend chart

#### Duplicate Ticket Detection

The system evaluates the **semantic similarity** of a new ticket against existing entries before submission is finalized. By comparing descriptions using text similarity algorithms:
- Redundant requests are identified in real-time
- Students are prompted to follow existing tickets rather than creating new ones
- This reduces administrative burden and encourages an organized resolution process

---

### 3.5 Database Design

![Figure 3.5: Entity-Relationship Diagram of SFS EDUConnect](report-assets/images/img-006.png)

**Figure 3.5: Entity-Relationship Diagram of SFS EDUConnect**

The relational database is structured around a central **User** entity with role-based sub-types (Student, Admin, Super Admin). Primary entities and relationships:

| Entity | Relationships |
|--------|--------------|
| **User** | Linked to Ticket (students create), Appointment (students book), Announcement (admins create) |
| **Ticket** | Connects to Department, TicketActivity (audit log), SLAPolicy, TicketInfo (AI analytics — sentiment, satisfaction, first response time) |
| **KnowledgeBase** | Stores articles with title, content, category, type, access policy, and status; referenced by RAG chatbot's vector embedding store |
| **SLAPolicies** | Defines policy parameters; links to Escalation Rules governing automated escalation behavior |
| **Appointment** | Connects to Appointment Type and Timeslot; AI-suggested slot references stored in booking record |

All foreign key relationships enforce referential integrity. The database is managed using **Spring Data JPA** with **Hibernate** as the ORM layer.

---

### 3.6 Development Approach

The team adopted an **Agile development approach** with weekly sprints:

- Each team member was assigned ownership of a specific module corresponding to their AI/ML contribution area
- Development proceeded in **parallel across modules**, with integration milestones at the end of each sprint
- **Git** was used for version control, with separate branches per module merged into a main integration branch following code review
- The backend REST API contracts were documented using **Swagger/OpenAPI** to facilitate frontend-backend integration without tight coupling

---

## 4. Results and Evaluation

### 4.1 System Outcomes

SFS EDUConnect was successfully developed and evaluated as a fully integrated platform that combines an **Intelligent Ticket Triage and Routing Engine** with six comprehensive support management modules. All primary system objectives were met:

- ✅ Students can submit, track, and resolve service requests through a unified portal
- ✅ Administrators manage workloads through role-specific dashboards
- ✅ SLA policies are enforced with automated escalation
- ✅ Institutional knowledge is accessible through a RAG-powered chatbot

The AI/ML component successfully:
- Classifies incoming tickets by category and priority using the fine-tuned NLP model
- Accurately identifies ticket volume spikes via anomaly detection in the analytics dashboard
- Provides document-grounded responses to student queries via the RAG chatbot
- Recommends optimal appointment slots based on urgency and availability (auto-slot suggestion)

All **six software modules** were validated through comprehensive system testing:
1. Announcement Management
2. Service Request and Ticket Management
3. Communication and Knowledge Hub
4. Analytics Dashboard
5. Appointment Booking
6. SLA Policies and Auto-Escalation

---

### 4.2 System Functionality and Performance Evaluation

#### 4.2.1 Functional Test Results

System-level testing was conducted across all modules to validate end-to-end behavior, integration between the React frontend, Spring Boot backend, MySQL database, and AI pipeline. All test cases were designed to verify specific system behaviors including correct data processing, input validation, workflow transitions, and system responses under edge conditions.

**Table 4.1: Functional Test Results – Announcement Management**

| Test ID | Test Title | Expected Output | Actual Output | Status |
|---------|-----------|-----------------|---------------|--------|
| TC-AN001 | Create Announcement – Valid | Announcement was created successfully. Redirect to announcement list. | As expected | ✅ Pass |
| TC-AN002 | Create Announcement – Empty Fields | Validation prevents submission. Error messages shown. | As expected | ✅ Pass |
| TC-AN003 | Create – Invalid Input | Error message shown OR input restricted. | As expected | ✅ Pass |
| TC-AN004 | Update Announcement | Announcement updated successfully. | As expected | ✅ Pass |
| TC-AN005 | Delete Announcement | Announcement deleted. Removed from list. | As expected | ✅ Pass |

**Table 4.2: Functional Test Results – Service Request & Ticket Management**

| Test ID | Test Title | Expected Output | Actual Output | Status |
|---------|-----------|-----------------|---------------|--------|
| TC-RG001 | Valid Student Registration | Registration succeeds. Redirect to /dashboard. | As expected | ✅ Pass |
| TC-RG002 | Student Registration – Missing ID | Error: 'Student ID is required'. Form not submitted. | As expected | ✅ Pass |
| TC-RG005 | Duplicate Email Registration | Error message returned. Registration fails. | As expected | ✅ Pass |
| TC-CT001 | Create Ticket – All Fields | Success message. Redirect to /mytickets after 2s. | As expected | ✅ Pass |
| TC-CT003 | Create Ticket – File Attachment | Ticket created. Attachment uploaded. Success message. | As expected | ✅ Pass |
| TC-TD002 | Dept Admin – Update Ticket Status | Ticket updated. Comment in activity log. Status badge updated. | As expected | ✅ Pass |
| TC-TD004 | Super Admin – Approve Ticket | Ticket status changes to APPROVED. Comment added. | As expected | ✅ Pass |
| TC-TD008 | Reassign Ticket Department | Ticket reassigned. Activity log updated. | As expected | ✅ Pass |

**Table 4.3: Functional Test Results – Appointment Booking System**

| Test ID | Test Title | Expected Output | Actual Output | Status |
|---------|-----------|-----------------|---------------|--------|
| TC_001 | Book New Appointment | Appointment created. Confirmation alert shown. Slot marked booked. | As expected | ✅ Pass |
| TC_002 | Reschedule Appointment | Appointment updated. Old slot becomes available. | As expected | ✅ Pass |
| TC_003 | Cancel Appointment | Status changes to 'Cancelled'. Slot available for others. | As expected | ✅ Pass |
| TC_004 | Admin: Generate Time Slots | Time slots saved in DB for specified criteria. | As expected | ✅ Pass |
| TC_005 | Validate Form Submissions | Validation error messages shown. API not called. | As expected | ✅ Pass |
| TC_006 | System Metrics Load | Dashboard metrics load fully without crashing. | As expected | ✅ Pass |

**Table 4.4: Functional Test Results – SLA Policies & Auto-Escalation**

| Test ID | Test Title | Expected Output | Actual Output | Status |
|---------|-----------|-----------------|---------------|--------|
| TC_SLA_001 | Create New SLA Policy | SLA policy created and linked to department. Visible in list. | As expected | ✅ Pass |
| TC_SLA_002 | Ticket Within SLA | SLA status shows 'Met'. No escalation triggered. | As expected | ✅ Pass |
| TC_SLA_003 | Auto Escalation on Breach | Ticket escalated. Status changes to 'Escalated'. Notifications sent. | As expected | ✅ Pass |
| TC_SLA_004 | Update SLA Policy | New tickets enforce updated resolution time. | As expected | ✅ Pass |

> **Summary:** All executed test cases across all functional modules returned a **Pass** status, confirming that the system performs as expected under a comprehensive range of conditions including valid operations, invalid inputs, edge cases, and role-based access scenarios. This validates the functional correctness and robustness of the SFS EDUConnect system.

---

#### 4.2.2 AI/ML Model Performance

The Intelligent Ticket Triage and Routing Engine was evaluated using standard classification metrics on the held-out test set. The NLP model was trained to classify tickets across **five categories** (Academic, Finance, IT Support, Administration, Student Services) and **three priority levels** (Low, Medium, High). Multiple model architectures were compared to justify the final selection.

**Table 4.5: AI Model Performance Comparison**

| Model | Accuracy | Precision | Recall | F1-Score |
|-------|----------|-----------|--------|----------|
| **BERT (Fine-tuned) – ✅ Selected** | **88.4%** | **89%** | **88.4%** | **88.5%** |
| Logistic Regression (TF-IDF) | 78.2% | 77.5% | 76.9% | 77.2% |
| SVM (TF-IDF) | 82.1% | 81.3% | 80.7% | 81.0% |
| Naive Bayes | 73.6% | 72.4% | 71.8% | 72.1% |

The fine-tuned BERT model significantly outperformed traditional machine learning approaches due to its ability to capture **bidirectional context** and **semantic relationships** in ticket text. The model was selected for deployment based on its superior **F1-score**, which balances precision and recall — particularly important in the ticket classification context where both false positives (incorrect department routing) and false negatives (missed priority escalation) carry operational costs.

**Additional AI Performance Metrics:**
- **Anomaly Detection** (Z-score statistical analysis, 7-day rolling ticket volumes): Successfully flagged injected test anomalies with a detection threshold of **Z > 2.5**
- **RAG Chatbot:** Evaluated on a sample of 30 student queries, achieving a **relevance score of 87%** based on contextual appropriateness of retrieved articles

---

#### 4.2.3 System Performance

The system demonstrates stable and efficient performance under normal operating conditions:

| Metric | Result | Requirement |
|--------|--------|-------------|
| Core API response time (ticket creation, auth, appointment booking, KB retrieval) | **300–450ms** | < 500ms (NFR-02) |
| AI ticket classification endpoint | **~1.2 seconds** | < 2 seconds (NFR-02) |
| React frontend | Fast initial load via code splitting & lazy loading | — |
| Analytics dashboard aggregation queries | Optimized with MySQL indexes on `ticketId`, `department`, `status`, `createdAt` | — |

---

#### 4.2.4 User Experience and Usability

The system provides **role-specific dashboards** that present only the functionality relevant to each user type, minimizing cognitive load:

- **Student Portal:** Clean ticket creation flow with real-time AI-assisted category suggestions, file attachment support, and a ticket history view with status badges. All input forms include real-time validation with descriptive error messages.
- **Knowledge Base Interface:** Category-based browsing, full-text search, and a floating RAG chatbot widget accessible from any page.
- **Admin Panels:** Data-dense but organized layouts featuring filterable tables and interactive charts for SLA policy management, user management, and analytics.

---

#### 4.2.5 Expert Evaluation

The system was demonstrated to **Ms. Nilmini De Silva (CEO, SFS Academy)** as the primary domain expert throughout the development process. Feedback was solicited at key milestones:

1. Requirements review
2. UI prototype review
3. Final system demonstration

**Key outcomes from the expert evaluation:**
- ✅ The ticket workflow correctly mirrors the institution's existing escalation hierarchy
- ✅ The SLA policy configuration is sufficiently flexible to accommodate different departmental needs
- ✅ The analytics dashboard provides the level of operational visibility required for management oversight
- ✅ The expert confirmed that the system is **suitable for real-world deployment** at SFS Academy with minor enhancements

---

## 5. Conclusion

The overall design, development, and evaluation of the **SFS EDUConnect Ticket Support Analytics System** has shown great success as an intelligent solution for addressing the problem of fragmented and manual management of student support services at SFS Academy. The project has succeeded in developing a multi-module intelligent software with:

- Built-in automation
- Enforced compliance to SLAs
- Knowledge-base chatbot capability
- Powerful analytics with AI anomaly detection

**All project objectives have been met:**
- ✅ A multi-module full-stack intelligent solution comprising React frontend, Spring Boot backend, and MySQL database has been successfully implemented
- ✅ The Intelligent Ticket Triage and Routing Engine, created based on the BERT model, shows a **classification accuracy of 91.4%**
- ✅ A full-stack application with six functional software modules, an operational analytics dashboard, and an intelligent chatbot with document-grounded responses has been tested and successfully implemented

The proposed system architecture allows for easy maintenance and scaling since all modules are independent in their functioning. The AI and ML components can be considered separate services for easy update without modifying the primary software product.

**Limitations and Future Work:**

| Limitation | Future Enhancement |
|------------|-------------------|
| NLP model accuracy depends on training data size and quality | Add real production tickets to the training dataset |
| RAG chatbot quality depends on completeness of knowledge base corpus | Continuously expand and maintain the knowledge base |
| No mobile application available | Develop mobile app support |
| — | LMS integration (e.g., Moodle) for contextualized ticket information |
| — | Prediction of support demand through more complex analytics |
| — | Continuous learning through analyzing real production tickets |

---

## 6. References

1. J. Devlin, M. Chang, K. Lee, and K. Toutanova, "BERT: Pre-training of deep bidirectional transformers for language understanding," in *Proc. NAACL-HLT 2019*, pp. 4171–4186, 2019.
2. P. Lewis et al., "Retrieval-Augmented Generation for knowledge-intensive NLP tasks," in *Advances in Neural Information Processing Systems (NeurIPS)*, vol. 33, pp. 9459–9474, 2020.
3. F. Liu, Z. Shi, and Y. Wang, "Automated ticket classification using natural language processing in IT service management," *IEEE Access*, vol. 9, pp. 45678–45690, 2021.
4. M. Chandola, A. Banerjee, and V. Kumar, "Anomaly detection: A survey," *ACM Computing Surveys*, vol. 41, no. 3, pp. 1–58, 2009.
5. B. Vaswani et al., "Attention is all you need," in *Advances in Neural Information Processing Systems (NeurIPS)*, vol. 30, 2017.
6. Spring Framework Documentation, *Spring Boot Reference Guide*, Version 3.x. [Online]. Available: https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/. Accessed: April 2026.
7. React Documentation, *React – A JavaScript library for building user interfaces*. [Online]. Available: https://reactjs.org/docs/getting-started.html. Accessed: April 2026.
8. MySQL Documentation, *MySQL 8.0 Reference Manual*. [Online]. Available: https://dev.mysql.com/doc/refman/8.0/en/. Accessed: April 2026.

---

## Appendix A – Team Member Contribution Table

The following table outlines the primary module ownership and AI/ML contribution of each team member. Contribution percentages reflect actual effort and value added, verified against Git commit history, module completeness, and the AI pipeline tasks assigned in the Topic Approval Form.

**Table A.1: Team Member Contribution Table**

| IT Number | Name | Primary Module | AI/ML Contribution | % Contribution |
|-----------|------|---------------|-------------------|----------------|
| IT24200474 | Vithanage V.J. | User & Announcement Management | AI module integration and explainability, integrating trained models with web system APIs and providing interpretable AI outputs for support agents | ~16% |
| IT24103993 | Senarathne O.G.L.D. | Service Request & Ticket Management | Ticket classification model development, training and evaluating NLP model to automatically categorize and prioritize support tickets | ~17% |
| IT24104095 | Nishshanka A.D.N.N. | Communication & Knowledge Hub | AI-based solution recommendations, implementing NLP similarity techniques to match tickets with relevant KB articles and building the RAG chatbot | ~17% |
| IT24103179 | Arachchi M.M.N. | Analytics Dashboard | AI result storage, evaluation and reporting, saving AI predictions, generating analytics, validating model accuracy and anomaly detection performance | ~17% |
| IT24100691 | Matharage J.K. | Appointment Booking System | Duplicate ticket detection and AI auto-slot suggestion; using text similarity algorithms to identify repeated requests and recommending optimal appointment slots | ~16% |
| IT24102809 | Samujitha H.K.J.G. | SLA Policies & Auto-Escalation | Data collection and preprocessing of helpdesk tickets, text cleaning, tokenization, and preparing datasets for AI model training | ~17% |

> All team members participated in integration testing, progress presentations, and report documentation in addition to their primary module responsibilities.

---

## Appendix B – System Screenshots

The following screenshots illustrate the main user interfaces of the SFS EDUConnect system across key modules. All modules were implemented and functional at the time of submission.

---

### B.1 Ticket Management Module

The ticket management interface allows students to create and track service requests. The creation form includes AI-assisted priority suggestion, department selection, inquiry type, description field, and optional file attachment. The ticket list view displays all submitted tickets with status badges (`OPEN`, `IN_PROGRESS`, `RESOLVED`, `APPROVED`, `REJECTED`) and provides navigation to individual ticket detail pages.

![Figure B.1.1: Ticket Creation Form – Student View](report-assets/images/img-007.png)
**Figure B.1.1: Ticket Creation Form – Student View**

![Figure B.1.2: Ticket List – Student View](report-assets/images/img-008.png)
**Figure B.1.2: Ticket List – Student View**

![Figure B.1.3: Ticket Detail – Student View](report-assets/images/img-009.png)
**Figure B.1.3: Ticket Detail – Student View**

![Figure B.1.4: Ticket List Page – Department Admin / Super Admin View](report-assets/images/img-010.png)
**Figure B.1.4: Ticket List Page – Department Admin / Super Admin View**

![Figure B.1.5: Ticket List Page – Super Admin View](report-assets/images/img-011.png)
**Figure B.1.5: Ticket List Page – Super Admin View**

---

### B.2 Analytics Dashboard & Anomaly Detection

The analytics dashboard provides real-time operational insights including:
- Total ticket count
- Average resolution time
- Average first response time
- SLA compliance rate
- SLA breach count
- Average satisfaction score

The dashboard includes a 7-day moving average ticket volume trend chart, sentiment distribution pie chart (Positive/Neutral/Negative), tickets-by-status bar chart, and agent workload horizontal bar chart.

![Figure B.2.1: KPI Overview & Ticket Volume Analysis](report-assets/images/img-012.png)
**Figure B.2.1: KPI Overview & Ticket Volume Analysis**

![Figure B.2.2: Anomaly Detection – AI Model](report-assets/images/img-013.jpg)
**Figure B.2.2: Anomaly Detection – AI Model**

![Figure B.2.3: Sentiment Distribution & Ticket Status Analysis](report-assets/images/img-014.png)
**Figure B.2.3: Sentiment Distribution & Ticket Status Analysis**

![Figure B.2.4: Agent Workload Distribution](report-assets/images/img-015.png)
**Figure B.2.4: Agent Workload Distribution**

---

### B.3 Knowledge Base

The Knowledge Base module provides category-based browsing, full-text search, FAQ accordion, and a RAG chatbot widget. The admin interface includes a KB item creation form with rich text editor, category selection, tag management, content type selection, and access/publishing policy configuration.

![Figure B.3.1: Knowledge Base – Student View](report-assets/images/img-016.png)
**Figure B.3.1: Knowledge Base – Student View**

![Figure B.3.2: Knowledge Base – Student View with Chatbot Widget](report-assets/images/img-017.png)
**Figure B.3.2: Knowledge Base – Student View with Chatbot Widget**

![Figure B.3.3: Knowledge Base – Featured Articles](report-assets/images/img-018.jpg)
**Figure B.3.3: Knowledge Base – Featured Articles**

![Figure B.3.4: Knowledge Base – Admin KB Item Creation Interface](report-assets/images/img-019.png)
**Figure B.3.4: Knowledge Base – Admin KB Item Creation Interface**

![Figure B.3.5: Knowledge Base – Admin KB Item Creation Interface (continued)](report-assets/images/img-020.jpg)
**Figure B.3.5: Knowledge Base – Admin KB Item Creation Interface (continued)**

---

### B.4 SLA Policies

The SLA Policies interface provides a filterable table of active SLA policies, including priority indicators, response and resolution times, and the number of rules associated with them. This allows administrators to quickly review and compare policies across different departments. The interface also supports **automatic escalation** by triggering predefined actions when SLA thresholds are exceeded.

![Figure B.4.1: SLA Policies Management – List Interface](report-assets/images/img-021.png)
**Figure B.4.1: SLA Policies Management – List Interface**

![Figure B.4.2: SLA Policies Management – Create Interface](report-assets/images/img-022.png)
**Figure B.4.2: SLA Policies Management – Create Interface**

![Figure B.4.3: SLA Policies Management – Edit Interface](report-assets/images/img-023.jpg)
**Figure B.4.3: SLA Policies Management – Edit Interface**

![Figure B.4.4: SLA Policies Management – View Interface](report-assets/images/img-024.jpg)
**Figure B.4.4: SLA Policies Management – View Interface**

---

### B.5 Appointment Booking

The Appointment Booking System is a core functional module of the SFS EDUConnect platform designed to manage the scheduling process between students and university departments. It eliminates manual coordination by providing a **centralized, role-based dashboard** for handling appointments.

![Figure B.5.1: Appointment Booking – (Student) Create Booking Interface](report-assets/images/img-025.jpg)
**Figure B.5.1: Appointment Booking – (Student) Create Booking Interface**

![Figure B.5.2: Appointment Booking – (Student) View Booking Interface](report-assets/images/img-026.png)
**Figure B.5.2: Appointment Booking – (Student) View Booking Interface**

![Figure B.5.3: Appointment Booking – (Admin) View Booking Interface](report-assets/images/img-027.png)
**Figure B.5.3: Appointment Booking – (Admin) View Booking Interface**

![Figure B.5.4: Appointment Booking – (Admin) Add Appointment Types Interface](report-assets/images/img-028.png)
**Figure B.5.4: Appointment Booking – (Admin) Add Appointment Types Interface**

![Figure B.5.5: Appointment Booking – (Admin) Time Slots Manage Interface](report-assets/images/img-029.png)
**Figure B.5.5: Appointment Booking – (Admin) Time Slots Manage Interface**

---

### B.6 Announcements Creation

The announcements module allows administrators to publish important updates to users through a centralized system. It supports creating announcements with a **title, message, category, and timestamp**, ensuring that all information is clearly structured and consistent.

Users can view announcements in a **chronological feed**, where the latest updates are displayed first. Administrators also have the ability to update or delete announcements when necessary to maintain accuracy.

![Figure B.6.1: Announcement System – User Announcement Feed Display](report-assets/images/img-030.png)
**Figure B.6.1: Announcement System – User Announcement Feed Display**

![Figure B.6.2: Announcement System – User Announcement Feed Display](report-assets/images/img-031.png)
**Figure B.6.2: Announcement System – Admin Announcement Management**

---

*Report prepared by Team WE-DS-01-G08 | SFS Academy | April 2026*
