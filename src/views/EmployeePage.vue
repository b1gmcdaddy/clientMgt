<template>
    <div>
        <h1>Employees</h1>
        <table style="margin-left: 20%; text-align: justify;">
            <thead>
                <tr>
                    <th style="padding-left: 40px;">FullName</th>
                    <th style="padding-left: 40px;">Email</th>
                    <th style="padding-left: 40px;">Addresses</th>
                    <th style="padding-left: 40px;">Action</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="emp in empList" :key="emp.employeeId">
                    <td style="padding-left: 40px;">{{ emp.firstName }} {{ emp.lastName }}</td>
                    <td style="padding-left: 40px;">{{ emp.email }}</td>
                    <td style="padding-left: 10px;">
                        <ul v-if="emp.addresses && emp.addresses.length > 0">
                            <li v-for="address in emp.addresses" :key="address.id">
                                {{ address.street }} {{ address.city }} {{ address.postalCode }}
                                <span v-if="address.isDefault" style="color: green;">(DEFAULT)</span>
                            </li>
                        </ul>
                        <span v-else style="padding-left: 30px;">No addresses</span>
                    </td>
                    <td style="padding-left: 40px;">
                        <button @click="editEmployee(emp)">Edit</button>
                        <button @click="deleteEmployee(emp.employeeId)">Delete</button>
                    </td>
                </tr>
            </tbody>
        </table>

        <hr /> <br /> <br />
        <form @submit.prevent="isEditing ? updateEmployee() : createEmployee()">
            <input v-model="currentEmp.firstName" type="text" placeholder="Enter firstname..." />
            <input v-model="currentEmp.lastName" type="text" placeholder="Enter last name..." />
            <input v-model="currentEmp.email" type="email" placeholder="Enter email..." />
            <select v-model="selectedDepartment">
                <option value="" disabled>Select a Department</option>
                <option v-for="dept in deptList" :key="dept.departmentId" :value="dept.departmentId">
                    {{ dept.departmentName }}
                </option>
            </select>
            <button type="submit">{{ isEditing ? 'Update Employee' : 'Add Employee' }}</button>
            <button v-if="isEditing" @click="cancelEdit">Cancel</button>
        </form>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'EmployeePage',
    data() {
        return {
            empList: [],
            deptList: [],
            currentEmp: {
                firstName: '',
                lastName: '',
                email: ''
            },
            selectedDepartment: '',
            isEditing: false,
            selectedEmployeeId: null
        }
    },
    methods: {
        async fetchEmployees() {
            try {
                const response = await axios.get(`https://localhost:7240/api/Employee`);
                this.empList = response.data;
            } catch (e) {
                console.log(e);
            }
        },
        async fetchDepartments() {
            try {
                const response = await axios.get(`https://localhost:7240/api/Department`);
                this.deptList = response.data;
            } catch (e) {
                console.log(e);
            }
        },
        async createEmployee() {
            try {
                const newEmpModel = {
                    firstName: this.currentEmp.firstName,
                    lastName: this.currentEmp.lastName,
                    email: this.currentEmp.email,
                    departmentId: this.selectedDepartment
                };
                const response = await axios.post(`https://localhost:7240/api/Employee/${this.selectedDepartment}`, newEmpModel);
                this.empList.push(response.data);
                this.resetForm();
                this.fetchEmployees();
            } catch (e) {
                console.log(e);
            }
        },
        async updateEmployee() {
            try {
                const updatedEmpModel = {
                    firstName: this.currentEmp.firstName,
                    lastName: this.currentEmp.lastName,
                    email: this.currentEmp.email,
                    departmentId: this.selectedDepartment
                };
                await axios.put(`https://localhost:7240/api/Employee/${this.selectedEmployeeId}`, updatedEmpModel);
                this.resetForm();
                this.fetchEmployees();
            } catch (e) {
                console.log(e);
            }
        },
        async deleteEmployee(employeeId) {
            try {
                alert("deleting employee..");
                await axios.delete(`https://localhost:7240/api/Employee/${employeeId}`);
                this.fetchEmployees();
            } catch (e) {
                console.log(e);
            }
        },
        editEmployee(emp) {
            this.currentEmp = { firstName: emp.firstName, lastName: emp.lastName, email: emp.email };
            this.selectedDepartment = emp.departmentId;
            this.selectedEmployeeId = emp.employeeId;
            this.isEditing = true;
        },
        cancelEdit() {
            this.resetForm();
        },
        resetForm() {
            this.currentEmp = { firstName: '', lastName: '', email: '' };
            this.selectedDepartment = '';
            this.isEditing = false;
            this.selectedEmployeeId = null;
        }
    },
    mounted() {
        this.fetchEmployees();
        this.fetchDepartments();
    }
}
</script>
