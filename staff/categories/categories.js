
// Event Listener for Load
window.addEventListener('load', () => {

    // Delay the execution of the functions so database can be loaded
    setTimeout(function() { 
        updateCategoryTable();
        updateCategorySelection();
    }, 1000);
})

// Function to Update the Category Table Table
function updateCategoryTable() {

    // Remove all table rows
    tblCategories = document.getElementById('tblCategories')
    while (tblCategories.firstChild) {
        tblCategories.removeChild(tblCategories.lastChild);
    }

    // Get Categories from the Database  
    var transaction = database.transaction('categories', 'readonly'), objectStore, request;
    objectStore = transaction.objectStore('categories');
    request = objectStore.getAll();

    // Request Success
    request.onsuccess = function(event) {
        var categories = event.target.result;

        // Loop through categories
        for (i in categories) {

            // Create Category Row
            var tr = document.createElement('tr');

            // Create Category and Category Description Columns 
            var tdCategory = document.createElement('td');
            var tdDescription = document.createElement('td');

            // Set Category and Category Description Columns
            tdCategory.innerHTML = categories[i].name;
            tdDescription.innerHTML = categories[i].description

            // Create SubCategory and SubCategory Description Columns
            var tdSubCategory = document.createElement('td');
            var tdSubCategoryDescription = document.createElement('td');

            // Loop through sub categories in category
            for (o in categories[i].sub_categories) 
            {

                // Create Sub Category Paragraph, Set Sub Category Text and Append to SubCategory Column
                var pCategory = document.createElement('p')
                pCategory.innerHTML = categories[i].sub_categories[o].name
                tdSubCategory.appendChild(pCategory)

                 // Create Sub Category Description Paragraph, Set Sub Category Description Text and Append to SubCategory Description Column
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

// Update Category Drop Down
function updateCategorySelection()
{   
    // Remove all options from select
    selCategory = document.getElementById('selCategory')
    while (selCategory.firstChild)
    {
        selCategory.removeChild(selCategory.firstChild)
    }

    // Get Categories from Database
    var transaction = database.transaction('categories', 'readonly'), objectStore, request, results = [];
    objectStore = transaction.objectStore('categories');
    request = objectStore.getAll();

    // Request Success
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

// Event Listener for Category Button Click
document.getElementById('btnCategory').addEventListener('click', () => {
    var name = document.getElementById('txtCategory').value;
    var description = document.getElementById('txtCategoryDescription').value
    
    // Create Category Object 
    var category = {
        "name": name,
        "description": description,
        "sub_categories": []
    }

    var transaction = database.transaction(["categories"], 'readwrite');
    transaction.objectStore("categories").add(category);

    name = document.getElementById('txtCategory').value = ''
    description = document.getElementById('txtCategoryDescription').value = ''

    // Update Table and Drop Down with new category 
    updateCategoryTable();
    updateCategorySelection();

})

// Event Listener for add Sub Category button Click
document.getElementById('btnAddSubCategory').addEventListener('click', () => {
    categoryName = document.getElementById('selCategory').value
    subCategoryName = document.getElementById('txtSubCategory').value
    subCategoryDescription = document.getElementById('txtSubCategoryDescription').value

    if (categoryName == '' || subCategoryName == '' || subCategoryDescription == ''){
        alert('Please select a category, enter a name for the sub category and a description for the sub category')
        return;
    }

    // Create sub category object
    var subCategory = {
        "name": subCategoryName,
        "description": subCategoryDescription
    }

    var transaction = database.transaction(["categories"], 'readwrite');
    var objectStore = transaction.objectStore("categories")

    objectStore.openCursor().onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {

            // Check if cursor Value is equal to category name
            if (cursor.value.name === categoryName) {
                const updateData = cursor.value;
                
                // Add new Sub Category to Sub Category array
                var subCategories = updateData.sub_categories
                subCategories.push(subCategory)

                // Add updated Sub Category to the Database
                updateData.sub_categories = subCategories;

                // Save / Make Changes
                const request = cursor.update(updateData);
                request.onsuccess = function() {
                
              };
            };

            cursor.continue();

        }
    }

    // Update Table and Drop Down with new category 
    updateCategoryTable();
    updateCategorySelection();

    // Empty Form
    document.getElementById('txtSubCategory').value = ''
    document.getElementById('txtSubCategoryDescription').value = ''


})