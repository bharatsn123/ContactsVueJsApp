<template>
  <v-app>
    <v-app-bar app color="primary" dark elevation="2" class="toolbar-spacing">
      <v-container>
        <v-row align="center">
          <!-- App Name with Contacts Icon -->
          <v-col cols="12" sm="3" class="d-flex align-center">
            <v-icon left class="white--text">mdi-account-group</v-icon> <!-- Contacts Icon -->
            <v-toolbar-title class="white--text ml-2">Contacts App</v-toolbar-title> <!-- Added ml-2 for margin -->
          </v-col>

          <!-- Search and Sort -->
          <v-col cols="12" sm="9">
            <v-row align="center" justify="end" no-gutters>
              <v-col cols="auto" class="mr-2">
                <v-select v-model="searchType"
                          :items="searchOptions"
                          dense
                          hide-details
                          outlined
                          style="max-width: 120px;"></v-select>
              </v-col>
              <v-col>
                <v-text-field v-model="searchQuery"
                              :label="`Search by ${searchType}`"
                              append-icon="mdi-magnify"
                              outlined
                              dense
                              hide-details></v-text-field>
              </v-col>
              <v-col cols="auto" class="ml-2">
                <v-btn text @click="toggleSortOrder" class="sort-button">
                  <v-icon left>{{ sortAscending ? 'mdi-sort-ascending' : 'mdi-sort-descending' }}</v-icon>
                  Sort
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
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



        <!-- Contact Details Dialog -->
        <v-dialog v-model="dialog" max-width="900px">
          <v-card v-if="selectedContact">
            <v-card-title>Edit Contact</v-card-title>
            <v-card-text>
              <v-text-field v-model="selectedContact.name"
                            label="Name"
                            outlined
                            dense></v-text-field>
              <v-text-field v-model="selectedContact.email"
                            label="Email"
                            outlined
                            dense></v-text-field>
              <v-text-field v-model="selectedContact.phone"
                            label="Phone"
                            outlined
                            dense></v-text-field>
              <v-text-field v-model="selectedContact.website"
                            label="Website"
                            outlined
                            dense></v-text-field>
              <v-text-field v-model="selectedContact.company.name"
                            label="Company"
                            outlined
                            dense></v-text-field>
              <v-textarea v-model="formattedAddress"
                          label="Address"
                          outlined
                          dense></v-textarea>
            </v-card-text>
            <v-card-actions>
              <v-btn color="green" text @click="updateContact">Save</v-btn>
              <v-btn color="red" text @click="dialog = false">Close</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-container>
    </v-main>

    <!-- Footer -->
    <v-footer app color="primary" dark padless>
      <span class="mx-auto">&copy; 2024 Contacts App</span>
    </v-footer>
  </v-app>
</template>



<script>
  import axios from "axios";

  export default {
    name: "App",
    data() {
      return {
        contacts: [],
        searchQuery: "",
        searchType: "name",
        searchOptions: ["name", "company", "email"],
        dialog: false,
        selectedContact: null,
        selectedContactIndex: null,
        formattedAddress: "",
        sortAscending: true, // Controls the sort order
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
      },
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
</style>
