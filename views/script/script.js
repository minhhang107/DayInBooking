window.onload = function () {
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
  const viewRoomButton = document.querySelector("#view-room-button");
  const roomsCont = document.querySelector("#rooms-list-container");
  var form = document.querySelector("#payment-form");
  var total = document.querySelector("#total");
  var checkInFormatted = document.querySelectorAll(".checkInFormatted");
  var checkOutFormatted = document.querySelectorAll(".checkOutFormatted");
  const checkInDate = document.querySelectorAll(".checkInDate");
  const checkOutDate = document.querySelectorAll(".checkOutDate");
  const nums = document.querySelectorAll(".nums");
  const s = document.querySelectorAll(".s");
  const uploadForm = document.querySelector("#list-room-form-1");
  const title = document.getElementById("listTitle");
  const street = document.getElementById("listStreet");
  const city = document.getElementById("listCity");
  const state = document.getElementById("listState");
  const postalCode = document.getElementById("listPostalCode");
  const description = document.getElementById("listDescription");
  const price = document.getElementById("listPrice");
  const photo = document.getElementById("listPhoto");
  const dbscontent = document.getElementById("content");
  const desc = document.getElementById("room-description");
  const reserveForm = document.querySelector("#reserve-form");
  const checkIn = document.getElementById("check-in");
  const checkOut = document.getElementById("check-out");
  const searchForm = document.getElementById("search-form");

  tinymce.init({
    selector: "#listDescription",
    height: 300,
    content_style: "body { font-family: Tajawal; }",
    menubar: true,
    plugins: "paste",
    toolbar: 'undo redo | ' +
  'bold italic | alignleft aligncenter ' +
  'alignright alignjustify | bullist numlist outdent indent | ' +
  'removeformat | help',
    paste_as_text: true,
  });

  if (searchForm){
    searchForm.addEventListener("submit", (e)=>{
      if(!validateSearch()) e.preventDefault();
    })
  }

function validateSearch(){
  var validated = true;
  const cityName = document.getElementById("cityName");
  if (cityName.value === "")
  {
    setError(cityName, "Please choose a city");
    validated = false;
  } else setDefault(cityName);
  return validated;
}

  if (nums && s) {
    for (var i = 0; i < nums.length; i++) {
      if (nums[i].textContent.trim() === "1") {
        s[i].innerHTML = "room";
      } else s[i].innerHTML = "rooms";
    }
  }

  if (uploadForm){
  uploadForm.addEventListener("submit", (e)=>{
    const  listDescriptionContent = document.getElementById("listDescriptionContent");
    if (listDescriptionContent){
      var tinyContent = tinyMCE.activeEditor.getContent();
    console.log(tinyContent);
    listDescriptionContent.value = tinyContent;
    }
  });
  }
  

  if (desc && dbscontent) {
    console.log(dbscontent);
    desc.innerHTML = dbscontent.textContent;
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

  if (form && total) {
    form.checkIn.addEventListener("change", update_price);
    form.checkOut.addEventListener("change", update_price);
    form.checkOut.addEventListener("change", ()=>{
      if (form.checkIn.value > form.checkOut.value){
        
      }
    })
  }

  if (viewRoomButton) {
    viewRoomButton.addEventListener("click", (e) => {
      roomsCont.style.display = "block";
    });
  }

  if (uploadForm) {
    uploadForm.addEventListener("submit", (e) => {
      if (!validateUpload()) e.preventDefault();
    });
  }

  if (reserveForm){
    reserveForm.addEventListener("submit", (e)=>{
      if (!validateReserve()) e.preventDefault();
    })
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
    form.totalDays.value = days_between(
      form.checkIn.value,
      form.checkOut.value
    );
    form.totalPrice.value = form.roomPrice.value * form.totalDays.value;
    total.innerHTML = form.totalPrice.value;
  }

  function days_between(date1, date2) {
    const milliseconds_a_day = 1000 * 60 * 60 * 24;
    const milliseconds_between = Math.abs(new Date(date1) - new Date(date2));
    return Math.round(milliseconds_between / milliseconds_a_day);
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

    if (title.value === "") {
      setError(title, "Title cannot be blank.");
      validated = false;
    } else setDefault(title);

    if (street.value === "") {
      setError(street, "Address cannot be blank.");
      validated = false;
    } else setDefault(street);

    if (city.value === "") {
      setError(city, "City cannot be blank.");
      validated = false;
    } else setDefault(city);

    if (state.value === "") {
      setError(state, "State cannot be blank.");
      validated = false;
    } else setDefault(state);

    if (postalCode.value === "") {
      setError(postalCode, "Postal code cannot be blank.");
      validated = false;
    } else setDefault(postalCode);

    if (description.value === "") {
      setError(description, "Description cannot be blank.");
      validated = false;
    } else setDefault(description);

    if (price.value === "") {
      setError(price, "Price cannot be blank.");
      validated = false;
    } else setDefault(price);

    if (photo.value === "") {
      setError(photo, "You must upload a photo for your place.");
      validated = false;
    } else setDefault(photo);
    return validated;
  }

  function validateReserve(){
    var validated = true;
    if (checkIn.value === "" ){
      setError(checkIn, "Please enter the check in date.");
      validated = false;
    }else setDefault(checkIn);

    if (checkOut.value === ""){
      setError(checkOut, "Please enter the check out date.");
      validated = false;
    } else setDefault(checkOut);

    if ((new Date(checkOut.value) - new Date(checkIn.value)) < 0){
      setError(checkOut, "Check out date must be after check in date.");
      validated = false;
    } else setDefault(checkOut);

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
