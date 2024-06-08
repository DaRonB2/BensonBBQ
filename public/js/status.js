document.addEventListener('DOMContentLoaded', function () {
    const forms = document.querySelectorAll('#form');
    forms.forEach(form => {
        form.addEventListener('submit', function (event) {
            event.preventDefault(); 
            const formData = new FormData(form); 
            const data = Object.fromEntries(formData.entries()); 
            console.log(data); 
            
            // Send the data to the server
            fetch(form.action, {
                method: form.method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
            .then(response => response.json())
            .then(result => {
                console.log('Success:', result);
                // Redirect to the order page after successful submission
                window.location.href = '/status';
            })
            .catch(error => {
                console.error('Error:', error);
            });
        });
    });
});