module.exports = {
  env: {
    MONGO_URI:
      "mongodb+srv://finebreed:Finebreed123.@hustlebee.hkmc6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    JWT_SECRET: "my-ultra-secure-and-ultra-long-secret",
    JWT_EXPIRES_IN: "1d",
    JWT_COOKIE_EXPIRES_IN: "1d",
    EMAIL_USERNAME: "apikey",
    EMAIL_PASSWORD:
      "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",
    EMAIL_HOST: "smtp.sendgrid.net",
    EMAIL_PORT: 587,
    DB_SECRET_KEY: "fnAEBVjlroACAYBwy1cKO7yCJuNq_MdM4qPTlfUw",
  },
  api: {
    externalResolver: true,
  },
  target: "serverless",
};
