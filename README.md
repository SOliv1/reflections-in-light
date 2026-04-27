# My Reflections App (React)
[![Jekyll site CI](https://github.com/SOliv1/reflections-in-light/actions/workflows/jekyll-docker.yml/badge.svg)](https://github.com/SOliv1/reflections-in-light/actions/workflows/jekyll-docker.yml)[![CodeQL](https://github.com/SOliv1/reflections-in-light/actions/workflows/github-code-scanning/codeql/badge.svg)](https://github.com/SOliv1/reflections-in-light/actions/workflows/github-code-scanning/codeql)

## View the Reflections Project [Here](https://reflections-in-light.onrender.com/)

## Deployment Notes

For stable mobile deployment with a Netlify frontend and Render API:

- Set `REACT_APP_API_URLS` in Netlify to your Render API base URL, for example `https://reflections-api.onrender.com`
- Set `CORS_ALLOWED_ORIGINS` in Render to your Netlify site URL, plus any preview domains you want to allow
- Local development can still use `http://localhost:5000`

## Actions Reminders

The `Actions` drawer includes a browser push reminder flow:

- Open `Reflections` and then `Quiet Actions`
- Add the tasks or intentions you want to remember
- Choose a reminder time and tap `Enable reminders`
- Allow notifications when the browser asks
- Use `Send test notification` to confirm the device receives push messages

Mobile note:

- Android browsers generally support this well
- On iPhone, the most reliable setup is Safari plus adding the site to the Home Screen on iOS 16.4 or later

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Mocktesting the weatherGlyph weather-moods

vist ocalhost:3000/mock-weather in your browser

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
