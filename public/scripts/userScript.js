const form = document.getElementById('form');
const fname = document.getElementById('fname');
const lname = document.getElementById('lname');
const email = document.getElementById('email');
const password = document.getElementById('password');
const password2 = document.getElementById('password2');
const phone = document.getElementById('phone')
const otp = document.getElementById('otp')
const logout = document.getElementById('logout')
form.addEventListener('submit', (event) => {
    if (isFormValid() == true) {
        form.submit();
    } else {
        event.preventDefault();
    }
});
function isFormValid() {
    const check = document.querySelectorAll('form div');
    let result = false;
    check.forEach(item => {
        if (item.classList.contains('success')) {
            result = true;
        }
    });
    return result;
}
const setSuccess = element => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error')
    errorDisplay.innerText = ''
    inputControl.classList.add('success')
    inputControl.classList.remove('error')
}

const setError = (element, message) => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error')

    errorDisplay.innerText = message;
    inputControl.classList.add('error')
    inputControl.classList.remove('success')

}
const isValidEmail = () => {
    const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;;
    return re.test((email.value));
}
const isValidPhone = () => {
    const re = /^[6-9]\d{9}$/;
    return re.test((phone.value));
}
const validateRegister = () => {
    validateFname();
    validateLname();
    validateEmail();
    validatePhone();
    validatePassword();
    validatePassword2();
}
const validateLogin = () => {
    validateEmail();
    validatePassword();
}
const validateAdminLogin = () => {
    validateName();
    validatePassword();
}
const validateAddUser = () => {
    validateName();
    validateEmail();
    validatePassword();
    validatePassword2();
}
const validateEditUser = () => {
    validateName();
    validateEmail();
    validatePassword();
    validatePassword2();
}
function validOtp() {
    console.log(otp.value.trim());
    const otpvalue = otp.value.trim()
    if (otpvalue === '') {
        setError(otp, 'otp is Required')
    } else {
        setSuccess(otp)
    }
}
function validateFname() {
    const usernamevalue = fname.value.trim()
    if (usernamevalue === '') {
        setError(fname, 'Username is Required')
    } else {
        setSuccess(fname)
    }
}
function validateLname() {
    const usernamevalue = lname.value.trim()
    if (usernamevalue === '') {
        setError(lname, 'Username is Required')
    } else {
        setSuccess(lname)
    }
}
function validateEmail() {
    const emailvalue = email.value.trim()
    if (emailvalue === '') {
        setError(email, 'Email is Required')
    } else if (!isValidEmail(emailvalue)) {
        setError(email, 'Provide a valid Email Address')
    } else {
        setSuccess(email)
    }

}
function validatePhone() {
    const phonevalue = phone.value.trim()
    if (phonevalue === '') {
        setError(phone, 'Phone no is Required')
    } else if (phonevalue.length < 10) {
        setError(phone, 'Phone Number Must be 10 digits')
    } else if (!isValidPhone(phonevalue)) {
        setError(phone, 'Provide a valid Phone Number')
    } else {
        setSuccess(phone)
    }

}
function validatePassword() {
    const passwordvalue = password.value.trim()
    if (passwordvalue === '') {
        setError(password, 'Password is Required')
    } else if (passwordvalue.length < 4) {
        setError(password, 'Password Must be atleast 4 character')
    }
    else {
        setSuccess(password)
    }
}
function validatePassword2() {
    const passwordvalue = password.value.trim()
    const password2value = password2.value.trim()
    console.log('welcome')

    if (password2value === '') {
        setError(password2, 'Confirmation is Required')
    } else if (password2value !== passwordvalue) {
        setError(password2, "Password Doesn't Match ")
    }
    else {
        setSuccess(password2);
    }
}


let timerOn = true;
function timer(remaining) {
    var m = Math.floor(remaining / 60);
    var s = remaining % 60;
    m = m < 10 ? "0" + m : m;
    s = s < 10 ? "0" + s : s;
    document.getElementById("countdown").innerHTML = `Time left: ${m} : ${s}`;
    remaining -= 1;
    if (remaining >= 0 && timerOn) {
        setTimeout(function () {
            timer(remaining);
        }, 1000);
        document.getElementById("resend").innerHTML = `
    `;
        return;
    }
    if (!timerOn) {
        return;
    }
    document.getElementById("resend").innerHTML = `Don't receive the code? 
  <span class="font-weight-bold text-secondary cursor" onclick="timer(20)"><a class="text-decoration-none text-secondary" href="/register/resendOtp">Resend<a>
  </span>`;
}
timer(10);
