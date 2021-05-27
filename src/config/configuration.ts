export default () => ({
  host: process.env.HOST,
  port: parseInt(process.env.PORT, 10) || 3000,
  mongodb_uri: process.env.MONGODB_URI,
  jwt_secret: process.env.SECRET_KEY,
  mail: {
    mail_username: process.env.MAIL_USERNAME,
    mail_password: process.env.MAIL_PASSWORD,
    oauth_clientid: process.env.OAUTH_CLIENTID,
    oauth_client_secret: process.env.OAUTH_CLIENT_SECRET,
    oauth_refresh_token: process.env.OAUTH_REFRESH_TOKEN,
  },
});
