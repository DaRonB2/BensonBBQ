



document.addEventListener('DOMContentLoaded', function () {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function (event) {
            event.preventDefault(); 
            const formData = new FormData(form); 
            const data = Object.fromEntries(formData.entries()); 
            console.log(data); 
        });
    });
});

// document.addEventListener('DOMContentLoaded', () => {
//     const checkoutForm = document.querySelector('#checkoutButton');
//     checkoutForm.forEach(form => {
//         eventNames.preventDefault();
//         const checkoutFormData = new FormData(form);
//         const checkoutData = Object.fromEntries(checkoutFormData.entries());
//         console.log(checkoutData);
//     })
// })

