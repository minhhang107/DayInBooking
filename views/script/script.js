window.onload = function () {
  const signUpForm = document.querySelector("#sign-up-form");
  const logInForm = document.querySelector(".log-in-form");
  const email = document.querySelector("#email");
  const fname = document.querySelector("#fname");
  const lname = document.querySelector("#lname");
  const pwd = document.querySelector("#pwd");
  const username = document.querySelector("#username");
  const password = document.querySelector("#password");


  // validate log in information
  logInForm.addEventListener("submit", (e) => {
    if (!validateLogInForm()) e.preventDefault();
  });

  // validate sign up information
  signUpForm.addEventListener("submit", (e) => {
    if (!validateSignUpForm()) e.preventDefault();
  });

  function validateLogInForm() {
    var validated = true;
    const usernameValue = username.value.trim();
    const passwordValue = password.value.trim();
  

    if (usernameValue === "") {
      setError(username, "Username cannot be blank!");
      validated = false;
    } else setSuccess(username);

    if (passwordValue === "") {
      setError(password, "Password cannot be blank!");
      validated = false;
    } else setSuccess(password);

    return validated;
  }


  function validateSignUpForm() {
    var validated = true;
    const emailValue = email.value.trim();
    const fnameValue = fname.value.trim();
    const lnameValue = lname.value.trim();
    const pwdValue = pwd.value.trim();
    const emailRegex = /^[a-zA-Z0-9_.-]+@[a-zA-Z-]+\.[a-zA-Z]{2,3}$/;
    const pwdRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}$/;

    if (emailValue === "") {
      setError(email, "Email cannot be blank!");
      validated = false;
    } else if (!emailRegex.test(emailValue)) {
      setError(
        email,
        "Email is incorrect! Please provide a valid email address."
      );
      validated = false;
    } else setSuccess(email);

    if (fnameValue === "") {
      setError(fname, "First name cannot be blank!");
      validated = false;
    } else setSuccess(fname);

    if (lnameValue === "") {
      setError(lname, "Last name cannot be blank!");
      validated = false;
    } else setSuccess(lname);

    if (pwdValue === "") {
      setError(pwd, "Password cannot be blank!");
      validated = false;
    } else if (!pwdRegex.test(pwdValue)) {
      setError(
        pwd,
        "Password must be at least 8 characters or more including at least 1 number, 1 uppercase letter, 1 lowercase letter and no special character."
      );
      validated = false;
    } else setSuccess(pwd);

    return validated;
  }

  function setError(input, message) {
    const formGroup = input.parentElement;
    const small = formGroup.querySelector("small");
    const check = formGroup.querySelector(".fa-check-circle");
    const exclamation = formGroup.querySelector(".fa-exclamation-circle");

    if (input.classList.contains("success")) input.classList.remove("success");
    if (check.classList.contains("success")) check.classList.remove("success");

    small.innerText = message;
    small.classList.add("error");
    exclamation.classList.add("error");
    input.classList.add("error");
  }

  function setSuccess(input) {
    const formGroup = input.parentElement;
    const small = formGroup.querySelector("small");
    const check = formGroup.querySelector(".fa-check-circle");
    const exclamation = formGroup.querySelector(".fa-exclamation-circle");

    if (input.classList.contains("error")) input.classList.remove("error");
    if (exclamation.classList.contains("error"))
      exclamation.classList.remove("error");
    if (small.classList.contains("error")) small.innerText = "";

    check.classList.add("success");
    input.classList.add("success");
  }

  function insertDates() {
    const birthMonth = document.querySelector("#birthmonth");
    const birthDate = document.querySelector("#birthdate");
    const birthYear = document.querySelector("#birthyear");
    var months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    // insert years
    for (var i = 2020; i >= 1950; i--) {
      var option = document.createElement("option");
      option.textContent = i;
      option.value = i;
      birthYear.appendChild(option);
    }

    // insert months
    for (var i = 0; i < 12; i++) {
      var option = document.createElement("option");
      option.textContent = months[i];
      option.value = months[i];
      birthMonth.appendChild(option);
    }

    // get the number of days based on month, year
    birthMonth.onchange = function () {
      var newMonth = months.indexOf(birthMonth.value) + 1;
      var newYear = birthYear.value;

      maxDays = new Date(newYear, newMonth, 0).getDate();

    // insert days
      birthDate.innerHTML = "";
      for(var i=1; i<=maxDays;i++){
        var option = document.createElement('option');
        option.textContent= i;
        option.value = i;
        birthDate.appendChild(option);
      }
    };
  }

  insertDates();
};
