# GCP Deployment Guide — Spacedey

This guide outlines the steps to deploy the containerized Spacedey platform to Google Cloud Platform.

## Prerequisites

1. **GCP Project**: Create a new project in Google Cloud Console.
2. **Enable APIs**:
    - Cloud Build API
    - Cloud Run API
    - Cloud SQL Admin API
    - Cloud Storage API
    - Secret Manager API
3. **GCP CLI**: Install and initialize the Google Cloud CLI (`gcloud`).

## Setup Infrastructure

### 1. Cloud SQL (Postgres)

Create a Postgres instance and a database:

```bash
gcloud sql instances create spacedey-db --database-version=POSTGRES_15 --cpu=1 --memory=4GB --region=us-central1
gcloud sql databases create spacedey --instance=spacedey-db
```

### 2. Cloud Storage

Create a bucket for image uploads:

```bash
gsutil mb -p [PROJECT_ID] -c standard -l us-central1 -b on gs://spacedey-uploads
# Make objects public (optional, or use signed URLs)
gsutil iam ch allUsers:objectViewer gs://spacedey-uploads
```

### 3. Secret Manager

Store sensitive environment variables:

```bash
echo -n "your-db-password" | gcloud secrets create DB_PASSWORD --data-file=-
echo -n "your-jwt-secret" | gcloud secrets create JWT_SECRET --data-file=-
# Add others: PAYSTACK_SECRET_KEY, FLUTTERWAVE_SECRET_KEY, etc.
```

## Deployment via Cloud Build

Connect your GitHub repository to Cloud Build in the console and create a trigger using the `cloudbuild.yaml` file.

Alternatively, deploy manually from your terminal:

```bash
gcloud builds submit --config cloudbuild.yaml .
```

## Environment Variables for Cloud Run

In the Cloud Run service settings, map the secrets to environment variables:

- `POSTGRES_PASSWORD` -> `DB_PASSWORD:latest`
- `JWT_SECRET` -> `JWT_SECRET:latest`
- `GCP_STORAGE_BUCKET` -> `spacedey-uploads`

## Finalizing

After deployment, update your `NEXT_PUBLIC_APP_URL` in Cloud Run to the generated `.a.run.app` URL and ensure your Paystack/Flutterwave callback URLs match.
