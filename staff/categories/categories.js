window.addEventListener('load', () => {

    // Delay the execution of the fucntions
    setTimeout(function() { 
        updateCategoryTable();
        updateCategorySelection();
    }, 1000);
})

function updateCategoryTable() {

    // Remove all table rows
    tblCategories = document.getElementById('tblCategories')
    while (tblCategories.firstChild) {
        tblCategories.removeChild(tblCategories.lastChild);
    }


    var transaction = database.transaction('categories', 'readonly'), objectStore, request;
			
    transaction.onerror = function(event) {
        console.log(event);
    }
    objectStore = transaction.objectStore('categories');
    request = objectStore.getAll();

    // request.onerror = indexedDBError;
    request.onsuccess = function(event) {
        var categories = event.target.result;

        for (i in categories) {

            var tr = document.createElement('tr');

            var tdCategory = document.createElement('td');
            var tdDescription = document.createElement('td');

            tdCategory.innerHTML = categories[i].name;
            tdDescription.innerHTML = categories[i].description

            var tdSubCategory = document.createElement('td');
            var tdSubCategoryDescription = document.createElement('td');

            for (o in categories[i].sub_categories) 
            {
                var pCategory = document.createElement('p')
                pCategory.innerHTML = categories[i].sub_categories[o].name
                tdSubCategory.appendChild(pCategory)

                var pSubCategoryDescription = document.createElement('p')
                pSubCategoryDescription.innerHTML = categories[i].sub_categories[o].description
                tdSubCategoryDescription.appendChild(pSubCategoryDescription)
            }

            tr.appendChild(tdCategory);
            tr.appendChild(tdDescription);
            tr.appendChild(tdSubCategory);
            tr.appendChild(tdSubCategoryDescription);

            document.getElementById('tblCategories').appendChild(tr)
        }
    }
}

function updateCategorySelection()
{   
    // Remove all options from select
    selCategory = document.getElementById('selCategory')
    while (selCategory.firstChild)
    {
        selCategory.removeChild(selCategory.firstChild)
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
            option = document.createElement('option')

            option.innerHTML = categories[i].name;
            option.value = categories[i].name;

            document.getElementById('selCategory').appendChild(option)
        }
    }
  

}
document.getElementById('btnCategory').addEventListener('click', () => {
    var name = document.getElementById('txtCategory').value;
    var description = document.getElementById('txtCategoryDescription').value

    var category = {
        "name": name,
        "description": description,
        "sub_categories": []
    }

    var transaction = database.transaction(["categories"], 'readwrite');
    transaction.objectStore("categories").add(category);

    name = document.getElementById('txtCategory').value = ''
    description = document.getElementById('txtCategoryDescription').value = ''

    updateCategoryTable();
    updateCategorySelection();

})

document.getElementById('btnAddSubCategory').addEventListener('click', () => {
    categoryName = document.getElementById('selCategory').value
    subCategoryName = document.getElementById('txtSubCategory').value
    subCategoryDescription = document.getElementById('txtSubCategoryDescription').value

    var subCategory = {
        "name": subCategoryName,
        "description": subCategoryDescription
    }

    var transaction = database.transaction(["categories"], 'readwrite');
    var objectStore = transaction.objectStore("categories")

    objectStore.openCursor().onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
            if (cursor.value.name === categoryName) {
              const updateData = cursor.value;
            
              var subCategories = updateData.sub_categories
              subCategories.push(subCategory)
              updateData.sub_categories = subCategories;
              const request = cursor.update(updateData);
              request.onsuccess = function() {
                console.log('A better album year?');
              };
            };

            cursor.continue();

        }
    }

    updateCategoryTable();
    updateCategorySelection();

    document.getElementById('txtSubCategory').value = ''
    document.getElementById('txtSubCategoryDescription').value = ''


})