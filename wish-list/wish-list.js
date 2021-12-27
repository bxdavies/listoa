
// Event Listener for Load
window.addEventListener('load', () => {

    // Delay the execution of the functions so database can be loaded
    setTimeout(() => { 
        initWishList();
    }, 1000);

       // Delay the execution of the functions so wish list can be loaded
    setTimeout(() => {
        initProductDetailsButton();
        initRemoveFromWishListButton();
    }, 2000);
});

// Initialize the wish list
function initWishList() {

    // Get wish List from Local Storage
    var wishList = localStorage.getItem('wishList')
    
    if (wishList == null || wishList == '' || wishList == undefined) {
        alert('The wish list is empty!')
        return;
    }

    // Convert WishList to an array
    wishList = wishList.split(',')

    // Create a wish list without duplicates
    wishListNoDuplicates = [...new Set(wishList)];
    
    // Get products from the database 
    var transaction = database.transaction('products', 'readonly'), objectStore, request, results = [];
    objectStore = transaction.objectStore('products');

    // Loop through wish list
    for (i in wishListNoDuplicates) {
        
        // Get product from the database
        request = objectStore.get(wishListNoDuplicates[i]);

        request.onsuccess = function(event) {

            var product = event.target.result
            
            // Count how many times a product appears in the wish list
            var count = wishList.filter(x => x == product.name).length;

            // Product Elements
            var pQuantity = document.createElement('p')
            var productImage = document.createElement('img')
            var pName = document.createElement('p')
            var pDescription = document.createElement('p')
            var pPrice = document.createElement('p')
            var btnProductDetails = document.createElement('button')
            var btnRemoveFromWishList = document.createElement('button')

            // Create Row
            var tr = document.createElement('tr');

            // Create Columns
            var tdQuantity = document.createElement('td')
            var tdImage = document.createElement('td');
            var tdNameDescription = document.createElement('td');
            var tdPrice = document.createElement('td');
            var tdActions = document.createElement('td');

            // Read Image
            var reader = new FileReader();

            reader.readAsDataURL(product.image);

            reader.onload = () => {
                productImage.src = reader.result;
            }

            // Set Product Elements
            pQuantity.innerHTML = count
            tdQuantity.append(pQuantity)

            productImage.height = 200;
            tdImage.append(productImage);

            pName.innerHTML = product.name;
            pDescription.innerHTML = product.description
            tdNameDescription.append(pName)
            tdNameDescription.append(pDescription)

            pPrice.innerHTML = '£' + product.price
            tdPrice.append(pPrice)

            btnProductDetails.innerHTML = 'Product Details'
            btnProductDetails.className = 'btnProductDetails'
            btnProductDetails.value = product.name;
            tdActions.append(btnProductDetails)

            btnRemoveFromWishList.innerHTML = 'Remove from Wish List'
            btnRemoveFromWishList.className = 'btnRemoveFromWishList'
            btnRemoveFromWishList.value = product.name
            tdActions.append(btnRemoveFromWishList)

            // Add Columns to Row
            tr.append(tdQuantity)
            tr.append(tdImage)
            tr.append(tdNameDescription)
            tr.append(tdPrice)
            tr.append(tdActions)

            // Add row to Table
            document.getElementById('wishList').append(tr)
        }            
    }
}

// Initialize the Product Details Button
function initProductDetailsButton(){

    // Loop through all elements with the class btnProductDetails
    document.querySelectorAll('.btnProductDetails').forEach(item => {

        // Event Listener for Product Details Button Click
        item.addEventListener('click', (event) => {

            // Redirect to Product Details Page with product as a parameter
            window.open(`../product-details/product-details.html?product=${event.target.value}`)
        })
    })
}

// Initialize the the Remove Wish List Button
function initRemoveFromWishListButton(){

    // Loop through all elements with the class btnRemoveFromWishList
    document.querySelectorAll('.btnRemoveFromWishList').forEach(item => {
        item.addEventListener('click', (event) => {
            
            // Get Wish List from local storage
            var wishList = localStorage.getItem('wishList')
            var newWishList = wishList.split(',')
            
            // Get index of wish list item to remove
            const index = newWishList.indexOf(event.target.value)
            
            // Remove from wish list if index is greater than -1
            if (index > -1) {
                newWishList.splice(index, 1)
            }

            // Update wish list in local storage
            localStorage.setItem('wishList', newWishList)
            window.location.reload()
        })
    })
}