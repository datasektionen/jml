job "jml" {
  type      = "service"
  namespace = "jml"

  group "jml" {
    network {
      port "http" { }
    }

    service {
      name     = "jml"
      port     = "http"
      provider = "nomad"
      tags = [
        "traefik.enable=true",
        "traefik.http.routers.jml.rule=Host(`anmal.datasektionen.se`)",
        "traefik.http.routers.jml.tls.certresolver=default",
      ]
    }

    task "jml" {
      driver = "docker"

      config {
        image = var.image_tag
        ports = ["http"]
      }

      template {
        data        = <<ENV
PORT={{ env "NOMAD_PORT_http" }}
{{ with nomadVar "nomad/jobs/jml" }}
DATABASE_URL=postgres://jml:{{ .db_password }}@postgres.dsekt.internal:5432/jml
LOGIN_API_KEY={{ .login_api_key }}
HIVE_API_KEY={{ .hive_api_key }}
SPAM_API_KEY={{ .spam_api_key }}
REACT_APP_RECAPTCHA_PUBLIC_KEY={{ .recaptcha_public_key }}
RECAPTCHA_SECRET_KEY={{ .recaptcha_secret_key }}
{{ end }}
NODE_ENV=production
HIVE_API_URL=http://hive.nomad.dsekt.internal/api/v1
LOGIN_API_URL=http://sso.nomad.dsekt.internal/legacyapi
SPAM_API_URL=https://spam.datasektionen.se/legacy/api
GOOGLE_RECAPTCHA_API_URL=https://www.google.com/recaptcha/api/siteverify
ENV
        destination = "local/.env"
        env         = true
      }
    }
  }
}

variable "image_tag" {
  type = string
  default = "ghcr.io/datasektionen/jml:latest"
}
