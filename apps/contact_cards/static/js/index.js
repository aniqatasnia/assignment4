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
            this.contacts = response.data.contacts;
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
        this.$set(this.isEditing, contact.id, { ...this.isEditing[contact.id], [field]: true });
    },
    saveEdit(contact, field) {
        this.$set(this.isEditing, contact.id, { ...this.isEditing[contact.id], [field]: false });
        axios.post(update_contact_url, {
            id: contact.id,
            [field]: contact[field],
        });
    },
    chooseImage(contact) {
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
                    contact.contact_image = response.data.image_url;
                });
            }
        };
        input.click();
    }
};

app.vue = Vue.createApp({data: app.data, methods: app.methods, mounted(){this.loadContacts();}}).mount("#app");

// Load init contact data
app.methods.loadContacts();
// app.load_data = function () {
//     // Complete.
//     axios.get(get_contacts_url).then(response => {
//         this.contacts = response.data.contacts;
//     });
// }

// app.load_data();

