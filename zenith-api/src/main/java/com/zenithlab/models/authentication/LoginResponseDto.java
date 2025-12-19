package com.zenithlab.models.authentication;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.zenithlab.models.Profile;
import com.zenithlab.models.User;

/*
    The acronym DTO is being used for "data transfer object". It means that this type of class is specifically
    created to transfer data between the client and the server. For example, CredentialsDto represents the data a client must
    pass to the server for a login endpoint, and TokenDto represents the object that's returned from the server
    to the client from a login endpoint.
 */
public class LoginResponseDto {

    private String token;
    private UserDto user;

    public LoginResponseDto(String token, User user) {
        this.token = token;
        this.user = new UserDto(user, null);
    }

    public LoginResponseDto(String token, User user, Profile profile) {
        this.token = token;
        this.user = new UserDto(user, profile);
    }

    @JsonProperty("token")
    String getToken() {
        return token;
    }

    void setToken(String token) {
        this.token = token;
    }

    @JsonProperty("user")
    public UserDto getUser() {
        return user;
    }

    public void setUser(UserDto user) {
        this.user = user;
    }

    // Inner class to combine User and Profile data
    public static class UserDto {
        private int id;
        private String username;
        private String role;
        private String firstName;
        private String lastName;
        private String email;
        private String accountType;

        public UserDto(User user, Profile profile) {
            this.id = user.getId();
            this.username = user.getUsername();
            this.role = user.getRole().replace("ROLE_", "");
            if (profile != null) {
                this.firstName = profile.getFirstName();
                this.lastName = profile.getLastName();
                this.email = profile.getEmail();
                this.accountType = profile.getAccountType();
            } else {
                this.accountType = "PERSONAL";
            }
        }

        public int getId() { return id; }
        public String getUsername() { return username; }
        public String getRole() { return role; }
        public String getFirstName() { return firstName; }
        public String getLastName() { return lastName; }
        public String getEmail() { return email; }
        public String getAccountType() { return accountType; }
    }
}
