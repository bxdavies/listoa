window.addEventListener('load', () => {
    setTimeout(function() { 
        showProduct();
    }, 1000);
});

function showProduct(){

    var urlParams = new URLSearchParams(window.location.search)
    var productName = urlParams.get('product');

    var transaction = database.transaction(["products"], 'readwrite');

    //transaction.onerror = indexedDBError;
    var objectStore = transaction.objectStore(["products"]);
    var request = objectStore.get(productName);
    request.onsuccess = () => {

        var product = request.result;

        document.getElementById('hName').innerHTML = product.name
        
        var imgProduct = document.createElement('img')
        imgProduct.className = 'product-image'

        // Read Image
        var reader = new FileReader();

        reader.readAsDataURL(product.image);

        reader.onload = () => {
            imgProduct.src = reader.result;
        }

        document.getElementById('tdImage').append(imgProduct)

        var pDescription = document.createElement('p')
        pDescription.innerHTML = product.description
        
        var pPrice = document.createElement('p')
        pPrice.innerHTML = '£' + product.price
        pPrice.className = 'price'

        document.getElementById('tdDescription').append(pDescription)
        document.getElementById('tdDescription').append(pPrice)

        document.getElementById('btnAddToWishList').value = product.name
    
    }
}


document.getElementById('btnAddToWishList').addEventListener('click', (event) => {
    // Get Wish List from local storage
    var wishList = localStorage.getItem('wishList')

    // Check if Wish List is undefined
    if (wishList == undefined){
        newWishList = []
        newWishList.push(event.target.value)
    }
    else{
        newWishList = []
        newWishList.push(wishList)
        newWishList.push(event.target.value)
    }

    localStorage.setItem('wishList', newWishList)
})
