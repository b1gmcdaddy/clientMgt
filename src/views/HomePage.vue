<template>
    <div>
        <h1 style="text-align: center; margin-top: 2em;">Companies</h1>
        <br />
        <br />
        <v-sheet class="mx-auto" width="300">
    <v-form @submit.prevent="isEditing ? updateCompany() : handleSubmit()">
      <v-text-field
        v-model="currentCompany.companyName"
        :label="btnlabel"
      ></v-text-field>
      <v-btn style="background-color: #008000; color: white;" type="submit" block>{{ isEditing ? 'Update' : 'Add'}}</v-btn>
    </v-form>
  </v-sheet>
        <br />
        <br />

        <v-table style="max-width: 600px; width: 100%; margin: auto; text-align: center;">
    <thead>
      <tr>
        <th style="font-weight: bold; text-transform: uppercase; text-align: center; font-size: 18px;">
          Company Name
        </th>
        <th style="font-weight: bold; text-transform: uppercase; text-align: center; font-size: 18px;">
          Action 
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="company in companyList"
        :key="company.companyId"
      >
        <td>{{ company.companyName }}</td>
        <td>
            <v-btn style="background-color: yellow; color: black; margin-right: 6px;" @click="edit(company)">Update</v-btn>
            <v-btn style="background-color: red; color: white;" @click="deleteCompany(company.companyId)">Delete</v-btn>
        </td>
      </tr>
    </tbody>
  </v-table>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'HomePage',
    data() {
        return {
            companyList: [],
            currentCompany: {
                companyName: '',
            },
            isEditing: false, 
            selectedCompanyId: null,
        }
    },
    methods: {
        async fetchCompanies() {
            try {
                const response = await axios.get('https://localhost:7240/api/Company');
                this.companyList = response.data;
            } catch (error) {
                console.log(error);
            }
        },
        async handleSubmit() {
            try {
                const currentCompanyData = { companyName: this.currentCompany.companyName };
                const response = await axios.post('https://localhost:7240/api/Company', currentCompanyData);
                this.companyList.push(response.data);
                this.currentCompany.companyName = "";
            } catch (error) {
                console.log(error);
            }
        },
        async updateCompany() {
            try {
                const updatedCompanyData = { companyName: this.currentCompany.companyName };
                await axios.put(`https://localhost:7240/api/Company/${this.selectedCompanyId}`, updatedCompanyData);
                this.currentCompany.companyName = '';
                this.isEditing = false;
                this.fetchCompanies();
            } catch (error) {
                console.log(error);
            }
        },
        async deleteCompany(companyId) {
            try {
                alert('deleting company..')
                await axios.delete(`https://localhost:7240/api/Company/${companyId}`);
                this.companyList = this.companyList.filter(company => company.companyId !== companyId);
            } catch (error) {
                console.log(error);
            }
        },
        edit(company) {
            this.currentCompany = { companyName: company.companyName };
            this.selectedCompanyId = company.companyId;
            this.isEditing = true; 
        },
    },
    computed: {
        btnlabel() {
            return this.isEditing ? 'Update' : 'Add';
        }
    },
    mounted() {
        this.fetchCompanies();
    },
}
</script>
