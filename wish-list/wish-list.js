
window.addEventListener('load', () => {
    setTimeout(() => { 
        initWishList();
    }, 1000);

    setTimeout(() => {
        initProductDetailsButton();
        initRemoveFromWishListButton();
    }, 2000);
});


function initWishList() {

    // Get whishList from Local Storage
    var wishList = localStorage.getItem('wishList')
    
    if (wishList == null || wishList == '' || wishList == undefined) {
        alert('The wish list is empty!')
        return;
    }

    // Convert WishList to an array
    wishList = wishList.split(',')

    wishListNoDuplicates = [...new Set(wishList)];


    var transaction = database.transaction('products', 'readonly'), objectStore, request, results = [];
    objectStore = transaction.objectStore('products');

    for (i in wishListNoDuplicates) {
           
        request = objectStore.get(wishListNoDuplicates[i]);

        request.onsuccess = function(event) {

            var product = event.target.result

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

            // Create Collums
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

    



            
            // Add Collums to Row
            tr.append(tdQuantity)
            tr.append(tdImage)
            tr.append(tdNameDescription)
            tr.append(tdPrice)
            tr.append(tdActions)


            document.getElementById('wishList').append(tr)
        }

        request.onerror = function() {
            console.log("Error", request.error);
        }
    }
}

function initProductDetailsButton(){
    document.querySelectorAll('.btnProductDetails').forEach(item => {
        item.addEventListener('click', (event) => {
            window.open(`../product-details/product-details.html?product=${event.target.value}`)
        })
    })
}

function initRemoveFromWishListButton(){
    document.querySelectorAll('.btnRemoveFromWishList').forEach(item => {
        item.addEventListener('click', (event) => {
            // Get Wish List from local storage
            var wishList = localStorage.getItem('wishList')
            var newWishList = wishList.split(',')

            const index = newWishList.indexOf(event.target.value)
    
            if (index > -1) {
                newWishList.splice(index, 1)
            }

            localStorage.setItem('wishList', newWishList)
            window.location.reload()
        })
    })
}