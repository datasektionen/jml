# Environment variables
See [configuration.ts](server/common/configuration.ts)

| Name                      | Default                                   | Description                                               |
| ------------------------- | ----------------------------------------- | --------------------------------------------------------- |
| PORT                      | 8080                                      | Server port                                               |
| NODE_ENV                  | production                                |                                                           |
| PLS_API_URL               | https://pls.datasektionen.se/api          | URL to pls api                                            |
| LOGIN_API_URL             | https://login.datasektionen.se            | URL to login                                              |
| LOGIN_API_KEY             | -                                         | Login key                                                 |
| SPAM_API_URL              | https://spam.datasektionen.se/api         | URL to spam                                               |
| SPAM_API_KEY              | -                                         | Spam key                                                  |
| SEND_MAIL_IN_DEVELOPMENT  | false                                     | Should emails be sent in development?                     |
| DEVELOPMENT_ADMIN_EMAIL   | -                                         | What email to send emails to in development               |
