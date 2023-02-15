$(document).ready(function() {
    $('#datatable').DataTable( {
        dom: 'Bfrtip',
        buttons: [
            'copy', 'csv', 'excel', 'pdf', 'print'
        ]
    } );
} );


function blockUser(id) {
    const data = document.getElementById(id).dataset.url;
    const url = "/admin/users/" + data;
    const body = {
        id: data
    }
    fetch(url, {
        method: 'put',
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

function deleteCategory(id) {
    const data = document.getElementById(id).dataset.url;
    const url = "/admin/category/" + data;
    const body = {
        id: data
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
                console.log(err)
                document.querySelector('#error').innerHTML = "An error has occured please try again"
            }
        }).catch((err) => console.log(err))
}

function editProducts(id) {
    const form = document.getElementById('form')
    const formData = new FormData(form)
    const data = document.getElementById(id).dataset.url;
    const url = "/admin/editProducts/" + data;
    fetch(url, {
        method: 'PUT',
        body: formData
    }).then((response) => response.json())
        .then((response) => {
            if (response.successStatus) {
                window.location.href = response.redirect
            } else {
              window.location.reload()
                document.querySelector('#error').innerHTML = "An error has occured please try again"
            }
        }).catch((err) => console.log(err))
}

function deleteProducts(id) {
    console.log('hi')
    const data = document.getElementById(id).dataset.url;
    const url = "/admin/deleteProducts/" + data;
    const body = {
        id: data
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
                console.log(err)
                document.querySelector('#error').innerHTML = "An error has occured please try again"
            }
        }).catch((err) => console.log(err))
}

function deleteBanner(id) {
    const data = document.getElementById(id).dataset.url;
    const url = "/admin/deleteBanners/" + data;
    const body = {
        id: data
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
                console.log(err)
                document.querySelector('#error').innerHTML = "An error has occured please try again"
            }
        }).catch((err) => console.log(err))
}

function viewImage(event,id){
    document.getElementById(id).src=URL.createObjectURL(event.target.files[0])
  }


  function cancelOrder(id){
    const url = "/admin/cancelOrder/"+id;
    fetch(url, {
        method: 'put',
    }).then((response) => response.json())
        .then((response) => {
            if (response.successStatus) {
      window.location.href=response.redirect
            } else {
                console.log(response.message)
            }
        }).catch((err) => console.log(err))
}

  function saveChanges(count,id){
    console.log(document.getElementById(id));
    const data = document.getElementById(id).dataset.url;
    const url = "/admin/saveChanges/"+data;
    fetch(url, {
        method: 'PATCH',
        headers: {
            'content-type': 'application/json'
        }, body: JSON.stringify({
             orderStatus:document.getElementById('orderStatus'+count).value 
            })
    }).then((response) => response.json())
        .then((response) => {
            if (response.successStatus) {
      window.location.href=response.redirect
            } else {
                console.log(response.message)
            }
        }).catch((err) => console.log(err))
}
  

function deleteCoupon(id) {
    const data = document.getElementById(id).dataset.url;
    const url = "/admin/coupon/" + data;
    const body = {
        id: data
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
                console.log(err)
                document.querySelector('#error').innerHTML = "An error has occured please try again"
            }
        }).catch((err) => console.log(err))
}

function cancelReturn(id) {
    const url = "/admin/cancelReturn/" + id;
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
                window.location.href = response.redirect
            } else {
                console.log(err)
                document.querySelector('#error').innerHTML = "An error has occured please try again"
            }
        }).catch((err) => console.log(err))
}

function approveReturn(id) {
    const url = "/admin/approveReturn/" + id;
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
                window.location.href = response.redirect
            } else {
                console.log(err)
                document.querySelector('#error').innerHTML = "An error has occured please try again"
            }
        }).catch((err) => console.log(err))
}

function save(count,id){
    console.log(document.getElementById(id));
    const data = document.getElementById(id).dataset.url;
    const url = "/admin/saveReturnstatus/"+data;
    fetch(url, {
        method: 'PATCH',
        headers: {
            'content-type': 'application/json'
        }, body: JSON.stringify({
            returnStatus:document.getElementById('returnStatus'+count).value
            })
    }).then((response) => response.json())
        .then((response) => {
            if (response.successStatus) {
      window.location.href=response.redirect
            } else {
                console.log(response.message)
            }
        }).catch((err) => console.log(err))
}
function deleteImage(path,id) {
    console.log(path)
    const url = "/admin/deleteImage"
    fetch(url, {
        method: 'PATCH',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({ path,id })
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