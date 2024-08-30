<template>
    <div>
        <h1>Companies</h1>
        <br />
        <br />
        <form @submit.prevent="handleSubmit()">
            <input placeholder="Enter new company" v-model="newCompany" />
            <button type="submit">Add</button>
        </form>
        <br />
        <br />
        <ul>
            <li v-for="company in companyList" :key="company.companyId" style="color: black; display: block;">
                <input
                    v-if="company.isEditing"
                    v-model="company.companyName"
                    @keyup.enter="updateCompany(company)"
                    @blur="cancelEdit(company)"
                />
                <span v-else @dblclick="editCompany(company)">
                    {{ company.companyName }}
                </span>
                <button @click="deleteCompany(company.companyId)">Delete</button>
            </li>
        </ul>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'HomePage',
    data() {
        return {
            companyList: [],
            newCompany: "",
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
                const newCompanyData = { companyName: this.newCompany };
                const response = await axios.post('https://localhost:7240/api/Company', newCompanyData);
                this.companyList.push(response.data);
                this.newCompany = "";
            } catch (error) {
                console.log(error);
            }
        },
        editCompany(company) {
            company.isEditing = true;
        },
        cancelEdit(company) {
            company.isEditing = false;
            this.fetchCompanies(); 
        },
        async updateCompany(company) {
            try {
                const updatedCompanyData = { companyName: company.companyName };
                await axios.put(`https://localhost:7240/api/Company/${company.companyId}`, updatedCompanyData);
                company.isEditing = false;
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
        }
    },
    mounted() {
        this.fetchCompanies();
    },
}
</script>
