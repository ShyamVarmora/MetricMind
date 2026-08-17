# MetricMind — User Guide

## 1. Overview

MetricMind is an Agentic Semantic Business Intelligence platform designed to help users understand business performance through dashboards, reports, analytics, charts, and natural-language interaction.

The application provides a user-friendly interface for viewing business metrics and interacting with analytics functionality.

---

## 2. Main Features

MetricMind provides the following major features:

- User registration and login
- Protected user profile
- Business dashboard
- KPI cards
- Sales charts
- Reports
- Analytics
- Natural-language business interaction
- API trace and backend integration
- Responsive user interface
- Light and dark theme support

---

## 3. Getting Started

To use MetricMind, the backend and frontend should be running.

Open the MetricMind frontend in a web browser.

The application provides navigation to the major business intelligence modules.

---

## 4. User Registration

New users can create an account using the registration functionality.

Typical registration information includes:

- Name
- Email
- Username
- Password

After successful registration, the user can log in using the registered credentials.

---

## 5. User Login

Use the Login functionality to access the application.

Enter the registered credentials and submit the login form.

After successful authentication, the user can access protected application functionality.

Authentication is handled through JWT-based authentication.

---

## 6. Dashboard

The Dashboard provides an overview of business performance.

The dashboard includes business KPIs such as:

- Total Sales
- Orders
- Revenue
- Profit
- Percentage change
- Business performance information

The dashboard also provides visual business information such as charts and recent business activity.

---

## 7. Dashboard Filters

The dashboard and analytics functionality provides filtering options where applicable.

Users can use available filters to analyze business information based on the selected criteria.

Filtering helps users focus on specific business periods, categories, products, or other available dimensions.

---

## 8. Reports

The Reports section provides business reporting functionality.

Available reports include:

### Sales Report

Provides an overview of sales performance.

### Revenue Report

Provides revenue-related business information.

### Customer Report

Provides customer-related insights.

### Monthly Report

Provides monthly business analysis.

Users can select the required report from the Reports section.

---

## 9. Analytics

The Analytics section provides deeper business performance analysis.

The Analytics page provides:

- Sales analysis
- Revenue analysis
- Customer analysis
- Product analysis
- Geography-related analysis
- KPI information
- Filtering functionality
- Analytical visualizations

Users can select the available filters to analyze the required business information.

---

## 10. Conversational AI

Metric
---

## 3. Starting the Application

Before using MetricMind, make sure both the backend and frontend servers are running.

### Backend

```bash
cd backend
uvicorn app.main:app --reload
