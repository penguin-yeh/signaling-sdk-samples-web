# Agora Signaling SDK for Web reference app

This repository holds the code examples used for the [Agora Signaling SDK for Web](https://docs.agora.io/en/signaling/overview/product-overview?platform=web) documentation. Clone the repo, run and test the samples, use the code in your own project. Enjoy.

- [Samples](#samples)
- [Prerequisites](#prerequisites)
- [Run this project](#run-this-project)
- [Contact](#contact)

**This reference app uses Signaling SDK v2.x**.

## Samples  

The runnable code examples are:

- [SDK quickstart](./src/sdk_quickstart/) - the minimum code you need to integrate low-latency, high-concurrency
  signaling features into your app using Signaling SDK.
- [Secure authentication with tokens](./src/authentication_workflow/) - quickly set up an authentication token server, retrieve a token from the server, and use it to connect securely to Signaling as a specific user.
- [Stream channels](./src/stream_channel/) - communicate to other users in topics.
- [Store channel and user data](./src/storage) - easily store data for users and channels without the need to
  set up your own databases. 
- [Connect through restricted networks with Cloud Proxy](./src/cloud_proxy/) - ensure reliable connectivity for your users when they connect from an
  environment with a restricted network.
- [Data encryption](./src/data_encryption) - integrate built-in data encryption into your app using Signaling.
- [Geofencing](./src/geofencing) - only connect to Signaling within the specified region.

## Prerequisites

Before getting started with this reference app, ensure you have the following set up:

- A [supported browser](../reference/supported-platforms#browsers).
- Physical media input devices, such as a camera and a microphone.
- The [pnpm](https://pnpm.io/installation#using-npm) package manager.


## Run this project

To run the sample projects in this folder, take the following steps:

1. **Clone the repository**

    To clone the repository to your local machine, open Terminal and navigate to the directory where you want to clone the repository. Then, use the following command:

    ```bash
    git clone https://github.com/AgoraIO/signaling-sdk-samples-web.git
    ```

1. **Install the dependencies** 

    Open Terminal in the root directory of this project and run the following command:

    ```bash
    pnpm install
    ```
   
1. **Modify the project configuration**

   This app loads connection parameters from [`./src/signaling_manager/config.json`](./src/signaling_manager/config.json).  If a valid `serverUrl` is provided, all samples use the token server to obtain a token, except the **SDK 
   quickstart**  which uses `token`.

   Ensure that `config.json` is populated with the required parameter values before running this reference app.

    - `uid`: The user ID associated with the application.
    - `appId`: (Required) The unique ID for the application obtained from [Agora Console](https://console.agora.io). 
    - `channelName`: The default name of the channel to join.
    - `token`:An token generated for `channelName`. You generate a temporary token using the [Agora token builder](https://agora-token-generator-demo.vercel.app/).
    - `serverUrl`: The URL for the token generator. See [Secure authentication with tokens](https://docs.agora.io/en/signaling/get-started/authentication-workflow) for information on how to set up a token server.
    - `tokenExpiryTime`: The time in seconds after which a token expires.

1. **Build and run the project**

   In the project folder, open Terminal and run the following command:

    ``` bash
    pnpm run dev
    ```
   Open the reference app using the URL displayed in Terminal. 

1. **Run the samples in the reference app**

   Choose a sample and test the code.

## Contact

If you have any questions, issues, or suggestions, please file an issue in our [GitHub Issue Tracker](https://github.com/AgoraIO/signaling-sdk-samples-web/issues).

