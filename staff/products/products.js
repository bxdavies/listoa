window.addEventListener('load', () => {
    setTimeout( () => { 
        initCategoryDropDown();
        initProductsDisplay();
    }, 1000);

    setTimeout( () => {
        initEditProductButton();
        initDeleteProductButton();
    }, 2000)
    
})

document.getElementById('imgProduct').addEventListener('change', (e) => {
    var inputfile = this, reader = new FileReader();
    reader.onloadend = function(){
        document.getElementById('dropImage').style['background-image'] = 'url('+reader.result+')';
    }
    reader.readAsDataURL(e.target.files[0]);
})

function initCategoryDropDown(){
    		
    var transaction = database.transaction('categories', 'readonly'), objectStore, request, results = [];

    // transaction.onerror = indexedDBError;
    objectStore = transaction.objectStore('categories');
    request = objectStore.getAll();

    // request.onerror = indexedDBError;
    request.onsuccess = function(event) {
        var categories = event.target.result;
        for (i in categories) 
        {
            optAddProductCategory = document.createElement('option')

            optAddProductCategory.innerHTML = categories[i].name;
            optAddProductCategory.value = categories[i].name;


            document.getElementById('selAddProductCategory').append(optAddProductCategory)

            optProductDisplayCategory = document.createElement('option')

            optProductDisplayCategory.innerHTML = categories[i].name;
            optProductDisplayCategory.value = categories[i].name;

            document.getElementById('selProductDisplayCategory').append(optProductDisplayCategory)



        }
    }
}

document.getElementById('selAddProductCategory').addEventListener('change', () => {

    // Remove all options from select
    selSubCategory = document.getElementById('selSubCategory')
    while (selSubCategory.firstChild)
    {
    selSubCategory.removeChild(selSubCategory.firstChild)
    }

    var transaction = database.transaction('categories', 'readonly'), objectStore, request, results = [];

    // transaction.onerror = indexedDBError;
    objectStore = transaction.objectStore('categories');
    request = objectStore.getAll();

    // request.onerror = indexedDBError;
    request.onsuccess = function(event) {
        var categories = event.target.result;
        for (i in categories) 
        {
            if (categories[i].name == document.getElementById('selCategory').value)
            {
                for (j in categories[i].sub_categories)
                {
                    console.log(categories[i].sub_categories[j].name)
                    option = document.createElement('option')
                    
                    option.innerHTML = categories[i].sub_categories[j].name
                    option.value = categories[i].sub_categories[j].name;
    
                    document.getElementById('selSubCategory').appendChild(option)
                }
            }

        }
    }
})

document.getElementById('btnAdd').addEventListener('click', () => {

    var name = document.getElementById('txtName').value
    var description = document.getElementById('txtDescription').value
    var category = document.getElementById('selAddProductCategory').value
    var subCategory = document.getElementById('selSubCategory').value
    var imageInput  = document.getElementById('imgProduct').files[0];
    var price = document.getElementById('txtPrice').value

    var product = {
        name: name,
        description: description,
        price: price,
        image: imageInput,
        category: category,
        sub_category: subCategory
    }

    console.log(product)
    var transaction = database.transaction(["products"], 'readwrite');
    transaction.objectStore("products").add(product);
})

function initProductsDisplay(){
    var transaction = database.transaction('products', 'readonly'), objectStore, request, results = [];
    objectStore = transaction.objectStore('products');
    request = objectStore.getAll();

    request.onsuccess = function(event) {
        var products = event.target.result;

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


        if (numberOfProducts != 0)
        {
            for (let i = 0; i < numberOfProducts * 3; i += 3) {

                console.log(i);

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

function initEditProductButton(){
    document.querySelectorAll('.btnEditProduct').forEach(item => {
        console.log(item)
        item.addEventListener('click', (event) => {
            window.open(`../product-details/product-details.html?product=${event.target.value}`)
            console.log(event.target.value)
        })
    })
}

function initDeleteProductButton(){
    document.querySelectorAll('.btnDeleteProduct').forEach(item => {
        item.addEventListener('click', (event) => {
            var transaction = database.transaction('products', 'readwrite'), objectStore;
            objectStore = transaction.objectStore('products');
            objectStore.delete(event.target.value)
            window.location.reload();
        })
    })
}