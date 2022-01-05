function exportDatabaseToJSON(){
    exportToJson(database)
    .then(result => {
        console.log('Exported JSON string:', JSON.stringify(result, undefined, 4))
    })
    .catch(error => {
        console.error('Something went wrong during export:', error)
    })
}

function importJSONIntoDatabase(){
    var dbJSON = prompt('Enter Database JSON');
    var serializedData = JSON.stringify(dbJSON, undefined, 4)
    importFromJson(database, serializedData)

        .then(() => {
            console.log('Successfully imported data')
        })
        .catch(error => {
            console.error('Something went wrong during import:', error)
        })
}