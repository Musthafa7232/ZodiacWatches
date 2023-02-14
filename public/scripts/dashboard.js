fetch('/admin/dashboard/dashboard',{
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.json())
  .then(response => {
    console.log(response)
    const label = response.orders.map( item => {
      const check = new Date(item.date)
      const now = new Date()
      if(check.getFullYear() == now.getFullYear() && check.getMonth() == now.getMonth()){
        return new Date(item.date).toLocaleDateString('en-GB')
      }
    })
    const data = response.orders.map( item => {
      const check = new Date(item.date)
      const now = new Date()
      if(check.getFullYear() == now.getFullYear() && check.getMonth() == now.getMonth()){
        return item.totalSpent
      }
    })
    new Chart("amountSpent", {
      type: "bar",
      data: {
        labels: label,
        datasets: [{
          label: 'Amount Spent in Rs',
          data: data,
          borderWidth: 1,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 205, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(201, 203, 207, 0.2)'
          ],
          borderColor: [
            'rgb(255, 99, 132)',
            'rgb(255, 159, 64)',
            'rgb(255, 205, 86)',
            'rgb(75, 192, 192)',
            'rgb(54, 162, 235)',
            'rgb(153, 102, 255)',
            'rgb(201, 203, 207)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    })
  })

  fetch('/admin/productDetails',{
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.json())
  .then(response => {
    console.log(response)
    function getRandomColor(){
      let color = 'hsl('
      color += Math.floor(Math.random() * 360)
      color += ', 46%, 73%)'
      return color
    }
    const label = response.products.map( item => {
      return item.product 
    })
    const data = response.products.map( item => {
      return item.quantity
    })
    const color = response.products.map( item => {
      return getRandomColor()
    })
    new Chart("products", {
      type: 'polarArea',
      data: {
        labels: label,
        datasets: [{
          label: 'Amount Spent in Rs',
          data: data,
          borderWidth: 1,
          backgroundColor: color
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        },
        legend: {
          display: false
        }
      }
    })
  })