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
        "traefik.http.routers.jml.rule=HostRegexp(`(anmal|jml).datasektionen.se`)",
        "traefik.http.routers.jml.tls.certresolver=default",
        "traefik.http.routers.jml.middlewares=redirect-new,default@file",
        "traefik.http.middlewares.redirect-new.redirectregex.regex=^https?://jml\\.datasektionen\\.se/(.*)",
        "traefik.http.middlewares.redirect-new.redirectregex.replacement=https://anmal\\.datasektionen\\.se/$${1}",
        "traefik.http.middlewares.redirect-new.redirectregex.permanent=true",
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
SPAM_API_KEY={{ .spam_api_key }}
REACT_APP_RECAPTCHA_PUBLIC_KEY={{ .recaptcha_public_key }}
RECAPTCHA_SECRET_KEY={{ .recaptcha_secret_key }}
{{ end }}
NODE_ENV=production
PLS_API_URL=http://pls.nomad.dsekt.internal/api
LOGIN_API_URL=http://sso.nomad.dsekt.internal/legacyapi
SPAM_API_URL=https://spam.datasektionen.se/api
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
