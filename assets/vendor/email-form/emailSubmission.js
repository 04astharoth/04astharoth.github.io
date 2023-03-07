const formContactData = document.querySelector("#contact-form");

async function handleSubmit(event) {
  event.preventDefault();
  const form = new FormData(event.target);

  event.target.querySelector(".loading").classList.add("d-block");
  event.target.querySelector(".error-message").classList.remove("d-block");
  event.target.querySelector(".sent-message").classList.remove("d-block");

  fetch(event.target.action, {
    method: event.target.method,
    body: form,
    headers: {
      Accept: "application/json",
    },
  })
    .then((response) => {
      event.target.querySelector(".loading").classList.remove("d-block");
      if (response.ok) {
        event.target.querySelector(".sent-message").classList.add("active");
        event.target.querySelector(".sent-message").classList.add("fade-out");
        formContactData.reset();
      } else {
        response.json().then((data) => {
          if (Object.hasOwn(data, "errors")) {
            //console.log(data);
            event.target.querySelector(".error-message").innerHTML = data["errors"].map((error)=> `${error.field}: ${error.message}`);
            event.target.querySelector(".error-message").classList.add("d-block");
          } else {
            event.target.querySelector(".error-message").innerHTML = "Oops! There was a problem submitting your form";
            event.target.querySelector(".error-message").classList.add("d-block");
          }
        });
      }
    })
    .catch((error) => {
      event.target.querySelector(".error-message").innerHTML = error.text();
      event.target.querySelector(".error-message").classList.add("d-block");
    });
}
formContactData.addEventListener("submit", handleSubmit);
