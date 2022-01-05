import { exportToJson } from './common/js/idb-backup-and-restore.js'
exportToJson(database)
    .then(result => {
        console.log('Exported JSON string:', result)
    })
    .catch(error => {
        console.error('Something went wrong during export:', error)
    })
