import { auth } from "./lib/auth"; //import the auth client

const { data, error } = await auth.signUp.email({
    email, // user email address
    password, // user password -> min 8 characters by default
}, {
    onRequest: (ctx) => {
        //show loading
    },
    onSuccess: (ctx) => {
        //redirect to the dashboard or sign in page
    },
    onError: (ctx) => {
        // display the error message
        alert(ctx.error.message);
    },
});