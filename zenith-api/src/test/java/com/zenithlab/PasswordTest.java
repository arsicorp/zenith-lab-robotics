package com.zenithlab;

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordTest {

    @Test
    public void testPasswordHash() {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String hashedPassword = "$2a$10$lfQi9jSfhZZhfS7d1JP2/.nLYBqKGLqBVk3qTvuBDKyv9bLVLvPEy";
        String plainPassword = "password";

        boolean matches = encoder.matches(plainPassword, hashedPassword);

        System.out.println("Testing password: " + plainPassword);
        System.out.println("Against hash: " + hashedPassword);
        System.out.println("Matches: " + matches);

        if (!matches) {
            System.out.println("HASH DOES NOT MATCH! The database hash is wrong!");
        }
    }
}
