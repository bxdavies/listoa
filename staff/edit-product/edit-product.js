
// Event Listener for Load
window.addEventListener('load', () => {

    // Delay the execution of the functions so database can be loaded
    setTimeout( () => { 
        initCategoryDropDown();
    }, 1000);

    // Delay the execution of the functions so category drop-down can be loaded
    setTimeout( () => {
        initProductDisplay();
    }, 2000)
    
})

// Global Original Product
var orginalProduct;

// Initialize the Product Display
function initProductDisplay() {

    // Get product from the URL Parameters
    var urlParams = new URLSearchParams(window.location.search)
    var productName = urlParams.get('product');

    // Get Product from the Database
    var transaction = database.transaction(["products"], 'readwrite');
    var objectStore = transaction.objectStore(["products"]);
    var request = objectStore.get(productName);

    // Request Success
    request.onsuccess = () => {

        // Set Product and Original Product
        var product = request.result;
        orginalProduct = product

        // Get Product Fields from page
        var txtName = document.getElementById('txtName')
        var txtdescription = document.getElementById('txtDescription')
        var selCategory = document.getElementById('selCategory')
        var selSubCategory = document.getElementById('selSubCategory')
        var txtPrice = document.getElementById('txtPrice')

        // Read Image
        var reader = new FileReader();

        reader.readAsDataURL(product.image);

        // Set background image of the drop image element 
        reader.onload = () => {
            document.getElementById('dropImage').style['background-image'] = 'url('+reader.result+')';
        }

        // Set the value of the product fields on the page 
        txtName.value = product.name
        txtdescription.value = product.description
        selCategory.value = product.category
        
        // Call the Category Drop Drown Event to fill the drop down
        selCategory.dispatchEvent(new Event('change', { 'bubbles': true }))

        // Set the value of the of the Sub Category Drop Drown 
        setTimeout(() => {
            selSubCategory.value = product.sub_category
        }, 100)

        // Set price
        txtPrice.value = product.price
    }

}

// Initialize the Category Drop Drown
function initCategoryDropDown(){
    
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
            // Create option
            optCategory = document.createElement('option')

            // Set option value and name
            optCategory.innerHTML = categories[i].name;
            optCategory.value = categories[i].name;

            // Add option to the drop down
            document.getElementById('selCategory').append(optCategory)

        }
    }
}

// Event Listener for Category Change
document.getElementById('selCategory').addEventListener('change', () => {

    
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
            if (categories[i].name == document.getElementById('selCategory').value)
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

// Event Listener for Image Upload 
document.getElementById('imgProduct').addEventListener('change', (e) => {
    var inputfile = this, reader = new FileReader();
    reader.onloadend = function(){
        document.getElementById('dropImage').style['background-image'] = 'url('+reader.result+')';
    }
    reader.readAsDataURL(e.target.files[0]);
})

// Event Listener for add button
document.getElementById('btnAdd').addEventListener('click', () => {

    // Get Values from HTML Elements 
    var name = document.getElementById('txtName').value
    var description = document.getElementById('txtDescription').value
    var category = document.getElementById('selCategory').value
    var subCategory = document.getElementById('selSubCategory').value
    var imageInput  = document.getElementById('imgProduct').files[0];
    var price = document.getElementById('txtPrice').value

    // Create New Product object
    var newProduct = {
        name: name,
        description: description,
        image: imageInput,
        price: price,
        category: category,
        sub_category: subCategory
    }

    // Create Product Object
    var product = {};

    // For Keys and Values in original object
    for (const [key, value] of Object.entries(orginalProduct))
    {   
        // If key is Image do something different 
        if (key == 'image'){
            // If value is not null or undefined then see the new image to product 
            if (newProduct.image != null || newProduct.image != undefined) {
                product.image = newProduct.image;
            }
            // Set product to same as original product
            else{
                product.image = orginalProduct.image
            }
        }

        else{

            // If value is not equal to the value in new product then add it to product
            if (value != newProduct[key]){
                product[key] = newProduct[key];
            }
            // Set product to same as original product
            else{
                product[key] = orginalProduct[key]
            }
        }

    }

    // Save product to Database
    var transaction = database.transaction(["products"], 'readwrite');
    transaction.objectStore("products").put(product);

    // Notify the User and Reload Page
    alert('Product updated successfully!')
    window.location.reload()
})