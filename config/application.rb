require_relative 'boot'

require "rails"
# Pick the frameworks you want:
require "active_model/railtie"
require "active_job/railtie"
require "active_record/railtie"
require "action_controller/railtie"
require "action_mailer/railtie"
require "action_view/railtie"
require "action_cable/engine"
require "sprockets/railtie"
# require "rails/test_unit/railtie"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module ReactBrowserifyOnRails
  class Application < Rails::Application

    # Configure Browserify to use babelify to compile ES6
    # config.browserify_rails.commandline_options = "-t [ babelify --presets [ es2015 react ] ]"
    config.browserify_rails.commandline_options = "-t [ babelify --presets [ es2015 react stage-0 ] --plugins [ syntax-async-functions transform-regenerator ] ]"
    # Run on all javascript files
    config.browserify_rails.force = true

    # Alternatively, only run on .es6 files
    # config.browserify_rails.force = ->(file) { File.extname(file) == ".es6" }

    unless Rails.env.production?
      # Make sure Browserify is triggered when asked to serve javascript spec files
      config.browserify_rails.paths << lambda { |p|
        p.start_with?(Rails.root.join("spec/javascripts").to_s)
      }
    end
  end
end
