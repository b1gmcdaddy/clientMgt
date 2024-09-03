<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <h1>Employees</h1>
                <v-table>
                    <thead>
                        <tr>
                            <th style="text-align: center; font-weight: bolder;">FullName</th>
                            <th style="text-align: center; font-weight: bolder;">Email</th>
                            <th style="text-align: center; font-weight: bolder;">Addresses</th>
                            <th style="text-align: center; font-weight: bolder;">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="emp in empList" :key="emp.employeeId">
                            <td>{{ emp.firstName }} {{ emp.lastName }}</td>
                            <td>{{ emp.email }}</td>
                            <td>
                                <v-list dense v-if="emp.addresses && emp.addresses.length > 0">
                                    <v-list-item v-for="address in emp.addresses" :key="address.id">
                                        <v-list-item-content>
                                            {{ address.street }} {{ address.city }} {{ address.postalCode }}
                                            <v-chip v-if="address.isDefault" color="green" label>(DEFAULT)</v-chip>
                                        </v-list-item-content>
                                    </v-list-item>
                                </v-list>
                                <span v-else>No addresses</span>
                            </td>
                            <td>
                                <v-btn color="primary" @click="editEmployee(emp)">Edit</v-btn>
                                <v-btn color="error" @click="deleteEmployee(emp.employeeId)">Delete</v-btn>
                            </td>
                        </tr>
                    </tbody>
                </v-table>
            </v-col>
        </v-row>

        <v-divider class="my-6"></v-divider>

        <v-row>
            <v-col cols="12">
                <h3>Employee Form</h3>
                <v-form @submit.prevent="isEditing ? updateEmployee() : createEmployee()">
                    <v-text-field v-model="currentEmp.firstName" label="Enter firstname..." outlined></v-text-field>
                    <v-text-field v-model="currentEmp.lastName" label="Enter last name..." outlined></v-text-field>
                    <v-text-field v-model="currentEmp.email" label="Enter email..." outlined type="email"></v-text-field>
                    <select v-model="selectedDepartment">
                        <option value="" disabled>Select a Department</option>
                        <option v-for="dept in deptList" :key="dept.departmentId" :value="dept.departmentId">
                            {{ dept.departmentName }}
                        </option>
                    </select>
                    <v-btn type="submit" color="success">{{ isEditing ? 'Update Employee' : 'Add Employee' }}</v-btn>
                    <v-btn v-if="isEditing" @click="cancelEdit" color="grey">Cancel</v-btn>
                </v-form>
            </v-col>
        </v-row>

        <v-divider class="my-6"></v-divider>

        <v-row>
            <v-col cols="12">
                <h3>Addresses Form</h3>
                <v-form @submit.prevent="createAddress()">
                    <v-text-field v-model="currentAddress.street" label="Enter street..." outlined></v-text-field>
                    <v-text-field v-model="currentAddress.city" label="Enter city..." outlined></v-text-field>
                    <v-text-field v-model="currentAddress.postalCode" label="Enter postal code..." outlined></v-text-field>
                    <select v-model="currentAddress.isDefault">
                        <option value="" disabled>Default?</option>
                        <option value="True">True</option>
                        <option value="False">False</option>
                    </select>
                    <select v-model="selectedEmp">
                        <option value="" disabled>Select an Employee</option>
                        <option v-for="emp in empList" :key="emp.employeeId" :value="emp.employeeId">
                            {{ emp.firstName }} {{ emp.lastName }}
                        </option>
                    </select>
                    <v-btn type="submit" color="success">Add Address</v-btn>
                </v-form>
            </v-col>
        </v-row>
    </v-container>
</template>



<script>
import axios from 'axios';

export default {
    name: 'EmployeePage',
    data() {
        return {
            empList: [],
            deptList: [],
            addressList: [],
            currentEmp: {
                firstName: '',
                lastName: '',
                email: ''
            },
            selectedDepartment: '',
            isEditing: false,
            selectedEmployeeId: null,
            isEditingAddress: false,
            currentAddress: {
                street: '',
                city: '',
                postalCode: '',
                isDefault: true,
            },
            selectedEmp: '',
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
        async fetchAddresses() {
            try {
                const res = await axios.get(`https://localhost:7240/api/Address`);
                this.addressList = res.data;
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
        async createAddress() {
            try {
                const newAddress = {
                    street: this.currentAddress.street,
                    city: this.currentAddress.city,
                    postalCode: this.currentAddress.postalCode,
                    isDefault: this.currentAddress.isDefault
                };
                await axios.post(`https://localhost:7240/api/Address/${this.selectedEmp}`, newAddress);
                this.currentAddress.street = '';
                this.currentAddress.city = '';
                this.currentAddress.postalCode = '';
                this.currentAddress.isDefault = '';
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
        this.fetchAddresses();
    }
}
</script>
