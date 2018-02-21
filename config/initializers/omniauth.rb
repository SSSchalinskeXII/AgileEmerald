OmniAuth.config.logger = Rails.logger

Rails.application.config.middleware.use OmniAuth::Builder do
  provider :google_oauth2, '942557922750-a6s0okc0cev3cfrfrkj261mgos0hb6h4.apps.googleusercontent.com', 'PhlaYOR58R5XYKyQjml9_w46', {client_options: {ssl: {ca_file: Rails.root.join("cacert.pem").to_s}}}
end