
// Event Listener for Load
window.addEventListener('load', () => {

    // Delay the execution of the functions so database can be loaded
    setTimeout(function() { 
        initCategoryDropDown();
        initProductsDisplay();
        
    }, 1000);

    // Delay the execution of the functions so products can be loaded
    setTimeout(function() {
        initProductDetailsButton();
        initAddToWishListButton();
    }, 2000);
    
})

// Initialize the Category Drop Down
function initCategoryDropDown(){
    
    // Get categories from the database
    var transaction = database.transaction('categories', 'readonly'), objectStore, request, results = [];
    objectStore = transaction.objectStore('categories');
    request = objectStore.getAll();

    // Request Success
    request.onsuccess = function(event) {
        var categories = event.target.result;

        // Loop through the categories
        for (i in categories) 
        {   
            // Create a option element
            option = document.createElement('option')

            // Set option value and name
            option.innerHTML = categories[i].name;
            option.value = categories[i].name;

            // Add option to the drop down
            document.getElementById('selCategory').appendChild(option)
        }
    }
}

// Initialize Products Display
function initProductsDisplay(){

    // Get products from the database
    var transaction = database.transaction('products', 'readonly'), objectStore, request, results = [];
    objectStore = transaction.objectStore('products');
    request = objectStore.getAll();

    // Request Success
    request.onsuccess = function(event) {
        var products = event.target.result;

        // Try and divide the number of products to display by 3 if we end up with a remainder then assign to a variable
        var numberOfProducts = Math.trunc(products.length/3);
        var remainderNumberOfProducts =  products.length % 3

        // Remainder 1
        if (remainderNumberOfProducts == 1){

            // Get last array element
            var arrayElementLast = products.length - 1
            
            // Create flexDiv
            var flexDiv = document.createElement('div')
            flexDiv.className = "flex one"

            // Add product DIV to flexDiv
            flexDiv.append(createProductDiv(products, arrayElementLast))
            
            // Add flexDiv to products DIV
            document.getElementById('products').append(flexDiv)

        }

        // Remainder 2
        else if (remainderNumberOfProducts == 2){

            // Get the last array element and the second to last array element
            var arrayElementLast =  products.length - 1
            var arrayElementSecondLast =  products.length - 2

            // Create flexDiv
            var flexDiv = document.createElement('div')
            flexDiv.className = "flex two"
            
            // Add products DIV to flexDiv
            flexDiv.append(createProductDiv(products, arrayElementLast))
            flexDiv.append(createProductDiv(products, arrayElementSecondLast))
            
            // Add flexDiv to products DIV
            document.getElementById('products').append(flexDiv)

        }

        // For any non remaining products create a div of three products
        if (numberOfProducts != 0)
        {
            for (let i = 0; i < numberOfProducts * 3; i += 3) {

                // Create flexDiv
                var flexDiv = document.createElement('div')
                flexDiv.className = "flex three"

                // Add products DIV to flexDiv
                flexDiv.append(createProductDiv(products, i))
                flexDiv.append(createProductDiv(products, i+1))
                flexDiv.append(createProductDiv(products, i+2))

                document.getElementById('products').append(flexDiv)
            }
        }
    }
}

// Create Product DIV
function createProductDiv(productsToDisplay, element){

    // Create Product Elements
    var productHeader = document.createElement('h3')
    var productImage = document.createElement('img')
    var productDesciption = document.createElement('p')
    var addToWishList = document.createElement('button')
    var productDetails = document.createElement('button')
    var price = document.createElement('p')
    productImage.height = 200;

    // Read Image
    var reader = new FileReader();

    reader.readAsDataURL(productsToDisplay[element].image);

    reader.onload = () => {
        productImage.src = reader.result;
    }

    // Set Header and Description
    productHeader.innerHTML = productsToDisplay[element].name
    productDesciption.innerHTML = productsToDisplay[element].description
    productDetails.innerHTML = 'Product Details'
    productDetails.className = 'btnProductDetails'
    productDetails.value = productsToDisplay[element].name
    addToWishList.innerHTML = 'Add to Wish List'
    addToWishList.className = 'btnAddToWishList'
    addToWishList.value = productsToDisplay[element].name
    price.innerHTML = '£' + productsToDisplay[element].price


    // Create Outer DIV
    var div = document.createElement('div')
    
    // Create Article
    var article = document.createElement('article')
    article.className = "card";
    // Header
    var header = document.createElement('header');
    header.append(productHeader);

    // Section
    var section = document.createElement('section');
    section.className = "content"
    section.append(productImage);
    section.append(productDesciption)
    section.append(price)

    // Footer
    var footer = document.createElement('footer');
    footer.append(productDetails)
    footer.append(addToWishList);
    
    // Add Header, Section and Footer to Article
    article.append(header);
    article.append(section);
    article.append(footer);

    // Add Article to DIV
    div.append(article);

    return div;

}

//  Event Listener for Category Change
document.getElementById('selCategory').addEventListener('change', () => {

    parent = document.getElementById('products')

    // Empty Products DIV
    while (parent.firstChild){
        parent.firstChild.remove();
    }

    var selectedCategory = document.getElementById('selCategory').value;

    // Get products from the database
    var transaction = database.transaction('products', 'readonly'), objectStore, request, results = [];
    objectStore = transaction.objectStore('products');
    request = objectStore.getAll();

    request.onsuccess = function(event) {
        var products = event.target.result;

        var productsToDisplay = []

        // Create the array productsToDisplay which includes all products in the selected category
        for (i in products)
        {
            if (products[i].category == selectedCategory)
            {
                productsToDisplay.push(products[i])
            }
        }

        // Try and divide the number of products to display by 3 if we end up with a remainder then assign to a variable
        var numberOfProducts = Math.trunc(productsToDisplay.length/3);
        var remainderNumberOfProducts =  productsToDisplay.length % 3
        
        // Remainder 1
        if (remainderNumberOfProducts == 1){

            // Get last array element
            var arrayElementLast = productsToDisplay.length - 1
            
            // Create flexDiv
            var flexDiv = document.createElement('div')
            flexDiv.className = "flex one"

            // Add product DIV to flexDiv
            flexDiv.append(createProductDiv(productsToDisplay, arrayElementLast))
            
            // Add flexDiv to products DIV
            document.getElementById('products').append(flexDiv)

        }

        // Remainder 2
        else if (remainderNumberOfProducts == 2){

            // Get the last array element and the second to last array element
            var arrayElementLast =  productsToDisplay.length - 1
            var arrayElementSecondLast =  productsToDisplay.length - 2

            // Create flexDiv
            var flexDiv = document.createElement('div')
            flexDiv.className = "flex two"
            
            // Add products DIV to flexDiv
            flexDiv.append(createProductDiv(productsToDisplay, arrayElementLast))
            flexDiv.append(createProductDiv(productsToDisplay, arrayElementSecondLast))
            
            // Add flexDiv to products DIV
            document.getElementById('products').append(flexDiv)

        }

        // For any non remaining products create a div of three products
        if (numberOfProducts != 0)
        {
            for (let i = 0; i < numberOfProducts * 3; i += 3) {

                // Create flexDiv
                var flexDiv = document.createElement('div')
                flexDiv.className = "flex three"

                // Add products DIV to flexDiv
                flexDiv.append(createProductDiv(productsToDisplay, i))
                flexDiv.append(createProductDiv(productsToDisplay, i+1))
                flexDiv.append(createProductDiv(productsToDisplay, i+2))

                document.getElementById('products').append(flexDiv)
            }
        }
    }

    setTimeout(() => {
        initProductDetailsButton();
        initAddToWishListButton();
    }, 1000);

});

// Initialize Product Details Button
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

// Initialize the Add to Wish List Button 
function initAddToWishListButton(){

    // Loop through all elements with the class btnAddToWishList
    document.querySelectorAll('.btnAddToWishList').forEach(item => {

        // Event Listener for Add to Wish List Button Click
        item.addEventListener('click', (event) => {

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

            // Update wish list in local storage
            localStorage.setItem('wishList', newWishList)
        })
    })
}