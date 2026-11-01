const waterButton = document.getElementsByClassName('wateringButton')

//watering button
Array.from(waterButton).forEach(function(button) {
    button.addEventListener('click', function(){
        const succulent = this.closest('.succulent')
        const id = succulent.dataset.succulentId
        
        fetch('/succulents/' + id + '/water', {
            method: 'PUT'
        })

        .then(function(response) {
            if(!response.ok){
                throw new Error('Could not record watering')
            }
            return response.json()
        })
        .then(function() {
            window.location.reload()
        })
        .catch(function(error) {
            console.error(error)
        })
    })
})

//Favorite button
const favoriteButton = document.getElementsByClassName('favoriteButton')

Array.from(favoriteButton).forEach(function(button) {
    button.addEventListener('click', function(){
        const succulent = this.closest('.succulent')
        const id = succulent.dataset.succulentId
        
        fetch('/succulents/' + id + '/favorites', {
            method: 'PUT'
        })

        .then(function(response) {
            if(!response.ok){
                throw new Error('Could not update favorite plants')
            }
            return response.json()
        })
        .then(function() {
            window.location.reload()
        })
        .catch(function(error) {
            console.error(error)
        })
    })
})

//Health selection
const healthSelection = document.getElementsByClassName('healthStatus')

Array.from(healthSelection).forEach(function(select) {

    //runs when you change to a different option for the plants health. smurf not listening for a click its listening for a CHANEG
    select.addEventListener('change', function(){
        const succulent = this.closest('.succulent')
        const id = succulent.dataset.succulentId

        //the value that was selected
        const health = this.value
        
        fetch('/succulents/' + id + '/health', {
            method: 'PUT', 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                health: health
            })
        })

        .then(function(response) {
            if(!response.ok){
                throw new Error('Could not update favorite plants')
            }
            return response.json()
        })
        .then(function() {
            window.location.reload()
        })
        .catch(function(error) {
            console.error(error)
        })
    })
})

//for the browser edit stuff for plants
const editButton = document.getElementsByClassName('editButton')

Array.from(editButton).forEach(function(button) {
    button.addEventListener('click', function(){
        const succulent = this.closest('.succulent')
        const editForm = succulent.querySelector('.editForm')

        editForm.hidden = !editForm.hidden
    })
})

      
        const editForm = document.getElementsByClassName('editForm')
    

Array.from(editForm).forEach(function(form) {
    form.addEventListener('submit', function(event){
        event.preventDefault()

        const succulent = this.closest('.succulent')
        const id = succulent.dataset.succulentId
        
        const location = this.querySelector('.editLocation').value
        const lastWatered = this.querySelector('.editLastWatered').value
        const healthNote = this.querySelector('.editHealthNote').value

         fetch('/succulents/' + id + '/edit', {
            method: 'PUT', 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                location: location, 
                lastWatered: lastWatered, 
                healthNote: healthNote
            })
        })
        .then(function(response) {
            if(!response.ok){
                throw new Error('Could not edit plant information')
            }
            return response.json()
        })
        .then(function() {
            window.location.reload()
        })
        .catch(function(error) {
            console.error(error)
        })
    })
})

//delete button
 const deleteButton = document.getElementsByClassName('deleteButton')

//watering button
Array.from(deleteButton).forEach(function(button) {
    button.addEventListener('click', function(){
        const confirmDeletion = window.confirm(
            'Are you sure that you want to delete this plant?'
        )

        if (!confirmDeletion){
            return
        }
        const succulent = this.closest('.succulent')
        const id = succulent.dataset.succulentId
        
        fetch('/succulents/' + id, {
            method: 'DELETE'
        })

        .then(function(response) {
            if(!response.ok){
                throw new Error('Unable to delete plant')
            }
            return response.text()
        })
        .then(function() {
            window.location.reload()
        })
        .catch(function(error) {
            console.error(error)
        })
    })
})


