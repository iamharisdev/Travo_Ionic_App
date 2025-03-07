How to run Trova Mobile App

1. clone the repo: git@github.com:Trova-Health/trova-provider-mobile.git
2. Position the command line in the root of the project: /trova-provider-mobile
3. Install dependencies with: npm i
4. Install ionic CLI: https://ionicframework.com/docs/intro/cli#install-the-ionic-cli
5. Create .env file based on the example that comes in the source code: .env.example

Once you finished the previous steps you'll have different ways to run the app:

1. Run locally in a web browser with the command:
   ionic serve
   https://ionicframework.com/docs/developing/previewing#run-locally-in-a-web-browser
2. Run in Android emulator or real device with the command:
   ionic cap sync && ionic cap open android
   https://capacitorjs.com/docs/android#running-your-app
3. Run in iOS simulator or real device with the command:
   ionic cap sync && ionic cap open ios
   https://capacitorjs.com/docs/ios#opening-the-ios-project
