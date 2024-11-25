fastlane documentation
----

# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```sh
xcode-select --install
```

For _fastlane_ installation instructions, see [Installing _fastlane_](https://docs.fastlane.tools/#installing-fastlane)

# Available Actions

## iOS

### ios beta

```sh
[bundle exec] fastlane ios beta
```

Push a new beta build to TestFlight

----

This README.md is auto-generated and will be re-generated every time [_fastlane_](https://fastlane.tools) is run.

More information about _fastlane_ can be found on [fastlane.tools](https://fastlane.tools).

The documentation of _fastlane_ can be found on [docs.fastlane.tools](https://docs.fastlane.tools).

# Env file to sign in
## Step 1 -  Create app specific password

Go to https://appleid.apple.com/account/manage login in and go to App-Specific Passwords, after generate a new App Specific Password copy it (if you don't have an app specific password, if you already have it please move to step 2).

## Step 2 - Create .env.default file

inside fastlane folder create a new file .env.default and add the two properties .

FASTLANE_USER=<Apple USER ID>
FASTLANE_APPLE_APPLICATION_SPECIFIC_PASSWORD=<App-Specific Password>

