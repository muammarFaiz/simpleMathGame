
const ELEMENTS = {
    difficulityForm: document.querySelector("#difficulity_form"),
    loginForm: document.querySelector("#login_form"),
    registerForm: document.querySelector("#register_form"),
    toRegButton: document.querySelector("#to_register"),
    toLoginButton: document.querySelector("#to_login")
}

ELEMENTS.toRegButton.addEventListener("click", (event) => {
    event.preventDefault();
    ELEMENTS.loginForm.classList.add("hide");
    ELEMENTS.registerForm.classList.remove("hide");
});
ELEMENTS.toLoginButton.addEventListener("click", (event) => {
    event.preventDefault();
    ELEMENTS.loginForm.classList.remove("hide");
    ELEMENTS.registerForm.classList.add("hide");
});

// functions-------------------------------------------------functions------------------------------------------------------functions
