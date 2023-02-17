ScrollReveal().reveal('.widget', { interval: 200 });

const form = document.getElementById('form');

const email = document.getElementById('email');
const password = document.getElementById('password');
const logout = document.getElementById('logout')

form.addEventListener("submit", function(event) {
    if (validateEmail() === true && validatePhone() === true ){
 form.submit()
    } else {
       event.preventDefault();
    }
});

function isFormValid() {
    const check = document.querySelectorAll('form div');
   let result =false
    check.forEach(item => {
        if (item.classList.contains('success')) {
         result =true;
        }
    });

    return result
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


function validOtp() {
    
    const otpvalue = otp.value.trim()
    if (otpvalue === '') {
        setError(otp, 'otp is Required')
    } else {
        setSuccess(otp)
    }
}

function validateEmail() {
    const emailvalue = email.value.trim()
    if (emailvalue === '') {
        setError(email, 'Email is Required')
        return false
    } else if (!isValidEmail(emailvalue)) {
        setError(email, 'Provide a valid Email Address')
        return false
    } else {
        setSuccess(email)
        return true
    }

}

function validatePhone() {
    const phonevalue = phone.value.trim()
    if (phonevalue === '') {
        setError(phone, 'Phone no is Required')
        return false
    } else if (phonevalue.length < 10) {
        setError(phone, 'Phone Number Must be 10 digits')
        return false
    } else if (!isValidPhone(phonevalue)) {
        setError(phone, 'Provide a valid Phone Number')
        return false
    } else {
        setSuccess(phone)
        return true
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

function addTocart(id) {
    const url = "/addTocart/" + id;
    const body = {
        id: id
    }
    fetch(url, {
        method: 'PATCH',
        headers: {
            'content-type': 'application/json'
        }, body: JSON.stringify({ body })
    }).then((response) => response.json())
        .then((response) => {
            if (response.successStatus) {
                const addTocart = document.getElementById('addTocart').style.display = "none"
                const goTocart = document.getElementById('goTocart')
                goTocart.classList.remove('button')
            }
            else if (response.redirect) {
                window.location.href = response.redirect
            } else {
                console.log(response.message)
            }
        }).catch((err) => console.log(err))
}


function addTowishlist(id) {
    const url = "/addTowishlist/" + id;
    const body = {
        id: id
    }
    fetch(url, {
        method: 'PATCH',
        headers: {
            'content-type': 'application/json'
        }, body: JSON.stringify({ body })
    }).then((response) => response.json())
        .then((response) => {
            if (response.successStatus) {
                const message = document.getElementById('addTowishlist')
               
                if (message.innerText == "Add To Wishlist") {
                    message.innerText = "Remove From Wishlist"
                } else {
                    message.innerText = "Add To Wishlist"
                }
            } else if (response.redirect) {
                window.location.href = response.redirect
            } else {
                window.location.href = response.redirect
                console.log(response.message)
            }
        }).catch((err) => console.log(err))
}
function removeWish(id) {
    const data = document.getElementById(id).dataset.url;
    const url = "/removeWishlist/" + data;

    fetch(url, {
        method: 'PATCH',
        headers: {
            'content-type': 'application/json'
        }
    }).then((response) => response.json())
        .then((response) => {
            if (response.successStatus) {
                window.location.href = response.redirect
            } else {
                console.log(response.message)
            }
        }).catch((err) => console.log(err))
}

function wishTocart(id) {
    const data = document.getElementById(id).dataset.url;
    const wishlistId = document.getElementById(id).dataset.wishid;
    const url = "/wishToCart/" + data;
    const body = {
        id: data,
        wishlistId
    }
    fetch(url, {
        method: 'PATCH',
        headers: {
            'content-type': 'application/json'
        }, body: JSON.stringify({ body })
    }).then((response) => response.json())
        .then((response) => {
            if (response.successStatus) {
                window.location.href = response.redirect
            } else {
                console.log(response.message)
            }
        }).catch((err) => console.log(err))
}



function changeQuantity(id, cartId, amount, count) {
    const addBtn = document.getElementById("inc" + count)
    const deleteBtn = document.getElementById("dec" + count)
    const data = document.getElementById(id).dataset.url;
    const url = "/changeQuantity/" + data;
    fetch(url, {
        method: 'PUT',
        headers: {
            'content-type': 'application/json'
        }, body: JSON.stringify({
            cartId,
            amount
        })
    }).then((response) => response.json())
        .then((response) => {
            if (response.successStatus) {
                document.getElementById(cartId).value = response.quantity,
                    document.getElementById('totalPrice').innerHTML = response.totalAmount
                if (response.quantity == 1) {
                    deleteBtn.disabled = true
                } else if (response.quantity == response.stock) {
                    addBtn.disabled = true
                    document.getElementById(`error${count}`).innerHTML = "Out Of Stock"
                } else {
                    deleteBtn.disabled = false
                    addBtn.disabled = false
                    document.getElementById(`error${count}`).innerHTML = ""
                }
            } else {

                console.log(response.message)
            }
        }).catch((err) => console.log(err))
}

function removeQuantity(id, cartId) {
    const data = document.getElementById(id).dataset.url;
    const url = "/removeQuantity/" + data;
    const quantity = document.getElementById(cartId).value

    fetch(url, {
        method: 'delete',
        headers: {
            'content-type': 'application/json'
        }, body: JSON.stringify({
            cartId,
            quantity
        })
    }).then((response) => response.json())
        .then((response) => {
            if (response.successStatus) {
                window.location.href = response.redirect
            } else {
                console.log(response.message)
            }
        }).catch((err) => console.log(err))
}

function cancelOrder(id) {
    const url = "/cancelOrder/" + id;
    fetch(url, {
        method: 'put',
    }).then((response) => response.json())
        .then((response) => {
            if (response.successStatus) {
                window.location.href = response.redirect
            } else {
                console.log(response.message)
            }
        }).catch((err) => console.log(err))
}
function returnOrder(id) {
    const url = "/returnOrder/" + id;
    fetch(url, {
        method: 'put',
    }).then((response) => response.json())
        .then((response) => {
            if (response.successStatus) {
                window.location.href = response.redirect
            } else {
                console.log(response.message)
            }
        }).catch((err) => console.log(err))
}
function applyCoupon(id) {
    const url = "/applyCoupon/"+id;

    fetch(url, {
        method: 'post',
    }).then((response) => response.json())
        .then((response) => {
            if (response.successStatus) {
                window.location.href = response.redirect
            } else {
                console.log(response.message)
            }
        }).catch((err) => console.log(err))
}

function deleteAddress(id) {
    const url = "/deleteAddress/"+ id;

    const body = {
        id: id
    }
    fetch(url, {
        method: 'delete',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({ body })
    }).then((response) => response.json())
        .then((response) => {
            if (response.successStatus) {
                window.location.href = response.redirect
            } else {
                document.querySelector('#error').innerHTML = "An error has occured please try again"
            }
        }).catch((err) => console.log(err))
}
function forgetPass() {
    const url = "/forgetPassword"

    fetch(url, {
        method: 'post',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({ email:document.getElementById('email1').value })
    }).then((response) => response.json())
        .then((response) => {
            if (response.successStatus) {
             window.location.href = response.redirect
            } else {
                window.location.href = response.redirect
                document.querySelector('#error').innerHTML = "An error has occured please try again"
            }
        }).catch((err) => console.log(err))
}


const alertPlaceholder = document.getElementById('liveAlertPlaceholder')

const alert = (message, type) => {
alertPlaceholder.innerHTML = [
`<div class="alert alert-${type} alert-dismissible" role="alert">`,
`   <div>${message}</div>`,
'   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
'</div>'
].join('')


}
// Render the PayPal button into #paypal-button-container
function payWithwallet(){
    const address=document.querySelector('input[name="address"]:checked')?.value
        if(!address){
            const alertTrigger = document.getElementById('razorpay')
if (alertTrigger) {
alert("Please add an address ",'danger')
}
        }else{
           
            fetch("/wallet", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    address: document.querySelector('input[name="address"]:checked').value
                }),
            }).then((response) => response.json())
            .then((response) => {
                if(response.successStatus){
                    window.location.href=response.redirect
                }else{
document.getElementById('errors').innerText=response.message
                }
            })
        }
}

function razorPayCheckout(user,email) {
    const address=document.querySelector('input[name="address"]:checked')?.value
        if(!address){
            const alertTrigger = document.getElementById('razorpay')
if (alertTrigger) {
alert("Please add an address ",'danger')
}
        }else{
    fetch("/razorpay", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            address: document.querySelector('input[name="address"]:checked').value
        }),
    }).then((response) => response.json())
        .then((response) => {
            if(response.successStatus){

            const options = {
                "key": 'rzp_test_WDR1VAx50ZaE9E', // Enter the Key ID generated from the Dashboard
                "amount": response.orders.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
                "currency": "INR",
                "name": "Zodiac watches",
                "description": "Test Transaction",
                "image": "/icons/Zodiac-1.png",
                "order_id":response.orders.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
                "handler": function (response) {
                    window.location = ("/razorpaySuccess")
                },
                "prefill": {
                    "name": user,
                    "email": email,
                    "contact": "9000090000"
                },
                "notes": {
                    "address": "Razorpay Corporate Office"
                },
                "theme": {
                    "color": "#000000"
                }
            };
            var rzp1 = new Razorpay(options);
            rzp1.open();
            }else{
window.location.href=response.redirect
            }
            
         
           
        })
        .catch((err)=>{
console.log(err);
        })
}
}
