window.addEventListener('load', () => {
    setTimeout(function() { 
        initCategoryDropDown();
    }, 1000);
    
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
            option = document.createElement('option')

            option.innerHTML = categories[i].name;
            option.value = categories[i].name;

            document.getElementById('selCategory').appendChild(option)
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
    var category = document.getElementById('selCategory').value
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