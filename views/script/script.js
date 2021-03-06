window.onload = () => {
  const emailRegex = /^[a-zA-Z0-9_.-]+@[a-zA-Z-]+\.[a-zA-Z]{2,3}$/;
  const pwdRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}$/;

  const signUpForm = document.querySelector("#sign-up-form");
  const logInForm = document.querySelector(".log-in-form");
  const usrname = document.querySelector("#usrname");
  const email = document.querySelector("#email");
  const fname = document.querySelector("#fname");
  const lname = document.querySelector("#lname");
  const pwd = document.querySelector("#pwd");
  const username = document.querySelector("#username");
  const password = document.querySelector("#password");
  var total = document.querySelector("#total");
  var checkInFormatted = document.querySelectorAll(".checkInFormatted");
  var checkOutFormatted = document.querySelectorAll(".checkOutFormatted");
  const checkInDate = document.querySelectorAll(".checkInDate");
  const checkOutDate = document.querySelectorAll(".checkOutDate");
  const nums = document.querySelectorAll(".nums");
  const s = document.querySelectorAll(".s");
  const uploadForm = document.querySelector("#list-room-form");
  const title = document.getElementById("listTitle");
  const type = document.getElementById("listType");
  const roomNums = document.getElementById("listRoomNums");
  const street = document.getElementById("listStreet");
  const city = document.getElementById("listCity");
  const state = document.getElementById("listState");
  const postalCode = document.getElementById("listPostalCode");
  const description = document.getElementById("listDescription");
  const price = document.getElementById("listPrice");
  const photo = document.getElementById("listPhoto");
  const dbscontent = document.getElementById("content");
  const desc = document.getElementById("room-description");
  var reserveForm = document.querySelector("#reserve-form");
  const searchForm = document.getElementById("search-form");
  const paymentForm = document.getElementById("payment-form");
  const confirmModal = document.getElementById("confirmModal");
  const roomPhoto = document.querySelector(".room-photo");
  tinymce.init({
    selector: "#listDescription",
    height: 300,
    content_style: "body { font-family: Tajawal; }",
    menubar: false,
    plugins: "paste",
    toolbar:
      "undo redo | " +
      "bold italic | alignleft aligncenter " +
      "alignright alignjustify | bullist numlist outdent indent | " +
      "removeformat | help",
    paste_as_text: true,
  });

  if (confirmModal)
    document.querySelector('[data-target="#confirmModal"]').click();

  if (searchForm) {
    searchForm.addEventListener("submit", (e) => {
      if (!validateSearch()) e.preventDefault();
    });
  }

  if (nums && s) {
    for (var i = 0; i < nums.length; i++) {
      if (nums[i].textContent.trim() === "1") {
        s[i].innerHTML = "room";
      } else s[i].innerHTML = "rooms";
    }
  }

  if (desc && dbscontent) {
    desc.innerHTML = dbscontent.textContent;
  }

  if (uploadForm) {
    uploadForm.addEventListener("submit", (e) => {
      if (!validateUpload()) {
        e.preventDefault();
      }
    });
  }

  if (uploadForm) {
    uploadForm.addEventListener("submit", (e) => {
      const listDescriptionContent = document.getElementById(
        "listDescriptionContent"
      );
      if (listDescriptionContent) {
        var tinyContent = tinyMCE.activeEditor.getContent();
        listDescriptionContent.value = tinyContent;
      }
    });
  }

  if (reserveForm) {
    reserveForm.addEventListener("submit", (e) => {
      if (!validateDate(reserveForm.checkIn.value, reserveForm.checkOut.value))
        e.preventDefault();
    });
  }

  if (paymentForm) {
    paymentForm.addEventListener("submit", (e) => {
      if (!validateDate(paymentForm.checkIn.value, paymentForm.checkOut.value))
        e.preventDefault();
    });
  }

  if (searchForm) {
    searchForm.addEventListener("submit", (e) => {
      if (!validateDate(searchForm.checkIn.value, searchForm.checkOut.value))
        e.preventDefault();
    });
  }

  if (checkInDate && checkOutDate && checkInFormatted && checkOutFormatted) {
    for (var i = 0; i < checkInDate.length; i++) {
      checkInFormatted[i].innerHTML = display_date(
        new Date(checkInDate[i].value)
      );
      checkOutFormatted[i].innerHTML = display_date(
        new Date(checkOutDate[i].value)
      );
    }
  }

  if (paymentForm) {
    paymentForm.checkIn.addEventListener("change", update_price);
    paymentForm.checkOut.addEventListener("change", update_price);
  }

  if (reserveForm) {
    reserveForm.checkIn.addEventListener("change", (e) => {
      validateDate(reserveForm.checkIn.value, reserveForm.checkOut.value);
    });
    reserveForm.checkOut.addEventListener("change", (e) => {
      validateDate(reserveForm.checkIn.value, reserveForm.checkOut.value);
    });
  }

  // validate log in information
  if (logInForm) {
    logInForm.addEventListener("submit", (e) => {
      if (!validateLogInForm()) e.preventDefault();
    });
  }

  // validate sign up information
  if (signUpForm) {
    signUpForm.addEventListener("submit", (e) => {
      if (!validateSignUpForm()) e.preventDefault();
    });
  }

  function days_between(date1, date2) {
    const milliseconds_a_day = 1000 * 60 * 60 * 24;
    const milliseconds_between = Math.abs(new Date(date1) - new Date(date2));
    return Math.round(milliseconds_between / milliseconds_a_day);
  }

  function display_date(date) {
    console.log(date);
    var year = date.getUTCFullYear();
    var month = date.getUTCMonth() + 1;
    var date = date.getUTCDate();

    month = month > 9 ? month : "0" + month;
    date = date > 9 ? date : "0" + date;

    return (dateString = year + " - " + month + " - " + date);
  }

  function update_price() {
    if (validateDate(paymentForm.checkIn.value, paymentForm.checkOut.value)) {
      paymentForm.totalDays.value = days_between(
        paymentForm.checkIn.value,
        paymentForm.checkOut.value
      );
      paymentForm.totalPrice.value =
        paymentForm.roomPrice.value * paymentForm.totalDays.value;
      total.innerHTML = "$" + paymentForm.totalPrice.value;
    } else {
      total.innerHTML = "Not available";
    }
  }

  function validateDate(checkIn, checkOut) {
    const dateError = document.getElementById("date-error");
    var validated = true;

    if (new Date(checkIn) < new Date()) {
      dateError.innerHTML =
        "Check in date has already passed. Please choose another date.";
      validated = false;
    } else {
      if (new Date(checkOut) < new Date()) {
        dateError.innerHTML =
          "Check out date has already passed. Please choose another date.";
        validated = false;
      } else {
        if (checkOut !== null && checkIn >= checkOut) {
          dateError.innerHTML =
            "Check out date must be after check in date. Please choose another date.";
          validated = false;
        } else dateError.innerHTML = "";
      }
    }
    return validated;
  }

  function validateSearch() {
    var validated = true;
    const cityName = document.getElementById("cityName");
    if (cityName.value === "") {
      setError(cityName, "Please choose a city");
      validated = false;
    } else setDefault(cityName);
    return validated;
  }

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
    } else if (!pwdRegex.test(passwordValue)) {
      setError(
        password,
        "Password must be at least 8 characters or more including at least 1 number, 1 uppercase letter, 1 lowercase letter and no special character."
      );
      validated = false;
    } else setSuccess(password);

    return validated;
  }

  function validateSignUpForm() {
    var validated = true;
    const usrnameValue = usrname.value.trim();
    const emailValue = email.value.trim();
    const fnameValue = fname.value.trim();
    const lnameValue = lname.value.trim();
    const pwdValue = pwd.value.trim();

    if (usrnameValue === "") {
      setError(usrname, "Username cannot be blank!");
      validated = false;
    } else setSuccess(usrname);

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

  function validateUpload() {
    var validated = true;
    var firstError;

    if (title.value === "") {
      setError(title, "Title cannot be blank.");
      firstError = title.parentElement;
      validated = false;
    } else setDefault(title);

    if (type.value === "") {
      setError(type, "Type of place cannot be blank.");
      if (validated) {
        firstError = type.parentElement;
        validated = false;
      }
    } else setDefault(type);

    if (roomNums.value === "") {
      setError(roomNums, "Numbers of rooms cannot be blank.");
      if (validated) {
        firstError = roomNums.parentElement;
        validated = false;
      }
    } else setDefault(roomNums);

    if (street.value === "") {
      setError(street, "Address cannot be blank.");
      if (validated) {
        firstError = street.parentElement;
        validated = false;
      }
    } else setDefault(street);

    if (city.value === "") {
      setError(city, "City cannot be blank.");
      if (validated) {
        firstError = city,parentElement;
        validated = false;
      }
    } else setDefault(city);

    if (state.value === "") {
      setError(state, "State cannot be blank.");
      if (validated) {
        firstError = state.parentElement;
        validated = false;
      }
    } else setDefault(state);

    if (postalCode.value === "") {
      setError(postalCode, "Postal code cannot be blank.");
      if (validated) {
        firstError = postalCode.parentElement;
        validated = false;
      }
    } else setDefault(postalCode);

    if (description.value === "") {
      setError(description, "Description cannot be blank.");
      if (validated) {
        firstError = description.parentElement;
        validated = false;
      }
    } else setDefault(description);

    if (price.value === "") {
      setError(price, "Price cannot be blank.");
      if (validated) {
        firstError = price.parentElement;
        validated = false;
      }
    } else setDefault(price);

    if(!roomPhoto){
      if (photo.value === "") {
        setError(photo, "You must upload a photo for your place.");
        if (validated) {
          firstError = photo.parentElement;
          validated = false;
        }
      } else setDefault(photo);
    }
    

    if (!validated)
      firstError.scrollIntoView(false);

    return validated;
  }

  function setError(input, message) {
    const formGroup = input.parentElement;
    const small = formGroup.querySelector("small");
    const check = formGroup.querySelector(".fa-check-circle");
    const exclamation = formGroup.querySelector(".fa-exclamation-circle");

    if (input.classList.contains("success")) input.classList.remove("success");
    if (check) {
      if (check.classList.contains("success"))
        check.classList.remove("success");
    }

    small.innerText = message;
    small.classList.add("error-message");
    if (exclamation) exclamation.classList.add("error");
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
    if (small.classList.contains("error-message")) small.innerText = "";

    check.classList.add("success");
    input.classList.add("success");
  }

  function setDefault(input) {
    const formGroup = input.parentElement;
    const small = formGroup.querySelector("small");
    if (input.classList.contains("error")) input.classList.remove("error");
    if (small.classList.contains("error-message")) small.innerText = "";
  }
};
