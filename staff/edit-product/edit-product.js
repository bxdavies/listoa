window.addEventListener('load', () => {
    setTimeout( () => { 
        initCategoryDropDown();
    }, 1000);

    setTimeout( () => {
        initProductDisplay();
    }, 2000)
    
})

var orginalProduct;
function initProductDisplay() {
    var urlParams = new URLSearchParams(window.location.search)
    var productName = urlParams.get('product');

    var transaction = database.transaction(["products"], 'readwrite');

    //transaction.onerror = indexedDBError;
    var objectStore = transaction.objectStore(["products"]);
    var request = objectStore.get(productName);
    request.onsuccess = () => {

        var product = request.result;
        orginalProduct = product

        var txtName = document.getElementById('txtName')
        var txtdescription = document.getElementById('txtDescription')
        var selCategory = document.getElementById('selCategory')
        var selSubCategory = document.getElementById('selSubCategory')
        var txtPrice = document.getElementById('txtPrice')

        // Read Image
        var reader = new FileReader();

        reader.readAsDataURL(product.image);

        reader.onload = () => {
            document.getElementById('dropImage').style['background-image'] = 'url('+reader.result+')';
        }

        txtName.value = product.name
        txtdescription.value = product.description
        selCategory.value = product.category
        
        selCategory.dispatchEvent(new Event('change', { 'bubbles': true }))

        setTimeout(() => {
            selSubCategory.value = product.sub_category
        }, 100)

        txtPrice.value = product.price
    }

}

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
            optCategory = document.createElement('option')

            optCategory.innerHTML = categories[i].name;
            optCategory.value = categories[i].name;


            document.getElementById('selCategory').append(optCategory)

        }
    }
}

document.getElementById('selCategory').addEventListener('change', () => {

    
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
                    
                    option = document.createElement('option')
                    
                    option.innerHTML = categories[i].sub_categories[j].name
                    option.value = categories[i].sub_categories[j].name;
    
                    document.getElementById('selSubCategory').appendChild(option)
                }
            }

        }
    }
})
document.getElementById('imgProduct').addEventListener('change', (e) => {
    var inputfile = this, reader = new FileReader();
    reader.onloadend = function(){
        document.getElementById('dropImage').style['background-image'] = 'url('+reader.result+')';
    }
    reader.readAsDataURL(e.target.files[0]);
})


document.getElementById('btnAdd').addEventListener('click', () => {

    var name = document.getElementById('txtName').value
    var description = document.getElementById('txtDescription').value
    var category = document.getElementById('selCategory').value
    var subCategory = document.getElementById('selSubCategory').value
    var imageInput  = document.getElementById('imgProduct').files[0];
    var price = document.getElementById('txtPrice').value

    var newProduct = {
        name: name,
        description: description,
        image: imageInput,
        price: price,
        category: category,
        sub_category: subCategory
    }

    var product = {};
    for (const [key, value] of Object.entries(orginalProduct))
    {   
        if (key == 'image'){
            if (newProduct.image != null || newProduct.image != undefined) {
                product.image = newProduct.image;
            }
            else{
                product.image = orginalProduct.image
            }
        }
        else{
            if (value != newProduct[key]){
                product[key] = newProduct[key];
            }
            else{
                product[key] = orginalProduct[key]
            }
        }

    }

    var transaction = database.transaction(["products"], 'readwrite');
    transaction.objectStore("products").put(product);

    alert('Product updated successfully!')
    window.location.reload()
})