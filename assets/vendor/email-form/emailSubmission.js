const formContactData = document.querySelector("#contact-form");
var recaptcha_response = "";

function displayError(thisForm, error) {
  thisForm.querySelector(".loading").classList.remove("d-block");
  thisForm.querySelector(".error-message").innerHTML = error;
  thisForm.querySelector(".error-message").classList.add("d-block");
}

function verifyCaptcha(token) {
  recaptcha_response = token;
  return recaptcha_response;
}

function emailFormSubmition(thisForm, action, formData, method) {
  fetch(action, {
    method: method,
    body: formData,
    headers: {
      Accept: "application/json",
    },
  })
    .then((response) => {
      thisForm.querySelector(".loading").classList.remove("d-block");
      if (response.ok) {
        thisForm.querySelector(".sent-message").classList.add("d-block");
        thisForm.querySelector(".sent-message").classList.add("fade-out");
        thisForm.reset();
      } else {
        response.json().then((data) => {
          if (Object.hasOwn(data, "errors")) {
            data["errors"].map((error) =>
              displayError(thisForm, `${error.field}: ${error.message}`)
            );
          } else {
            displayError(
              thisForm,
              "Oops! There was a problem submitting your form"
            );
          }
        });
      }
    })
    .catch((error) => {
      displayError(thisForm, error);
    });
}

async function handleSubmit(event) {
  event.preventDefault();
  let thisForm = this;
  const formData = new FormData(thisForm);
  let action = thisForm.getAttribute("action");
  let method = thisForm.getAttribute("method");
  let recaptchaSiteKey = document
    .querySelector(".g-recaptcha")
    .getAttribute("data-sitekey"); // saving the site key from attr div captcha

  if (!action) {
    // if the form action exist, then it run
    displayError(thisForm, "The form action property is not set!");
  }
  thisForm.querySelector(".loading").classList.add("d-block");
  thisForm.querySelector(".error-message").classList.remove("d-block");
  thisForm.querySelector(".sent-message").classList.remove("d-block");

  // if recaptchaSiteKey exist, then do it
  if (recaptchaSiteKey) {
    if(typeof grecaptcha !== "undefined"){
      if (recaptcha_response.length != 0) {
        emailFormSubmition(thisForm, action, formData, method);
        //console.log(`token: ${recaptcha_response}`);
      } else {
        displayError(thisForm, "reCAPTCHA is Required!");
      }
    } else {
      displayError(thisForm, 'The reCaptcha javascript API url is not loaded!')
    }
  }
}
formContactData.addEventListener("submit", handleSubmit);
