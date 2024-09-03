<template>
    <div>
        <h1>Departments</h1>
        <br/>
        <br />
        <form @submit.prevent="addDept()">
            <input placeholder="Add a department" v-model="newDept" />
            <select v-model="selectedComapny">
                <option value="" disabled selected>Which Company</option>
                <option v-for="company in companyList" :key="company.companyId" :value="company.companyId">
                    {{ company.companyName }}
                </option>
            </select>
            <button>Add</button>
        </form>
        <br /><br /><br /><br /><br /><hr /><br /><br /><br />
        
        <select v-model="selectedDepartmentId" @change="fillEmployeeList">
            <option value="" disabled selected>Select a department</option>
            <option v-for="department in deptList" :key="department.departmentId" :value="department.departmentId">
                {{ department.departmentName }}
            </option>
        </select>

        <div v-if="selectedDepartment">
            <h2>Selected Department</h2>
            <p><strong>Name:</strong> {{ selectedDepartment.departmentName }}</p>
            <button v-if="!isEditing" @click="allowEdit()">Edit Dept</button>
            <button v-if="!isEditing" @click="deleteDept()">Delete Dept</button>
            <br />
            <br />
            <button @click="checkEmployees()">{{ seeEmployees ? "Hide Employees" : "See Employees" }}</button>
            <div v-if="isEditing">
                <form @submit.prevent="updateDept()">
                    <input v-model="editedDeptName" />
                    <button>Update</button>
                    <button @click="cancelEdit()">Cancel</button>
                </form>
            </div>
        </div>

        <div v-if="employeeList.length && seeEmployees">
            <h3>Employees in {{ selectedDepartment.departmentName }}</h3>
            <ul>
                <li v-for="employee in employeeList" :key="employee.employeeId" style="display: block;">
                    {{ employee.firstName }} {{ employee.lastName }} - {{ employee.email }}
                </li>
            </ul>
        </div>
        <div v-else-if="selectedDepartmentId && !employeeList.length">
            <p>No employees in this department..</p>
        </div>
    </div>
</template>


<script>
import axios from 'axios';

export default {
    name: 'DepartmentPage',
    data() {
        return {
            deptList: [],
            companyList: [],
            selectedDepartmentId: '',
            employeeList: [], 
            seeEmployees: false,
            newDept: '',
            selectedComapny: '',
            isEditing: false,
            editedDeptName: '',
        }
    },
    computed: {
        selectedDepartment() {
            return this.deptList.find(department => department.departmentId === this.selectedDepartmentId);
        }
    },
    methods: {
        async fetchDepartments() {
            try {
                const response = await axios.get(`https://localhost:7240/api/Department`);
                this.deptList = response.data;
            } catch (e) {
                console.log(e);
            }
        },
        async fetchCompanies() {
            try {
                const response = await axios.get('https://localhost:7240/api/Company');
                this.companyList = response.data;
            } catch (error) {
                console.log(error);
            }
        },
        async addDept() {
            try {
                const toAddDept = { departmentName: this.newDept, companyId: this.selectedComapny };
                const response = await axios.post(`https://localhost:7240/api/Department/${this.selectedComapny}`, toAddDept);
                this.deptList.push(response.data);
                this.newDept = "";
            } catch (e) {
                console.log(e);
            }
        },
        async updateDept() {
            try {
                const updatedDept = { departmentName: this.editedDeptName };
                await axios.put(`https://localhost:7240/api/Department/${this.selectedDepartmentId}`, updatedDept);
                this.fetchDepartments();
                this.editedDeptName = '';
                this.isEditing = false;
            } catch (e) {
                console.log(e);
            }
        },
        async deleteDept() {
            try {
                alert('deleting department...');
                await axios.delete(`https://localhost:7240/api/Department/${this.selectedDepartmentId}`);
                this.fetchDepartments();
                this.selectedDepartmentId = '';
                this.employeeList = [];
            } catch (e) {
                console.log(e);
            }
        },
        fillEmployeeList() {
            if (this.selectedDepartment) {
                this.employeeList = this.selectedDepartment.employees;
            } else {
                this.employeeList = [];
            }
        },
        checkEmployees() {
            this.seeEmployees = !this.seeEmployees;
        },
        allowEdit() {
            this.isEditing = true;
            this.editedDeptName = this.selectedDepartment.departmentName;
        },
        cancelEdit() {
            this.isEditing = false;
            this.editedDeptName = '';
        }
    },
    mounted() {
        this.fetchDepartments();
        this.fetchCompanies();
    },
}
</script>
