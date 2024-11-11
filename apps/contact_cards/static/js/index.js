// "use strict";

// // This will be the object that will contain the Vue attributes
// // and be used to initialize it.
// let app = {};


// app.data = {    
//     data: function() {
//         return {
//             contacts: [],
//         };
//     },
//     methods: {
//         // Complete. 
//     }
// };

// app.vue = Vue.createApp(app.data).mount("#app");

// app.load_data = function () {
//     // Complete.
// }

// app.load_data();
//
"use strict";

// This will be the object that will contain the Vue attributes
// and be used to initialize it.
let app = {};


app.data = function() {
    return {
        contacts: [],
        isEditing: {},
    };
};

// methods
app.methods = {
    loadContacts() {
        // Complete.
        axios.get(get_contacts_url).then(response => {
            console.log("Loaded contacts:", response.data.contacts); // Log to verify data
            this.contacts = response.data.contacts; // Populate contacts with data from the server
        }).catch(error => {
            console.error("Failed to load contacts:", error);
        });
    },
    addContact() {
        axios.post(add_contact_url).then(response => {
            this.contacts.push(response.data.contact);
        });

        console.log("Add Contact button clicked!");
    },
    deleteContact(contactId) {
        axios.post(delete_contact_url, {id: contactId}).then(() => {
            this.contacts = this.contacts.filter(contact => contact.id !== contactId);
        });
    },
    enableEdit(contact, field) {
        if (!this.isEditing[contact.id]) {
            this.isEditing[contact.id] = {};
        }
        this.isEditing[contact.id][field] = true; // Set the specific field to editable
    },
    saveEdit(contact, field) {
        this.isEditing[contact.id][field] = false;
        // Prepare data to send based on the field being edited
        const data = {
            id: contact.id,
            contact_name: contact.contact_name,
            contact_affiliation: contact.contact_affiliation,
            contact_description: contact.contact_description,
        };
        // data[field] = contact[field];

        axios.post(update_contact_url, data).then(() => {
            console.log(`Saved ${field} for contact ID: ${contact.id}`);
        }).catch(error => {
            console.error("Error saving edit:", error);
        });
    },
    chooseImage(contact) {
        // let input = document.getElementById("file-input");
        // input.onchange = () => {
        //     let file = input.files[0];
        //     if (file) {
        //         let formData = new FormData();
        //         formData.append("id", contact.id);
        //         formData.append("image", file);

        //         axios.post(upload_image_url, formData, {
        //             headers: { "Content-Type": "multipart/form-data" }
        //         }).then(response => {
        //             contact.contact_image = response.data.image_url;
        //         });
        //     }
        // };
        // input.click();
        let input = document.getElementById("file-input");
        input.onchange = () => {
            let file = input.files[0];
            if (file) {
                let formData = new FormData();
                formData.append("id", contact.id);
                formData.append("image", file);

                axios.post(upload_image_url, formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                }).then(response => {
                    // Update the contact's image in the contacts array
                    contact.contact_image = response.data.image_url;
                    console.log("Image uploaded:", response.data.image_url);
                }).catch(error => {
                    console.error("Error uploading image:", error);
                });
            }
        };
        input.click();
    }
};

app.vue = Vue.createApp({data: app.data, methods: app.methods, mounted(){this.loadContacts();}}).mount("#app");

// Load init contact data
// app.methods.loadContacts();
// app.load_data = function () {
//     // Complete.
//     axios.get(get_contacts_url).then(response => {
//         this.contacts = response.data.contacts;
//     });
// }

// app.load_data();

