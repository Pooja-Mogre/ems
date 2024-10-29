package com.employeeproject.springbootbackend.service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.employeeproject.springbootbackend.model.Employee;
import com.employeeproject.springbootbackend.repository.EmployeeRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class EmployeeService {
    private static final Logger logger = LoggerFactory.getLogger(EmployeeService.class);

    @Autowired
    private EmployeeRepository employeeRepository;

    public List<Employee> getAllEmployees() {
        List<Employee> employees = employeeRepository.findAll();
        logger.info("Fetched Employees: {}", employees); // Log fetched employees
        return employees;
    }

    public Optional<Employee> getEmployeeByEmail(String email) {
        logger.info("Fetching employee by Email: {}", email);
        return employeeRepository.findByEmail(email);
    }

    public Employee addEmployee(Employee employee) {
        logger.info("Adding new employee: {}", employee);
        return employeeRepository.save(employee);
    }

    public Employee updateEmployee(Long id, Employee updatedEmployee) {
        logger.info("Updating employee with ID: {}", id);
        logger.info("Updated Employee Details: {}", updatedEmployee);

        return employeeRepository.findById(id).map(employee -> {
            // Update employee fields
            employee.setName(updatedEmployee.getName());
            employee.setEmail(updatedEmployee.getEmail());
            employee.setGender(updatedEmployee.getGender());
            employee.setPhoneNumber(updatedEmployee.getPhoneNumber());
            employee.setManagerName(updatedEmployee.getManagerName());
            employee.setCurrentProject(updatedEmployee.getCurrentProject());

            // Update project history and roles if provided
            if (updatedEmployee.getProjectHistory() != null) {
                employee.setProjectHistory(new ArrayList<>(updatedEmployee.getProjectHistory())); // Update project history
            }
            
            if (updatedEmployee.getRoles() != null) {
                employee.setRoles(new HashSet<>(updatedEmployee.getRoles())); // Update roles
            }

            employee.setPersonalEmail(updatedEmployee.getPersonalEmail());
            employee.setEmergencyContact(updatedEmployee.getEmergencyContact());

            // Save and log success
            Employee savedEmployee = employeeRepository.save(employee);
            logger.info("Employee updated successfully with ID: {}", savedEmployee.getId());
            return savedEmployee;
        }).orElseThrow(() -> {
            logger.error("Employee not found for ID: {}", id);
            return new EntityNotFoundException("Employee not found");
        });
    }


    public void deleteEmployee(Long id) {
        logger.info("Deleting employee with ID: {}", id);
        employeeRepository.deleteById(id);
    }
}
