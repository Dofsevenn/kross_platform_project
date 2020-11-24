/*import nhost from "nhost-js-sdk";

const config = {
    base_url: "https://backend-iw3hrary.nhost.app"
};

nhost.initializeApp(config);

const auth = nhost.auth()
const storage = nhost.storage()

export { auth, storage }; */

import nhost from "nhost-js-sdk";
import { isPlatform } from "@ionic/react";
import { Plugins } from "@capacitor/core";
const { Storage } = Plugins;
let config;

if (isPlatform('capacitor')) {
    config = {    base_url: "https://backend-iw3hrary.nhost.app",
        use_cookies: false,
        client_storage: Storage,
        client_storage_type: "capacitor"
    };
} else {
    config = {
        base_url: "https://backend-iw3hrary.nhost.app",
        use_cookies: false,
        client_storage_type: "web"
    };
}
nhost.initializeApp(config);
const auth = nhost.auth();
const storage = nhost.storage();
export { auth, storage };