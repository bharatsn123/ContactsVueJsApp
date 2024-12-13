<template>
  <v-app>
    <v-app-bar app color="primary" dark elevation="2">
      <v-container class="py-0 fill-height d-flex align-center">
        <!-- Icon and Title -->
        <v-row align="center" class="flex-grow-0">
          <v-icon class="mr-2">mdi-account-group</v-icon>
          <v-toolbar-title class="mr-4">Contacts App</v-toolbar-title>
        </v-row>

        <!-- Spacer -->
        <v-spacer></v-spacer>

        <!-- Search Bar -->
        <v-row align="center" class="flex-grow-1">
          <v-text-field v-model="searchQuery"
                        :label="`Search by ${searchType}`"
                        prepend-inner-icon="mdi-magnify"
                        dense
                        hide-details
                        outlined
                        style="max-width: 500px;">
            <template v-slot:prepend>
              <v-select v-model="searchType"
                        :items="searchOptions"
                        dense
                        hide-details
                        flat
                        outlined
                        style="max-width: 150px;">
              </v-select>
            </template>
          </v-text-field>
        </v-row>

        <!-- Sort Button -->
        <v-btn icon class="ml-4" @click="toggleSortOrder" style="margin-left: 16px;">
          <v-icon>{{ sortAscending ? 'mdi-sort-ascending' : 'mdi-sort-descending' }}</v-icon>
        </v-btn>

        <!-- Spacer -->
        <v-spacer></v-spacer>

        <!-- Profile Menu -->
        <v-menu offset-y>
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" class="d-flex align-center" text>
              <v-avatar size="32" class="mr-2">
                <v-img src="https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250"></v-img>
              </v-avatar>
              <span class="hidden-sm-and-down font-weight-medium">John</span>
              <v-icon>mdi-chevron-down</v-icon>
            </v-btn>
          </template>

          <v-card style="min-width: 150px;">
            <v-list dense>
              <!-- Export Option -->
              <v-list-item @click="exportContacts">
                <template v-slot:prepend>
                  <v-icon small>mdi-file-document-arrow-right-outline</v-icon>
                </template>
                <v-list-item-title>Export</v-list-item-title>
              </v-list-item>

              <!-- Divider -->
              <v-divider></v-divider>

              <!-- Export Option -->
              <v-list-item @click="openExternalLink('https://github.com/bharatsn123/ContactsVueJsApp')">
                <template v-slot:prepend>
                  <v-icon small>mdi-help-circle-outline</v-icon>
                </template>
                <v-list-item-title>Documentation</v-list-item-title>
              </v-list-item>

              <!-- Divider -->
              <v-divider></v-divider>

              <!-- Log Out Option -->
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
    </v-app-bar>






    <!-- Main Content -->
    <v-main>
      <v-container>
        <!-- Add margin between navigation bar and main content -->
        <div style="margin-top: 32px;"></div>

        <!-- Contact Cards -->
        <v-row>
          <v-col v-for="contact in sortedContacts"
                 :key="contact.id"
                 cols="12"
                 sm="6"
                 md="4">
            <v-card @click="selectContact(contact)" outlined class="hoverable">
              <v-card-title>{{ contact.name }}</v-card-title>
              <v-card-subtitle>
                <div class="d-flex align-center">
                  <v-icon small left color="grey">mdi-email</v-icon>
                  {{ contact.email }}
                </div>
                <div class="d-flex align-center mt-2">
                  <v-icon small left color="grey">mdi-phone</v-icon>
                  {{ contact.phone }}
                </div>
                <div class="d-flex align-center mt-2">
                  <v-icon small left color="grey">mdi-domain</v-icon>
                  {{ contact.company.name }}
                </div>
              </v-card-subtitle>
              <v-card-actions>
                <v-btn text color="primary">View Details</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
        <v-row v-if="sortedContacts.length === 0 && searchQuery">
          <v-col cols="12" class="text-center">
            <v-alert type="info" outlined color="grey lighten-2">
              No results found for "{{ searchQuery }}"
            </v-alert>
          </v-col>
        </v-row>

        <!-- Contact Details Dialog -->
        <v-dialog v-model="dialog" max-width="900px">
          <v-card>
            <v-card-title>
              <v-avatar size="80" class="mr-4">
                <v-img :src="'https://i.pravatar.cc/150?img=' + selectedContact.id"></v-img>
              </v-avatar>
              <div>
                <h3>{{ selectedContact.name }}</h3>
                <v-icon small class="mr-2">mdi-domain</v-icon>
                <p class="text-subtitle-1 grey--text">{{ selectedContact.company.name }}</p>
              </div>
            </v-card-title>

            <v-divider></v-divider>

            <v-card-text>
              <v-container>
                <v-row>
                  <!-- Contact Info -->
                  <v-col cols="12" md="6">
                    <h4>Contact Information</h4>
                    <v-text-field v-model="selectedContact.email" label="Email" outlined dense></v-text-field>
                    <v-text-field v-model="selectedContact.phone" label="Phone" outlined dense></v-text-field>
                    <v-text-field v-model="selectedContact.website" label="Website" outlined dense></v-text-field>
                  </v-col>

                  <!-- Address Info and Map -->
                  <v-col cols="12" md="6">
                    <h4>Address</h4>
                    <p>{{ selectedContact.address.street }}, {{ selectedContact.address.suite }}</p>
                    <p>{{ selectedContact.address.city }}, {{ selectedContact.address.zipcode }}</p>

                    <!-- Azure Map Component -->
                    <div id="azure-map" style="height: 300px;"></div>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="green" text @click="updateContact">Save Changes</v-btn>
              <v-btn color="red" text @click="dialog = false">Close</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>




        <!-- Add new contact hovering button -->
        <v-fab-transition>
          <v-btn color="primary"
                 dark
                 fixed
                 bottom
                 right
                 fab
                 class="mb-8 mr-8 fab-button"
                 @click="openAddContactDialog"
                 style="position: fixed; bottom: 32px; right: 64px; border-radius: 50%; width: 40px; height: 56px;">
            <v-icon large>mdi-plus</v-icon>
          </v-btn>
        </v-fab-transition>

      </v-container>
    </v-main>

    <!-- Dialog for adding new contact -->
    <v-dialog v-model="addContactDialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Add New Contact</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field v-model="newContact.name"
                              label="Name"
                              prepend-icon="mdi-account"
                              required></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="newContact.email"
                              label="Email"
                              prepend-icon="mdi-email"
                              required></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="newContact.phone"
                              label="Phone"
                              prepend-icon="mdi-phone"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="newContact.website"
                              label="Website"
                              prepend-icon="mdi-web"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="newContact.company"
                              label="Company"
                              prepend-icon="mdi-office-building"></v-text-field>
              </v-col>
              <v-col cols="12">
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
          <v-btn color="blue darken-1" text @click="saveNewContact">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
                        v-model="selectedContacts">
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
                 :disabled="!selectedContacts.length"
                 @click="downloadCSV">
            Export
          </v-btn>
          <v-btn text @click="exportDialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Footer -->
    <v-footer app color="primary" dark padless>
      <span class="mx-auto">&copy; 2024 Contacts App</span>
    </v-footer>
  </v-app>
</template>



<script>
  import axios from "axios";
  import AzureMap from "./AzureMap.vue";

  export default {
    name: "App",
    data() {
      return {
        contacts: [],
        searchQuery: "",
        searchType: "name",
        azureMapsKey: "SyEaV43r35WFJrzD8DZXRAbhvZX1J4dJDdmKMuN3iKhQvx5FwXfLJQQJ99ALACYeBjFxoFRHAAAgAZMP2uzy",
        searchOptions: ["name", "company", "email"],
        dialog: false,
        selectedContact: null,
        selectedContactIndex: null,
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
        exportDialog: false,
        selectedContacts: [],
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
        return this.contacts.filter(contact => {
          let value = "";
          if (this.searchType === "name") {
            value = contact.name;
          } else if (this.searchType === "company") {
            value = contact.company && contact.company.name;
          } else if (this.searchType === "email") {
            value = contact.email;
          }
          return value.toLowerCase().includes(this.searchQuery.toLowerCase());
        });
      },
      sortedContacts() {
        const sorted = [...this.filteredContacts];
        sorted.sort((a, b) => {
          if (a.name.toLowerCase() < b.name.toLowerCase()) return this.sortAscending ? -1 : 1;
          if (a.name.toLowerCase() > b.name.toLowerCase()) return this.sortAscending ? 1 : -1;
          return 0;
        });
        return sorted;
      }
    },
    methods: {
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
      selectContact(contact, index) {
        this.selectedContact = JSON.parse(JSON.stringify(contact)); // Deep copy
        this.selectedContactIndex = index;
        this.formattedAddress = this.formatAddress(contact.address);
        this.dialog = true;
      },
      updateContact() {
        if (this.selectedContactIndex !== null) {
          this.contacts[this.selectedContactIndex] = {
            ...this.selectedContact,
            address: this.parseAddress(this.formattedAddress),
          };
        }
        this.dialog = false;
      },
      formatAddress(address) {
        return `${address.street}, ${address.suite}, ${address.city}, ${address.zipcode}`;
      },
      parseAddress(addressString) {
        const [street, suite, city, zipcode] = addressString.split(", ");
        return { street, suite, city, zipcode };
      },
      async openAddContactDialog() {
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
      selectContact(contact) {
        this.selectedContact = contact;
        this.dialog = true;
        // Wait for the dialog to be rendered before initializing the map
        this.$nextTick(() => {
          this.initializeMap(contact.address.geo.lat, contact.address.geo.lng);
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
        if (!this.selectedContacts.length) {
          alert("No contacts selected for export.");
          return;
        }

        // Generate CSV headers
        const headers = this.exportHeaders.map((header) => header.title).join(",");

        // Generate CSV rows
        const rows = this.selectedContacts.map((contact) => {
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
    },
  };
</script>



<style scoped>
  .toolbar-spacing {
    position: sticky;
    top: 0;
    z-index: 10;
    background-color: var(--v-primary-base);
  }

  .sort-button {
    padding: 0 8px;
    min-width: 0;
    font-size: 14px;
    color: white;
  }

  .hoverable:hover {
    cursor: pointer;
    background-color: #f5f5f5;
  }

  .white--text {
    color: white !important;
  }

  /* Specific styles for the FAB */
  .fab-button {
    border-radius: 50%; /* Make it round */
    width: 56px; /* Set width */
    height: 56px; /* Set height */
    box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.3), /* Larger blur and spread */
    0px 2px 10px rgba(0, 0, 0, 0.2); /* Additional shadow layer */
  }

    .fab-button:hover {
      background-color: rgba(255, 255, 255, 0.2); /* Optional hover effect */
    }

  .fixed {
    z-index: 1000; /* Ensure it stays on top */
  }

  .custom-list-item {
    min-width: 150px; /* Make each tile 1.5x wider */
    padding: 12px 16px; /* Adjust padding for better spacing */
  }

  .v-list-item-avatar {
    margin-right: 12px; /* Spacing between icon and title */
  }

  .v-list-item-title {
    font-size: 14px; /* Ensure the font size matches the tile width */
  }
</style>
