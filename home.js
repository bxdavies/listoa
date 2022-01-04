
// Event Listener for Load
window.addEventListener('load', () => {

    // Delay the execution of the functions so database can be loaded
    setTimeout(() => { 
        initRandomProducts();
    }, 1000);
    
    // Delay the execution of the functions so products can be loaded
    setTimeout(() => {
        initAddToWishListButton();
        initProductDetailsButton();
    }, 2000)
    
})

// Create Product DIV
function createProductDiv(productsToDisplay, element){

    // Create Product Elements
    var productHeader = document.createElement('h3')
    var productImage = document.createElement('img')
    var productDesciption = document.createElement('p')
    var addToWishList = document.createElement('button')
    var productDetails = document.createElement('button')
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
    addToWishList.value = productsToDisplay[element].name
    addToWishList.innerHTML = 'Add to Wish List'
    addToWishList.className = 'btnAddToWishList'
    addToWishList.value = productsToDisplay[element].name

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

// Initialize Random Products To Display 
function initRandomProducts(){

    // Get all products from the database
    var transaction = database.transaction('products', 'readonly'), objectStore, request, results = [];
    objectStore = transaction.objectStore('products');
    request = objectStore.getAll();

    // Request Success 
    request.onsuccess = function(event) {
        var products = event.target.result;
        
        // Generate three random numbers 
        var elem1 = Math.floor(Math.random()*products.length);
        var elem2 = Math.floor(Math.random()*products.length);
        var elem3 = Math.floor(Math.random()*products.length);

        // Create flexDiv
        var flexDiv = document.createElement('div')
        flexDiv.className = "flex three"

        // Add products DIV to flexDiv
        flexDiv.append(createProductDiv(products, elem1))
        flexDiv.append(createProductDiv(products, elem2))
        flexDiv.append(createProductDiv(products, elem3))

        // Add flexDiv to products DIV
        document.getElementById('products').append(flexDiv)
    }
}

// Initialize Product Details Button
function initProductDetailsButton(){

    // Loop through all elements with the class btnProductDetails
    document.querySelectorAll('.btnProductDetails').forEach(item => {
        
        // Event Listener for Product Details Button Click
        item.addEventListener('click', (event) => {

            // Redirect to Product Details Page with product as a parameter
            window.open(`product-details/product-details.html?product=${event.target.value}`)
            
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