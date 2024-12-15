<template>
  <!-- Root Vuetify App Component -->
  <v-app>
    <!-- App Bar (Header Section) -->
    <v-app-bar app color="primary" dark elevation="2">
      <!-- Mobile View Header -->
      <template v-if="isMobile">
        <!-- Drawer Toggle Button [Mobile View] -->
        <v-app-bar-nav-icon @click.stop="drawerVisibility = !drawerVisibility"></v-app-bar-nav-icon>
        <v-spacer></v-spacer>

        <!-- Search Field [Mobile View] -->
        <v-row align="center" class="flex-grow-1">
          <v-text-field v-model="searchQuery"
                        :label="`Search by ${searchType}`"
                        prepend-inner-icon="mdi-magnify"
                        dense
                        hide-details
                        flat
                        solo
                        rounded
                        style="max-width: 500px;">
            <!-- Dropdown to Select Search Type [Mobile View] -->
            <template v-slot:prepend>
              <v-select v-model="searchType"
                        :items="searchOptions"
                        dense
                        hide-details
                        flat
                        solo
                        rounded
                        style="max-width: 150px;"></v-select>
            </template>
          </v-text-field>
        </v-row>

        <!-- Sort Toggle Button [Mobile View] -->
        <v-spacer></v-spacer>
        <v-btn icon @click="toggleSortOrder">
          <v-icon>{{ sortAscending ? 'mdi-sort-ascending' : 'mdi-sort-descending' }}</v-icon>
        </v-btn>
      </template>

      <!-- Desktop View Header -->
      <template v-else>
        <v-container class="py-0 fill-height d-flex align-center">
          <!-- App Icon and Title -->
          <v-row align="center" class="flex-grow-0">
            <v-icon class="mr-2">mdi-account-group</v-icon>
            <v-toolbar-title class="mr-4">My Contacts</v-toolbar-title>
            <!-- Display Total Contacts -->
            <span class="contact-count">{{ filteredContacts.length }}</span>
          </v-row>

          <!-- Spacer -->
          <v-spacer></v-spacer>

          <!-- Search Field -->
          <v-row align="center" class="flex-grow-1">
            <v-text-field v-model="searchQuery"
                          :label="`Search by ${searchType}`"
                          prepend-inner-icon="mdi-magnify"
                          dense
                          hide-details
                          flat
                          solo
                          rounded
                          style="max-width: 500px;">
              <!-- Dropdown to Select Search Type -->
              <template v-slot:prepend>
                <v-select v-model="searchType"
                          :items="searchOptions"
                          dense
                          hide-details
                          flat
                          solo
                          rounded
                          style="max-width: 150px;"></v-select>
              </template>
            </v-text-field>
          </v-row>

          <!-- Sort Button -->
          <v-btn icon class="ml-4" @click="toggleSortOrder" style="margin-left: 16px;">
            <v-icon>{{ sortAscending ? 'mdi-sort-ascending' : 'mdi-sort-descending' }}</v-icon>
          </v-btn>

          <!-- Profile Menu -->
          <v-spacer></v-spacer>
          <v-menu offset-y>
            <template v-slot:activator="{ props }">
              <v-btn v-bind="props" text>
                <v-avatar size="32" class="mr-2">
                  <v-img src="https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250"></v-img>
                </v-avatar>
                <span class="hidden-sm-and-down font-weight-medium">John</span>
                <v-icon>mdi-chevron-down</v-icon>
              </v-btn>
            </template>

            <!-- Dropdown Menu Items -->
            <v-card>
              <v-list dense>
                <v-list-item @click="exportContacts">
                  <template v-slot:prepend>
                    <v-icon small>mdi-file-document-arrow-right-outline</v-icon>
                  </template>
                  <v-list-item-title>Export</v-list-item-title>
                </v-list-item>
                <v-divider></v-divider>
                <v-list-item @click="openExternalLink('https://github.com/bharatsn123/ContactsVueJsApp')">
                  <template v-slot:prepend>
                    <v-icon small>mdi-help-circle-outline</v-icon>
                  </template>
                  <v-list-item-title>Documentation</v-list-item-title>
                </v-list-item>
                <v-divider></v-divider>
                <v-list-item @click="logout">
                  <template v-slot:prepend>
                    <v-icon small>mdi-logout</v-icon>
                  </template>
                  <v-list-item-title>Log Out</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-card>
          </v-menu>
        </v-container>
      </template>
    </v-app-bar>

    <!-- Main Content [Web & Mobile] -->
    <v-main>
      <v-container>

        <!-- New row for mobile display -->
        <v-row class="d-md-none mb-lg-0" v-if="isMobile">
          <v-col cols="12">
            <h2 class="text-h5">
              My Contacts <span class="text-subtitle-1">({{ filteredContacts.length }})</span>
            </h2>
          </v-col>
        </v-row>

        <!-- Contacts Display -->
        <v-row>
          <v-col v-for="contact in sortedContacts"
                 :key="contact.id"
                 cols="12"
                 sm="6"
                 md="4">
            <!-- Contact Card -->
            <v-card outlined @click="selectContact(contact)">
              <v-card-title>{{ contact.name }}</v-card-title>
              <v-card-subtitle>
                <!-- Email -->
                <div class="d-flex align-center">
                  <v-icon small color="grey">mdi-email</v-icon>
                  {{ contact.email }}
                </div>
                <!-- Phone -->
                <div class="d-flex align-center mt-2">
                  <v-icon small color="grey">mdi-phone</v-icon>
                  {{ contact.phone }}
                </div>
                <!-- Company -->
                <div class="d-flex align-center mt-2">
                  <v-icon small color="grey">mdi-domain</v-icon>
                  {{ contact.company.name }}
                </div>
              </v-card-subtitle>
              <v-card-actions>
                <v-btn text color="primary">View Details</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>

        <!-- Contact Details Dialog - When clicked on a contact card -->
        <v-dialog v-model="viewContactDialog" max-width="900px">
          <v-card>
            <!-- Randomly generated avatar -->
            <v-card-title>
              <v-avatar size="80" class="mr-4">
                <v-img :src="'https://i.pravatar.cc/150?img=' + currentSelectedContact.id"></v-img>
              </v-avatar>
              <!-- Contact name and company-->
              <div>
                <h3>{{ currentSelectedContact.name }}</h3>
                <v-icon small class="mr-2">mdi-domain</v-icon>
                <p class="text-subtitle-1 grey--text">{{ currentSelectedContact.company.name }}</p>
              </div>
            </v-card-title>

            <!-- Divider -->
            <v-divider></v-divider>

            <!-- Contact Info -->
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" md="6">
                    <h4>Contact Information</h4>
                    <v-text-field v-model="currentSelectedContact.email" label="Email" outlined dense></v-text-field>
                    <v-text-field v-model="currentSelectedContact.phone" label="Phone" outlined dense></v-text-field>
                    <v-text-field v-model="currentSelectedContact.website" label="Website" outlined dense></v-text-field>
                  </v-col>

                  <!-- Address Info and Map -->
                  <v-col cols="12" md="6">
                    <h4>Address</h4>
                    <p>{{ currentSelectedContact.address.street }}, {{ currentSelectedContact.address.suite }}</p>
                    <p>{{ currentSelectedContact.address.city }}, {{ currentSelectedContact.address.zipcode }}</p>

                    <!-- Azure Map Component -->
                    <div id="azure-map" style="height: 300px;"></div>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <!-- Save and close buttons -->
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="green" text @click="updateContact">Save Changes</v-btn>
              <v-btn color="red" text @click="viewContactDialog = false">Close</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

      </v-container>
    </v-main>

    <!-- Add New Contact Button [Web & Mobile] -->
    <v-fab-transition>
      <v-btn color="primary"
             dark
             fixed
             bottom
             right
             fab
             class="mb-8 mr-8 fab-button"
             @click="openNewContactDialog"
             icon ="mdi-plus">
      </v-btn>
    </v-fab-transition>

    <!-- Footer [Web & Mobile] -->
    <v-footer app color="primary" dark padless>
      <span class="mx-auto">&copy; 2024 Contacts App</span>
    </v-footer>

    <!-- Mobile Navigation Drawer -->
    <v-navigation-drawer v-model="drawerVisibility" temporary app v-if="isMobile">
      <!-- User Avatar and Name [Mobile View] -->
      <v-list-item class="pa-2">
        <v-avatar>
          <!-- User Profile Image [Mobile View] -->
          <v-img src="https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250"
                 class="rounded-circle"
                 style="width: 36px; height: 36px;"></v-img>
        </v-avatar>
        <!-- User Details [Mobile View]  -->
        <v-list-item-title class="font-weight-bold">John</v-list-item-title>
        <v-list-item-subtitle>john.doe@example.com</v-list-item-subtitle>
      </v-list-item>

      <!-- Divider for Separation -->
      <v-divider></v-divider>

      <!-- Menu Items in Drawer [Mobile View]  -->
      <v-list>
        <!-- Export Contacts Option [Mobile View]  -->
        <v-list-item @click="exportContacts">
          <template v-slot:prepend>
            <v-icon small>mdi-file-document-arrow-right-outline</v-icon>
          </template>
          <v-list-item-title>Export</v-list-item-title>
        </v-list-item>

        <!-- Documentation Link [Mobile View]  -->
        <v-list-item @click="openExternalLink('https://github.com/bharatsn123/ContactsVueJsApp')">
          <template v-slot:prepend>
            <v-icon small>mdi-help-circle-outline</v-icon>
          </template>
          <v-list-item-title>Documentation</v-list-item-title>
        </v-list-item>

        <!-- Log Out Option [Mobile View] -->
        <v-list-item @click="logout">
          <template v-slot:prepend>
            <v-icon small>mdi-logout</v-icon>
          </template>
          <v-list-item-title>Log Out</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Dialog for adding new contact [Mobile & Desktop] -->
    <v-dialog v-model="addContactDialog" max-width="600px">
      <v-card>
        <!-- Diag Title -->
        <v-card-title>
          <span class="headline">Add New Contact</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <!-- Text fields for the new contact details -->
            <v-row>
              <v-col cols="12">
                <!-- Required and validated -->
                <v-text-field v-model="newContact.name"
                              :rules="rules.nameRules"
                              label="Name"
                              prepend-icon="mdi-account"
                              required></v-text-field>
              </v-col>
              <v-col cols="12">
                <!-- Required and validated -->
                <v-text-field v-model="newContact.email"
                              :rules="rules.emailRules"
                              label="Email"
                              prepend-icon="mdi-email"
                              required></v-text-field>
              </v-col>
              <v-col cols="12">
                <!-- Required and validated -->
                <v-text-field v-model="newContact.phone"
                              :rules="rules.phoneRules"
                              label="Phone"
                              prepend-icon="mdi-phone"
                              required></v-text-field>
              </v-col>
              <v-col cols="12">
                <!-- Optional -->
                <v-text-field v-model="newContact.website"
                              label="Website"
                              prepend-icon="mdi-web"></v-text-field>
              </v-col>
              <v-col cols="12">
                <!-- Optional -->
                <v-text-field v-model="newContact.company"
                              label="Company"
                              prepend-icon="mdi-office-building"></v-text-field>
              </v-col>
              <v-col cols="12">
                <!-- Optional -->
                <v-textarea v-model="newContact.address"
                            label="Address"
                            prepend-icon="mdi-map-marker"></v-textarea>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey darken-1" text @click="closeAddContactDialog">Close</v-btn>
          <v-btn color="blue darken-1" text @click="saveNewContact" :disabled="!isFormValid">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>


    <!-- Export diag [Desktop/Mobile] -->
    <v-dialog v-model="exportDialog" max-width="900px">
      <v-card>
        <v-card-title>Export Contacts</v-card-title>
        <v-card-text>
          <v-data-table :headers="exportHeaders"
                        :items="contacts"
                        item-value="id"
                        show-select
                        class="elevation-1"
                        return-object
                        v-model="selectedExportContacts">
            <!-- Use slots for nested data like company.name -->
            <template v-slot:[`item.company.name`]="{ item }">
              {{ item.company.name || 'N/A' }}
            </template>
            <template v-slot:[`item.address.street`]="{ item }">
              {{ item.address ? item.address.street : 'N/A' }}
            </template>
          </v-data-table>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary"
                 :disabled="!selectedExportContacts.length"
                 @click="downloadCSV">
            Export
          </v-btn>
          <v-btn text @click="exportDialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-app>
</template>



<script>
  import axios from "axios";
  import { filterContacts, sortContacts, formValidation } from "./utils/contactUtils.js";
  const AzureMap = () => import("./AzureMap.vue"); // Lazy loading Azure Map

  export default {
    name: "App",
    data() {
      return {
        rules: { // Form validation rules when creating new contacts
          nameRules: [
            v => !!v || 'Name is required',
            v => v.length <= 50 || 'Name must be less than 50 characters'
          ],
          emailRules: [
            v => !!v || 'Email is required',
            v => /.+@.+\..+/.test(v) || 'Email must be valid'
          ],
          phoneRules: [
            v => !!v || 'Phone is required',
            v => /^\d{10}$/.test(v) || 'Phone must be 10 digits'
          ]
        },
        drawerVisibility: false, // Toggle variable for mobile navigation drawer
        isMobile: false,
        contacts: [], // list of contacts from the remote Json
        searchQuery: "",
        searchType: "name",
        azureMapsKey: "SyEaV43r35WFJrzD8DZXRAbhvZX1J4dJDdmKMuN3iKhQvx5FwXfLJQQJ99ALACYeBjFxoFRHAAAgAZMP2uzy",
        searchOptions: ["name", "company", "email"],
        viewContactDialog: false, // Controls visibility of view contact diag
        currentSelectedContact: null, // Is set when clicked on a contact card for viewing
        formattedAddress: "",
        sortAscending: true, // Controls the sort order

        // properties for the floating button and add contact dialog
        addContactDialog: false, // Controls the visibility of the add contact dialog
        newContact: {
          name: "",
          email: "",
          phone: "",
          website: "",
          company: "",
          address: ""
        },
        exportDialog: false, // Controls visiblity of export diag
        selectedExportContacts: [], // List of contacts selected for export
        exportHeaders: [
          { title: "Name", key: "name" },
          { title: "Email", key: "email" },
          { title: "Phone", key: "phone" },
          { title: "Website", key: "website" },
          { title: "Company", key: "company.name" },
          { title: "Address", key: "address.street" },
        ]
      };
    },
    computed: {
      filteredContacts() {
        return filterContacts(this.contacts, this.searchQuery, this.searchType);
      },
      sortedContacts() {
        return sortContacts(this.filteredContacts, this.sortAscending);
      },
      isFormValid() {
        return formValidation(this.newContact, this.rules);
      }
    },
    methods: {
      checkScreenSize() {
        this.isMobile = window.innerWidth < 960; // Helps decide whether to display a navigation drawer (mobile)
      },
      async fetchContacts() {
        try {
          const response = await axios.get("https://jsonplaceholder.typicode.com/users");
          this.contacts = response.data;
        } catch (error) {
          console.error("Error fetching contacts:", error);
        }
      },
      toggleSortOrder() {
        this.sortAscending = !this.sortAscending; // Toggle the sort order
      },
      updateContact() {
        const index = this.contacts.findIndex(contact => contact.id === this.currentSelectedContact.id);
        if (index !== -1) {
          this.contacts[index] = { ...this.currentSelectedContact, address: this.parseAddress(this.formattedAddress) };
        }
        this.viewContactDialog = false;
      },
      formatAddress(address) {
        return `${address.street}, ${address.suite}, ${address.city}, ${address.zipcode}`;
      },
      parseAddress(addressString) {
        const [street, suite, city, zipcode] = addressString.split(", ");
        return { street, suite, city, zipcode };
      },
      async openNewContactDialog() {
        this.resetNewContact(); // Ensure fields are empty
        this.addContactDialog = true; // Ensure this state is set before opening
        await this.$nextTick(); // Wait for the next DOM update cycle
      },
      closeAddContactDialog() {
        this.addContactDialog = false;
        this.resetNewContact();
      },
      saveNewContact() {
        // Add logic to save the new contact
        this.contacts.push({ ...this.newContact, id: this.contacts.length + 1 });
        this.resetNewContact();
        this.closeAddContactDialog();
      },
      resetNewContact() {
        this.newContact = {
          name: '',
          email: '',
          phone: '',
          website: '',
          company: '',
          address: ''
        };
      },
      selectContact(contact, ) {
        this.currentSelectedContact = { ...contact }; // Create a copy of the selected contact's data
        this.viewContactDialog = true;
        // Wait for the dialog to be rendered before initializing the map
        this.$nextTick(() => {
          if (contact.address.geo) {
            this.initializeMap(contact.address.geo.lat, contact.address.geo.lng);
          }
        });
      },
      initializeMap(latitude, longitude) {
        const map = new atlas.Map("azure-map", {
          center: [parseFloat(longitude), parseFloat(latitude)],
          zoom: this.zoom || 2,
          style: "road",
          authOptions: {
            authType: "subscriptionKey",
            subscriptionKey: this.azureMapsKey,
          },
        });

        // Add a marker after the map is ready
        map.events.add("ready", () => {
          const marker = new atlas.HtmlMarker({
            position: [parseFloat(longitude), parseFloat(latitude)],
            text: "📍",
          });
          map.markers.add(marker);
        });
      },
      exportContacts() {
        this.exportDialog = true;
      },
      downloadCSV() {
        if (!this.selectedExportContacts.length) {
          alert("No contacts selected for export.");
          return;
        }

        // Generate CSV headers
        const headers = this.exportHeaders.map((header) => header.title).join(",");

        // Generate CSV rows
        const rows = this.selectedExportContacts.map((contact) => {
          return [
            contact.name || "",
            contact.email || "",
            contact.phone || "",
            contact.website || "",
            (contact.company && contact.company.name) || "",
            contact.address ? contact.address.street : "",
          ].join(",");
        });

        // Combine headers and rows
        const csvContent = [headers, ...rows].join("\n");

        // Create and download CSV
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "contacts.csv";
        link.click();
      },
      openExternalLink(url) {
        window.open(url, "_blank"); // Opens the link in a new tab
      },
      logout() {
        // Implement logout functionality
        console.log('Logging out');
      }
    },
    mounted() {
      this.fetchContacts();
      this.checkScreenSize();
      window.addEventListener('resize', this.checkScreenSize);
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.checkScreenSize);
    },
  };
</script>



<style scoped>

  .contact-count {
    color: white;
    font-weight: inherit;
    font-size: 0.8rem; /* Slightly smaller than the main title */
    padding: 0 6px; /* Add some padding for spacing */
    border-radius: 4px; /* Optional: round edges if needed */
    background: rgba(255, 255, 255, 0.2); /* Semi-transparent background */
  }

  /* Specific styles for the Floating Action Button(FAB) */
  .fab-button {
    border-radius: 50%; /* Make it round */
    padding: 30px;
    position: fixed !important;
    bottom: 48px !important;
    right: 64px !important;
    box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.3), /* Larger blur and spread */
    0px 2px 10px rgba(0, 0, 0, 0.2); /* Additional shadow layer */
    z-index: 1000;
    display: flex; /* Center the icon */
    justify-content: center;
    align-items: center;
  }

  @media (max-width: 600px) { /* For mobile device */
    .fab-button {
      border-radius: 50%; /* Make it round */
      bottom: 32px !important;
      right: 0px !important;
    }
  }

  .fab-button:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }

  .fixed {
    z-index: 1000; /* Ensure it stays on top */
  }

  .v-list-item-title {
    font-size: 14px; /* Ensure the font size matches the tile width */
  }

  .contact-detail {
    gap: 8px; /* Adds spacing between icon and text */
  }
</style>
