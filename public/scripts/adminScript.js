$(document).ready(function () {
    $('#datatable').DataTable();
});


function blockUser(id) {
    const data = document.getElementById(id).dataset.url;
    const url = "http://localhost:3000/admin/users/" + data;
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
    const url = "http://localhost:3000/admin/category/" + data;
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
    const data = document.getElementById(id).dataset.url;
    const url = "http://localhost:3000/admin/editProducts/" + data;
    const productName = document.getElementById('productName').value
    const brand = document.getElementById('brand').value
    const highlights = document.getElementById('highlights').value
    const specifications = document.getElementById('specifications').value
    const colour = document.getElementById('colour').value
    const price = document.getElementById('price').value
    const categoryId = document.getElementById('categoryId').value
    const totalStock = document.getElementById('totalStock').value

    fetch(url, {
        method: 'PUT',
        headers: {
            'content-type': 'application/json'
        }, body: JSON.stringify({
            productName,
            brand,
            highlights,
            specifications,
            colour,
            price,
            categoryId,
            // image1,  
            // image2,   
            // image3,    
            totalStock,
        })
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

function deleteProducts(id) {
    console.log('hi')
    const data = document.getElementById(id).dataset.url;
    const url = "http://localhost:3000/admin/deleteProducts/" + data;
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
    const url = "http://localhost:3000/admin/deleteBanners/" + data;
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
