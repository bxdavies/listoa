
// Event Listener for Load
window.addEventListener('load', () => {

    // Delay the execution of the functions so database can be loaded
    setTimeout( () => { 
        initCategoryDropDown();
        initProductsDisplay();
    }, 1000);

    // Delay the execution of the functions so products can be loaded
    setTimeout( () => {
        initEditProductButton();
        initDeleteProductButton();
    }, 2000)
    
})

// Event Listener for Image Upload 
document.getElementById('imgProduct').addEventListener('change', (e) => {
    var inputfile = this, reader = new FileReader();
    reader.onloadend = function(){
        document.getElementById('dropImage').style['background-image'] = 'url('+reader.result+')';
    }
    reader.readAsDataURL(e.target.files[0]);
})

// Initialize the Category Drop Down
function initCategoryDropDown(){
    
    // Get the categories from the database
    var transaction = database.transaction('categories', 'readonly'), objectStore, request, results = [];
    objectStore = transaction.objectStore('categories');
    request = objectStore.getAll();

    // Request Success 
    request.onsuccess = function(event) {
        var categories = event.target.result;
        for (i in categories) 
        {
            // Create option for Add Product Category Drop Down
            optAddProductCategory = document.createElement('option')

            // Set option value and name
            optAddProductCategory.innerHTML = categories[i].name;
            optAddProductCategory.value = categories[i].name;

            // Add option to the drop down
            document.getElementById('selAddProductCategory').append(optAddProductCategory)

            // Create option for Display Product Category Drop Down
            optProductDisplayCategory = document.createElement('option')

            // Set option value and name
            optProductDisplayCategory.innerHTML = categories[i].name;
            optProductDisplayCategory.value = categories[i].name;

            // Add option to the drop down
            document.getElementById('selProductDisplayCategory').append(optProductDisplayCategory)
        }
    }
}

// Event Listener for Category Change
document.getElementById('selAddProductCategory').addEventListener('change', () => {

    // Remove all options from select
    selSubCategory = document.getElementById('selSubCategory')
    while (selSubCategory.firstChild)
    {
        selSubCategory.removeChild(selSubCategory.firstChild)
    }

    // Get Categories from Database
    var transaction = database.transaction('categories', 'readonly'), objectStore, request, results = [];
    objectStore = transaction.objectStore('categories');
    request = objectStore.getAll();

    // Request Success
    request.onsuccess = function(event) {
        var categories = event.target.result;

        // Loop through categories
        for (i in categories) 
        {
            // If category matches selected drop down
            if (categories[i].name == document.getElementById('selAddProductCategory').value)
            {
                // Loop through sub categories
                for (j in categories[i].sub_categories)
                {
                    // Create option
                    option = document.createElement('option')
                    
                    // Set option value and name
                    option.innerHTML = categories[i].sub_categories[j].name
                    option.value = categories[i].sub_categories[j].name;
                    
                    // Add option to the drop down
                    document.getElementById('selSubCategory').appendChild(option)
                }
            }

        }
    }
})

// Event Listener for add button
document.getElementById('btnAdd').addEventListener('click', () => {

    // Get Values from HTML Elements 
    var name = document.getElementById('txtName').value
    var description = document.getElementById('txtDescription').value
    var category = document.getElementById('selAddProductCategory').value
    var subCategory = document.getElementById('selSubCategory').value
    var imageInput  = document.getElementById('imgProduct').files[0];
    var price = document.getElementById('txtPrice').value

    // Create product object
    var product = {
        name: name,
        description: description,
        price: price,
        image: imageInput,
        category: category,
        sub_category: subCategory
    }

    // Add product to the database
    var transaction = database.transaction(["products"], 'readwrite');
    transaction.objectStore("products").add(product);

    // Notify User and reload the page
    alert('Product Added!')
    window.location.reload()
})

// Initialize the Products Display
function initProductsDisplay(){

    // Get Products from the Database
    var transaction = database.transaction('products', 'readonly'), objectStore, request, results = [];
    objectStore = transaction.objectStore('products');
    request = objectStore.getAll();

    // Request Success
    request.onsuccess = function(event) {
        var products = event.target.result;

        // Get number of products and the remainder 
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

        // Then for every product after that create a row of three products
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

                // Add flexDiv to products DIV
                document.getElementById('products').append(flexDiv)
            }
        }
    }
}
//  Event Listener for Category Change
document.getElementById('selProductDisplayCategory').addEventListener('change', () => {

    parent = document.getElementById('products')

    // Empty Products DIV
    while (parent.firstChild){
        parent.firstChild.remove();
    }

    var selectedCategory = document.getElementById('selProductDisplayCategory').value;

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

    // Re ininitilize Edit Product Button and Delete Product Button
    setTimeout(() => {
        initProductDetailsButton();
        initAddToWishListButton();
    }, 1000);

});

// Function to Create Product DIV
function createProductDiv(productsToDisplay, element){

    // Create Product Elements
    var productHeader = document.createElement('h3')
    var productImage = document.createElement('img')
    var productDesciption = document.createElement('p')
    var btnDeleteProduct = document.createElement('button')
    var btnEditProduct = document.createElement('button')
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
    btnEditProduct.innerHTML = 'Edit Product'
    btnEditProduct.className = 'btnEditProduct'
    btnEditProduct.value = productsToDisplay[element].name
    btnDeleteProduct.innerHTML = 'Delete Product'
    btnDeleteProduct.className = 'btnDeleteProduct'
    btnDeleteProduct.value = productsToDisplay[element].name
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
    footer.append(btnEditProduct)
    footer.append(btnDeleteProduct);
    
    // Add Header, Section and Footer to Article
    article.append(header);
    article.append(section);
    article.append(footer);

    // Add Article to DIV
    div.append(article);

    return div;

}
// Initialize the Edit Product Button
function initEditProductButton(){

    // Loop through all elements with the class btnEditProduct
    document.querySelectorAll('.btnEditProduct').forEach(item => {
        
        // Event Listener for Edit Button Click
        item.addEventListener('click', (event) => {

            // Open a new Tab with the parameter of the product
            window.open(`../edit-product/edit-product.html?product=${event.target.value}`)
            
        })
    })
}

// Initialize the Delete Product Button
function initDeleteProductButton(){

    // Loop through all elements with the class btnDeleteProduct
    document.querySelectorAll('.btnDeleteProduct').forEach(item => {

        // Event Listener for Delete Button Click
        item.addEventListener('click', (event) => {

            // Delete Product from the database
            var transaction = database.transaction('products', 'readwrite'), objectStore;
            objectStore = transaction.objectStore('products');
            objectStore.delete(event.target.value)

            // Reload the page
            window.location.reload();
        })
    })
}