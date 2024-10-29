package com.employeeproject.springbootbackend.model;

import java.util.List;
import java.util.Set;
import java.util.Collection;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.stream.Collectors;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

@Entity
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String name;

    @Email
    @NotEmpty
    private String email;

    @NotBlank
    private String gender;

    @NotBlank
    private String phoneNumber;

    private String managerName;

    private String currentProject;

    @ElementCollection
    private List<String> projectHistory = new ArrayList<>(); // Mutable list

    private String personalEmail;
    private String emergencyContact;

    @ElementCollection
    private Set<String> roles = new HashSet<>(); // Mutable set

    // Getters and setters...

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getManagerName() {
        return managerName;
    }

    public void setManagerName(String managerName) {
        this.managerName = managerName;
    }

    public String getCurrentProject() {
        return currentProject;
    }

    public void setCurrentProject(String currentProject) {
        this.currentProject = currentProject;
    }

    public List<String> getProjectHistory() {
        return projectHistory;
    }

    public void setProjectHistory(List<String> projectHistory) {
        this.projectHistory = projectHistory;
    }

    public String getPersonalEmail() {
        return personalEmail;
    }

    public void setPersonalEmail(String personalEmail) {
        this.personalEmail = personalEmail;
    }

    public String getEmergencyContact() {
        return emergencyContact;
    }

    public void setEmergencyContact(String emergencyContact) {
        this.emergencyContact = emergencyContact;
    }

    public Set<String> getRoles() {
        return roles;
    }

    public void setRoles(Set<String> roles) {
        this.roles = roles;
    }

    public Collection<? extends GrantedAuthority> getAuthorities() {
        return roles.stream()
            .map(role -> new SimpleGrantedAuthority("ROLE_" + role))
            .collect(Collectors.toSet());
    }
}
