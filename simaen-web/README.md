DISTRIBUTION STATEMENT A. Approved for public release. Distribution is unlimited.

This material is based upon work supported under Air Force Contract No. FA8702-15-D-0001.
Any opinions,findings, conclusions or recommendations expressed in this material are those
of the author(s) and do not necessarily reflect the views of the Centers for Disease Control.

(c) 2021 Massachusetts Institute of Technology.

The software/firmware is provided to you on an As-Is basis

Delivered to the U.S. Government with Unlimited Rights, as defined in DFARS Part 252.227-7013
or 7014 (Feb 2014). Notwithstanding any copyright notice, U.S. Government rights in this work
are defined by DFARS 252.227-7013 or DFARS 252.227-7014 as detailed above. Use of this work
other than as specifically authorized by the U.S. Government may violate any copyrights that
exist in this work.

Copyright (c) 2021 Massachusetts Institute of Technology
SPDX short identifier: MIT

Developed as part of: SimAEN, 2021

# Getting Started with the SimAEN Web Tool

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

###  `REACT_APP_API_URL=http://cdc-simaen:1940/api/ PORT=3040 npm run start`

Runs the app in the development mode. It will expect the Flask API to be available on port 1940 (see the simaen-api repo for code).\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `REACT_APP_API_URL=http://cdc-simaen:1940/api/ PORT=3040 npm run test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more about the SimAEN web tool in the User Guide (simaen-web/public/SimAEN_User_Guide_Quick_Start.pdf in this repository). The SimAEN project report is available at (https://www.ll.mit.edu/r-d/publications/simulation-automated-exposure-notification-simaen-model).

To learn React, check out the [React documentation](https://reactjs.org/).
