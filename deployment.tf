terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = ">= 4.0.0" # Ensure latest Google provider version
    }
  }
}

provider "google" {
  credentials = file("terraform-key.json")  # Path to your service account key
  project     = "<YOUR_PROJECT_NAME>"
  region      = "us-east1"
}

resource "google_project_service" "enable_cloud_functions" {
  project = "<YOUR_PROJECT_NAME>t"
  service = "cloudfunctions.googleapis.com"
}

resource "google_project_service" "enable_cloud_run" {
  project = "<YOUR_PROJECT_NAME>"
  service = "run.googleapis.com"
}


resource "google_project_service" "enable_firestore" {
  project = "<YOUR_PROJECT_NAME>"
  service = "firestore.googleapis.com"
}

resource "google_firestore_database" "firestore" {
  name     = "(default)"  # Use '(default)' for the primary database
  location_id = "us-east1" # Replace with your desired Firestore region
  type     = "FIRESTORE_NATIVE"     # Firestore Native mode
}

resource "google_project_service" "enable_storage" {
  project = "<YOUR_PROJECT_NAME>"
  service = "storage.googleapis.com"
}

resource "google_firestore_index" "users_index" {
  collection = "users" # Firestore collection name

  fields {
    field_path = "username"
    order      = "ASCENDING" # Index on 'username' in ascending order
  }

  fields {
    field_path = "password"
    order      = "ASCENDING" # Index on 'password' in ascending order
  }
}


resource "google_storage_bucket" "image_bucket" {
  name          = "picturebook-images"
  location      = "US"
  storage_class = "STANDARD"
  uniform_bucket_level_access = true
    lifecycle_rule {
    action {
      type = "Delete"
    }
    condition {
      age = 365   #this is in days
    }
  }
}


resource "google_storage_bucket_iam_member" "public_access" {
  bucket = google_storage_bucket.image_bucket.name
  role   = "roles/storage.objectViewer"
  member = "allUsers"
}

resource "google_cloudfunctions_function" "firestore_trigger_function" {
  name        = "firestore-user-trigger"
  description = "Creates a folder in the Cloud Storage bucket when a user is added to Firestore"
  runtime     = "python310"
  entry_point = "entry_point_function" # Replace with your actual entry point function name
  available_memory_mb = 128
  source_archive_bucket = google_storage_bucket.function_code_bucket.name
  source_archive_object = google_storage_bucket_object.function_code.name
  event_trigger {
    event_type = "providers/cloud.firestore/eventTypes/document.create"
    resource   = "projects/<YOUR_PROJECT_NAME>/databases/(default)/documents/users/{userId}"
  }

  environment_variables = {
    BUCKET_NAME = google_storage_bucket.image_bucket.name
  }
}

# Storage bucket for Cloud Function source code
resource "google_storage_bucket" "function_code_bucket" {
  name          = "deeptanshu-trigger-code"
  location      = "US"
  force_destroy = true
}

resource "google_storage_bucket_object" "function_code" {
  name   = "function-code.zip"
  bucket = google_storage_bucket.function_code_bucket.name
  source = "<YOUR_SOURCE_PATH>"
}


resource "google_storage_bucket_iam_member" "public_access_2" {
  bucket = google_storage_bucket.function_code_bucket.name
  role   = "roles/storage.objectViewer"
  member = "allUsers"
}

resource "google_cloud_run_service" "service" {
  name     = "memorylane-service"
  location = "us-east1"

  template {
    spec {
      containers {
        image = "<YOUR_IMAGE_FROM_ARTIFACT_REGISTRY>"
        
        # environment variables
        env {
          name  = "BUCKET_NAME"
          value = google_storage_bucket.image_bucket.name
        }
        env{
          name = "COLLECTION_NAME"
          value = "users"
        }
        env {
          name  = "ORIGINS"
          value = "<ORIGINS YOUW ANT TO PASS>"
        }
        env {
          name  = "SERVICE_ACCOUNT_JSON"
          value_from {
            secret_key_ref {
              name = "service-account" 
              key = "latest"
            }
          }
        }

        env {
          name  = "TERRAFORM_ACCOUNT_JSON"
          value_from {
            secret_key_ref {
              name = "terraform-key"
              key = "latest"
            }
          }
        }

        env {
          name  = "DB_CREDENTIALS"
          value_from {
            secret_key_ref {
              name = "db-credentials"
              key = "latest"
            }
          }
        }

        env {
          name  = "JWT_SECRET"
          value_from {
            secret_key_ref {
              name = "jwt-secret-key"
              key = "latest"
            }
          }
        }
        
        resources {
          limits = {
            memory = "1Gi"
            cpu    = "2"
          }
        }
      }
      container_concurrency = 80
      timeout_seconds       = 300
    }
  }

  depends_on = [
    google_project_service.enable_cloud_run
  ]
}

resource "google_cloud_run_service_iam_member" "noauth" {
  service    = google_cloud_run_service.service.name
  location   = google_cloud_run_service.service.location
  role       = "roles/run.invoker"
  member     = "allUsers"

  depends_on = [
    google_cloud_run_service.service
  ]
}


output "graphql_endpoint" {
  value = google_cloud_run_service.service.status[0].url
}


output "bucket_url" {
  value = "http://${google_storage_bucket.image_bucket.name}.storage.googleapis.com"
}
