package com.zenithlab.security;


import com.zenithlab.data.UserDao;
import com.zenithlab.models.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Authenticate a user from the database.
 */
@Component("userDetailsService")
public class UserModelDetailsService implements UserDetailsService {

    private final Logger log = LoggerFactory.getLogger(UserModelDetailsService.class);

    private final UserDao userDao;

    public UserModelDetailsService(UserDao userDao) {
        this.userDao = userDao;
    }

    @Override
    public UserDetails loadUserByUsername(String login) throws UsernameNotFoundException {
        System.out.println("=== LOGIN ATTEMPT ===");
        System.out.println("Username: " + login);

        String lowercaseLogin = login.toLowerCase();
        User user = userDao.getByUserName(lowercaseLogin);

        System.out.println("User found: " + (user != null));
        if (user != null) {
            System.out.println("User ID: " + user.getId());
            System.out.println("Username from DB: " + user.getUsername());
            System.out.println("Password from DB (first 20 chars): " + (user.getPassword() != null ? user.getPassword().substring(0, Math.min(20, user.getPassword().length())) : "NULL"));
            System.out.println("Is Activated: " + user.isActivated());
        }
        System.out.println("===================");

        return createSpringSecurityUser(lowercaseLogin, user);
    }

    private org.springframework.security.core.userdetails.User createSpringSecurityUser(String lowercaseLogin, User user) {
        if (user == null) {
            throw new org.springframework.security.core.userdetails.UsernameNotFoundException("User " + lowercaseLogin + " was not found in the database");
        }
        if (!user.isActivated()) {
            throw new UserNotActivatedException("User " + lowercaseLogin + " was not activated");
        }
        List<GrantedAuthority> grantedAuthorities = user.getAuthorities().stream()
                .map(authority -> new SimpleGrantedAuthority(authority.getName()))
                .collect(Collectors.toList());

        System.out.println("=== CREATING SPRING SECURITY USER ===");
        System.out.println("Username: " + user.getUsername());
        System.out.println("Password hash being passed to Spring Security: " + user.getPassword());
        System.out.println("Authorities: " + grantedAuthorities);
        System.out.println("=====================================");

        return new org.springframework.security.core.userdetails.User(user.getUsername(),
                user.getPassword(),
                grantedAuthorities);
    }
}

