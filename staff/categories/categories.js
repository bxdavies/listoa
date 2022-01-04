
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
            var tdCategoryDelete = document.createElement('td');

            // Set Category and Category Description Columns
            tdCategory.innerHTML = categories[i].name;
            tdDescription.innerHTML = categories[i].description

            // Create Category Delete Button
            var btnDeleteCategory = document.createElement('button')
            btnDeleteCategory.innerHTML = 'Delete Category'
            btnDeleteCategory.value = categories[i].name;

            // Create Event Listener for Delete Category Button
            btnDeleteCategory.addEventListener('click', (event) => {

                // Delete Category from the database
                var transaction = database.transaction('categories', 'readwrite'), objectStore;
                objectStore = transaction.objectStore('categories');
                objectStore.delete(event.target.value)

                // Alert User and Reload the page
                alert('Category Deleted!')
                window.location.reload();
            })
            tdCategoryDelete.append(btnDeleteCategory)

            // Create SubCategory and SubCategory Description Columns
            var tdSubCategory = document.createElement('td');
            var tdSubCategoryDescription = document.createElement('td');
            var tdSubCategoryDelete = document.createElement('td');

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

                var btnDeleteSubCategory = document.createElement('button')
                btnDeleteSubCategory.innerHTML = 'Delete Sub Category'
                btnDeleteSubCategory.setAttribute ('category', categories[i].name)
                btnDeleteSubCategory.value = categories[i].sub_categories[o].name

                btnDeleteSubCategory.addEventListener('click', (event) => {
                    var subCategory = event.target.value
                    var category = event.target.getAttribute('category') 

                    console.log (subCategory, category)
          

                    var transaction = database.transaction(["categories"], 'readwrite');
                    var objectStore = transaction.objectStore("categories")

                    objectStore.openCursor().onsuccess = (event) => {
                        const cursor = event.target.result;
                        if (cursor) {
                
                            // Check if cursor Value is equal to category name
                            if (cursor.value.name === category)
                            {
                                const updateData = cursor.value;
                                
                                // Remove Sub Category from Sub Category array
                                var subCategories = updateData.sub_categories

                                console.log(subCategories)
                                
                                // Loop through sub categories
                                for (let i = 0; i < subCategories.length; i++)
                                {
                                    if (subCategories[i].name === subCategory)
                                    {
                                        var newSubCategories = subCategories.splice(i, 1)
                                    }
                                }
                                console.log(newSubCategories)
                                subCategories.push(newSubCategories);
                
                                // Add updated Sub Category to the Database
                                updateData.sub_categories = newSubCategories;
                
                                // Save / Make Changes
                                const request = cursor.update(updateData);
                                request.onsuccess = function() {
                                
                              };
                            };
                
                            cursor.continue();
                
                        }
                    }

                    alert('Sub Category Deleted!')
                })
                
                tdSubCategoryDelete.append(btnDeleteSubCategory)
            }

            tr.appendChild(tdCategory);
            tr.appendChild(tdDescription);
            tr.append(tdCategoryDelete)
            tr.appendChild(tdSubCategory);
            tr.appendChild(tdSubCategoryDescription);
            tr.append(tdSubCategoryDelete)

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