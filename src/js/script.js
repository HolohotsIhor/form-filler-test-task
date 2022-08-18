(function (d) {
    const btnForm = d.querySelector("#btnSubmit");
    const emailSelector = "#email";
    const passwordSelector = "#password";
    const email = d.querySelector(emailSelector);
    const password = d.querySelector(passwordSelector);

    const isFieldEmpty = (value, selector) => {
        if (!value) {
            d.querySelector(selector).parentNode.classList.add("error");
        } else {
            d.querySelector(selector).parentNode.classList.remove("error");
        }
    }

    const validation = () => {
        const emailText = email.value;
        const passwordText = password.value;

        isFieldEmpty(emailText, emailSelector);
        isFieldEmpty(passwordText, passwordSelector);
    }

    btnForm.addEventListener("click",validation);
}(document));
