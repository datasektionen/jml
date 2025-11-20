# Environment variables
See [configuration.ts](server/common/configuration.ts)

| Name                              | Default                                           | Description                                                           |
| --------------------------------- | ------------------------------------------------- | --------------------------------------------------------------------- |
| PORT                              | 8080                                              | Server port                                                           |
| NODE_ENV                          | production                                        |                                                                       |
| LOGIN_API_URL                     | https://login.datasektionen.se                    | URL to login                                                          |
| LOGIN_API_KEY                     | -                                                 | Login key                                                             |
| SPAM_API_URL                      | https://spam.datasektionen.se/legacy/api          | URL to spam                                                           |
| SPAM_API_KEY                      | -                                                 | Spam key                                                              |
| SEND_MAIL_IN_DEVELOPMENT          | false                                             | Should emails be sent in development?                                 |
| DEVELOPMENT_ADMIN_EMAIL           | -                                                 | What email to send emails to in development                           |
| GOOGLE_RECAPTCHA_API_URL          | https://www.google.com/recaptcha/api/siteverify   | URL to reCAPTCHA API                                                  |
| RECAPTCHA_SECRET_KEY              | -                                                 | Use this secret key for communication between your site and reCAPTCHA |
| REACT_APP_RECAPTCHA_PUBLIC_KEY    | -                                                 | Use this site key in the HTML code your site serves to users          |

## reCAPTCHA
This app uses reCAPTCHA v2

Get an API key from Google.

If using for localhost, set `localhost` as domain when creating key.

### Mocking
If you have no API key you could also mock the API by setting up an endpoint that responds to POST requests and responds with
```ts
{
    "success": true|false
}
```
